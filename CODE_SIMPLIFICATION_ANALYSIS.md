# 코드 단순화 분석 보고서
**프로젝트**: ideatoprd (Next.js PRD 생성 서비스)
**분석 대상**: API, 페이지, 훅, UI 컴포넌트
**분석일**: 2025-01-16

---

## 목차
1. [핵심 문제 요약](#핵심-문제-요약)
2. [상세 분석](#상세-분석)
3. [단순화 제안](#단순화-제안)
4. [구현 우선순위](#구현-우선순위)

---

## 핵심 문제 요약

### 주요 발견사항
| 문제 | 심각도 | 영향 범위 |
|------|--------|---------|
| 중복된 HTTP 응답 구성 | 중간 | 3개 파일 |
| 반복되는 크레딧 검증 로직 | 중간 | 2개 파일 |
| 콜백 의존성 배열 누락 | 높음 | 1개 파일 |
| 과도한 조건부 렌더링 | 중간 | 2개 파일 |
| 중복된 상태 관리 변수 | 낮음 | 1개 파일 |
| 프롬프트 문자열 반복 | 낮음 | 1개 파일 |

---

## 상세 분석

### 1. API 라우트 (route.ts) - 81줄, 3단계 중첩

**파일**: `/Volumes/SSD/project/nextjs/ideatoprd/app/api/generate-prd/route.ts`

#### 문제 1.1: 중복된 HTTP 응답 래핑
```typescript
// 현재: 3번 반복
return new Response(JSON.stringify({ error: '...' }), {
  status: 400,
  headers: { 'Content-Type': 'application/json' },
});
```

**영향**: 코드 6줄 중복, 유지보수 어려움

**제안**: 응답 헬퍼 함수 생성
```typescript
function createJsonResponse(data: unknown, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// 사용
return createJsonResponse({ error: '로그인이 필요합니다.' }, 401);
```

**단순화 효과**: 6줄 → 1줄 (5줄 감소), 3회 반복 제거

---

#### 문제 1.2: 분산된 크레딧 검증 로직
```typescript
// 라인 58-84: 개발 환경 조건 + 크레딧 차감
const isDev = process.env.NODE_ENV === 'development';

if (!isDev) {
  const { data: deductResult, error: deductError } = await supabase.rpc(...);
  // 에러 처리...
} else {
  console.log('[DEV] Skipping credit deduction');
}
```

**문제점**:
- 개발 환경 판단이 중복됨 (라인 28, 59)
- 크레딧 차감 로직이 메인 함수에 인라인됨
- 테스트 불가능한 구조

**제안**: 별도 함수로 추출
```typescript
async function deductCredits(
  supabase: SupabaseClient,
  userId: string,
  creditsRequired: number,
  description: string
): Promise<{ success: boolean; error?: string }> {
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    console.log('[DEV] Skipping credit deduction');
    return { success: true };
  }

  const { data, error } = await supabase.rpc('deduct_credit', {
    p_user_id: userId,
    p_amount: creditsRequired,
    p_description: description,
  });

  if (error || !data) {
    return { success: false, error: '크레딧이 부족합니다.' };
  }

  return { success: true };
}

// 사용
const creditResult = await deductCredits(
  supabase,
  userId,
  creditsRequired,
  `PRD 생성: ${idea.slice(0, 50)}...`
);

if (!creditResult.success) {
  return createJsonResponse({ error: creditResult.error }, 402);
}
```

**단순화 효과**:
- route.ts에서 26줄 감소
- 별도 함수로 테스트 가능
- 개발/프로덕션 로직 분리

---

#### 문제 1.3: 프롬프트 빌드 이중 조건
```typescript
// 라인 87-99
const model = version === 'detailed' ? advancedModel : defaultModel;

const userPrompt = `
...
버전: ${version === 'detailed' ? '상세 (Detailed)' : '기본 (Basic)'}
...
${version === 'basic' ? '핵심 섹션만...' : '모든 섹션을...'}
`;
```

**문제점**: 같은 조건이 2번 반복, 문자열 리터럴 분산

**제안**: 상수 맵으로 통합
```typescript
const VERSION_CONFIG = {
  basic: {
    model: defaultModel,
    maxTokens: 4096,
    displayName: '기본 (Basic)',
    instruction: '핵심 섹션만 간략하게 작성해주세요.',
  },
  detailed: {
    model: advancedModel,
    maxTokens: AI_CONFIG.maxTokens,
    displayName: '상세 (Detailed)',
    instruction: '모든 섹션을 상세하게 작성해주세요.',
  },
} as const;

const config = VERSION_CONFIG[version];
const model = config.model;
const userPrompt = `
<user_input>
아이디어: ${idea}
버전: ${config.displayName}
</user_input>

위 아이디어에 대한 PRD를 생성해주세요.
${config.instruction}
`;
const maxOutputTokens = config.maxTokens;
```

**단순화 효과**:
- 조건문 3개 → 1개
- 설정 중앙화로 유지보수성 증대
- 새 버전 추가 시 1곳만 수정

---

### 2. 생성 페이지 (generate/page.tsx) - 190줄, 4단계 중첩

**파일**: `/Volumes/SSD/project/nextjs/ideatoprd/app/(protected)/generate/page.tsx`

#### 문제 2.1: 반복되는 크레딧 검증 (라인 27-36, 53-58)
```typescript
// 첫 번째 체크 (라인 28-36)
const isDev = process.env.NODE_ENV === 'development';
const creditsNeeded = CREDITS_PER_VERSION[data.version];
const currentCredits = profile?.credits ?? 0;

if (!isDev && currentCredits < creditsNeeded) {
  // 모달 표시...
}

// 두 번째 체크 (라인 53-58) - API 응답 처리
if (response.status === 402) {
  setRequiredCredits(creditsNeeded);
  setShowCreditModal(true);
  // ...
}
```

**문제점**:
- 크레딧 검증 로직이 2곳에 분산됨
- 모달 상태 업데이트가 반복됨
- 로직 변경 시 2곳 수정 필요

**제안**: 크레딧 검증 커스텀 훅
```typescript
function useCreditsCheck(
  profile: Profile | null,
  creditsPerVersion: Record<PRDVersion, number>
) {
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [requiredCredits, setRequiredCredits] = useState(0);
  const isDev = process.env.NODE_ENV === 'development';

  const canGenerate = (version: PRDVersion): boolean => {
    const currentCredits = profile?.credits ?? 0;
    const needed = creditsPerVersion[version];
    return isDev || currentCredits >= needed;
  };

  const showInsufficientCredits = (version: PRDVersion) => {
    setRequiredCredits(creditsPerVersion[version]);
    setShowCreditModal(true);
  };

  return {
    showCreditModal,
    setShowCreditModal,
    requiredCredits,
    canGenerate,
    showInsufficientCredits,
  };
}

// 사용
const handleGenerate = useCallback(
  async (data: { idea: string; template: PRDTemplate; version: PRDVersion }) => {
    if (!creditsCheck.canGenerate(data.version)) {
      creditsCheck.showInsufficientCredits(data.version);
      return;
    }

    // ... API 호출
    if (response.status === 402) {
      creditsCheck.showInsufficientCredits(data.version);
      return;
    }
  },
  [creditsCheck]
);
```

**단순화 효과**:
- 페이지 컴포넌트에서 로직 제거
- 테스트 가능한 분리된 훅
- 중복 제거

---

#### 문제 2.2: 스트리밍 처리 중첩 (라인 63-77)
```typescript
const reader = response.body?.getReader();
const decoder = new TextDecoder();

if (!reader) {
  throw new Error('스트리밍을 시작할 수 없습니다.');
}

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value, { stream: true });
  setContent((prev) => prev + chunk);
}
```

**문제점**:
- 15줄의 스트리밍 로직이 페이지에 인라인됨
- 테스트 불가능
- 재사용성 없음

**제안**: 커스텀 훅으로 추출
```typescript
function useStreamResponse() {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const processStream = async (response: Response): Promise<void> => {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('스트리밍을 시작할 수 없습니다.');
    }

    const decoder = new TextDecoder();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setContent((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      throw err instanceof Error ? err : new Error('스트리밍 처리 실패');
    }
  };

  return { content, setContent, error, setError, processStream };
}

// 사용
const stream = useStreamResponse();
await stream.processStream(response);
```

**단순화 효과**:
- 페이지에서 15줄 제거
- 재사용 가능한 스트리밍 로직
- 에러 처리 개선

---

#### 문제 2.3: 중복된 변수명 (라인 12, 124)
```typescript
const [isGenerating, setIsGenerating] = useState(false);
// ...
const { profile, isLoading: isUserLoading, refetch } = useUser();
// ...
isLoading: isUserLoading  // 리네이밍 함
```

**문제점**:
- `useUser()` 반환값이 `loading`과 `isLoading` 동시 제공 (라인 12, 124 참고)
- 불명확한 상태 체크 로직 (라인 103)

**제안**: `use-user.ts` 훅 개선
```typescript
// use-user.ts
export function useUser(): UseUserReturn {
  // loading, isLoading 중 하나만 제공
  return {
    user,
    profile,
    isLoading: loading,  // 통합: 'loading'은 제거
    error,
    isAuthenticated: !!user,
    refetch,
  };
}

// page.tsx - 간단해짐
const { profile, isLoading, refetch } = useUser();
if (isLoading && !profile) {
  return <LoadingSpinner />;
}
```

**단순화 효과**:
- 훅 사용자 측에서 혼동 제거
- 1줄 코드 감소

---

### 3. useUser 훅 (use-user.ts) - 130줄

**파일**: `/Volumes/SSD/project/nextjs/ideatoprd/src/features/auth/hooks/use-user.ts`

#### 문제 3.1: 중복된 상태 변수 (라인 11-12, 24-25)
```typescript
interface UseUserReturn {
  user: User | null;
  profile: Profile | null;
  loading: boolean;           // ←
  isLoading: boolean;         // ← 같은 값
  error: Error | null;
  // ...
}

// 훅 내부
const [loading, setLoading] = useState(true);
// ...
return {
  // ...
  loading,
  isLoading: loading,         // 중복
  // ...
};
```

**문제점**: `loading`과 `isLoading`이 동일한 값 제공

**제안**: 하나만 제공
```typescript
interface UseUserReturn {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  refetch: () => Promise<void>;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const loadingRef = useRef(true);

  // ... 나머지 로직

  return {
    user,
    profile,
    isLoading,
    error,
    isAuthenticated: !!user,
    refetch,
  };
}
```

**단순화 효과**: 변수 1개 제거, 인터페이스 간결화

---

#### 문제 3.2: 불필요한 Ref + 상태 중복 (라인 27, 78-90)
```typescript
const loadingRef = useRef(true);
// ...
useEffect(() => {
  // ...
  loadingRef.current = false;
  setLoading(false);  // 두 곳에서 업데이트

  // ... 타임아웃 5초
  const timeout = setTimeout(() => {
    if (isMounted && loadingRef.current) {
      loadingRef.current = false;
      setLoading(false);  // 또 업데이트
    }
  }, 5000);
}, [fetchProfile]);
```

**문제점**:
- 같은 값을 Ref와 State로 중복 관리
- 5초 타임아웃이 과도함 (스트리밍 API와 충돌 가능)
- 타임아웃 정리가 누락될 수 있음

**제안**: Ref 제거, Promise 기반으로 변경
```typescript
export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initializeUser(): Promise<void> {
      try {
        const supabase = createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (!isMounted) return;
        if (error) throw error;

        setUser(user);

        if (user) {
          const profileData = await fetchProfile(user.id);
          if (isMounted) {
            setProfile(profileData);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch user'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initializeUser();

    const { data: { subscription } } = createClient().auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const refetch = useCallback(async () => {
    if (!user) return;
    const profileData = await fetchProfile(user.id);
    setProfile(profileData);
  }, [user]);

  return {
    user,
    profile,
    isLoading,
    error,
    isAuthenticated: !!user,
    refetch,
  };
}

// fetchProfile을 외부로 추출
async function fetchProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return error ? null : data;
}
```

**단순화 효과**:
- Ref 제거 (1개 변수)
- 타임아웃 제거 (불필요한 복잡성)
- 35줄 감소
- 동기화 오류 제거

---

#### 문제 3.3: 의존성 배열 누락 위험
```typescript
const fetchProfile = useCallback(async (userId: string) => {
  // ...
}, []);  // ← 의존성 없음 (OK, 순수 함수)

const refetch = useCallback(async () => {
  if (!user) return;
  const profileData = await fetchProfile(user.id);
  setProfile(profileData);
}, [user, fetchProfile]);  // ← fetchProfile 의존성
```

**현재 코드에서는 실제 버그는 아니지만**, `fetchProfile`이 실제로는 `supabase` 클라이언트를 캡처하고 있으므로 변수명이 오도할 수 있음.

**제안**: 의존성 명확화
```typescript
const refetch = useCallback(
  async () => {
    if (!user?.id) return;
    const profileData = await fetchProfile(user.id);
    if (profileData) {
      setProfile(profileData);
    }
  },
  [user?.id]  // user 전체가 아닌 user.id만 의존
);
```

---

### 4. PRD Viewer 컴포넌트 (prd-viewer.tsx) - 157줄

**파일**: `/Volumes/SSD/project/nextjs/ideatoprd/src/features/prd-generation/ui/prd-viewer.tsx`

#### 문제 4.1: 과도한 Tailwind 클래스 (라인 77-96)
```typescript
<article className="prose prose-neutral dark:prose-invert max-w-none
  prose-headings:font-bold prose-headings:tracking-tight
  prose-h1:text-3xl prose-h1:text-foreground prose-h1:mb-4
  prose-h2:text-2xl prose-h2:text-foreground prose-h2:mt-8 prose-h2:mb-3 prose-h2:border-b prose-h2:border-border prose-h2:pb-2
  prose-h3:text-xl prose-h3:text-foreground prose-h3:mt-6 prose-h3:mb-2
  // ... 20줄 이상
">
```

**문제점**:
- 20줄 이상의 클래스 스트링
- 유지보수 어려움
- 재사용성 없음

**제안**: 별도 CSS 모듈 또는 상수 추출
```typescript
// constants.ts
export const PROSE_STYLES = 'prose prose-neutral dark:prose-invert max-w-none ' +
  'prose-headings:font-bold prose-headings:tracking-tight ' +
  'prose-h1:text-3xl prose-h1:text-foreground prose-h1:mb-4 ' +
  'prose-h2:text-2xl prose-h2:text-foreground prose-h2:mt-8 prose-h2:mb-3 prose-h2:border-b prose-h2:border-border prose-h2:pb-2 ' +
  'prose-h3:text-xl prose-h3:text-foreground prose-h3:mt-6 prose-h3:mb-2 ' +
  // ... 나머지
  'prose-hr:border-border';

// 또는 globals.css
@layer components {
  .prose-custom {
    @apply prose prose-neutral dark:prose-invert max-w-none;
    @apply prose-headings:font-bold prose-headings:tracking-tight;
    @apply prose-h1:text-3xl prose-h1:text-foreground prose-h1:mb-4;
    /* ... */
  }
}

// prd-viewer.tsx
<article className="prose-custom">
```

**단순화 효과**: 20줄 → 1줄

---

#### 문제 4.2: 라인 100-102의 복잡한 객체
```typescript
components={{
  code: CodeBlock,
  table: ResponsiveTable,
}}
```

**해석**: 이는 실제로는 간단하고 좋은 패턴입니다. 개선 불필요.

---

### 5. PRD Form 컴포넌트 (prd-form.tsx) - 202줄

**파일**: `/Volumes/SSD/project/nextjs/ideatoprd/src/features/prd-generation/ui/prd-form.tsx`

#### 문제 5.1: 이중 버튼 구조 반복 (라인 90-158)
```typescript
<button type="button" onClick={() => setVersion('basic')} /* 라인 90-121 */>
  {/* 많은 조건부 클래스 */}
</button>

<button type="button" onClick={() => setVersion('detailed')} /* 라인 123-158 */>
  {/* 거의 동일한 구조 */}
</button>
```

**문제점**:
- 버튼 구조가 68줄 차지
- 거의 동일한 로직 반복
- DRY 위반

**제안**: 버전 선택 버튼 컴포넌트 추출
```typescript
interface VersionButtonProps {
  version: PRDVersion;
  label: string;
  credits: number;
  description: string;
  isRecommended?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  isSelected: boolean;
  isLoading: boolean;
  onSelect: () => void;
}

function VersionButton({
  version,
  label,
  credits,
  description,
  isRecommended = false,
  icon: Icon,
  isSelected,
  isLoading,
  onSelect,
}: VersionButtonProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={isLoading}
      className={cn(
        'group relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all duration-200',
        isSelected
          ? 'border-brand-primary bg-brand-secondary/30'
          : 'border-border hover:border-brand-primary/30 hover:bg-muted/30'
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex size-10 items-center justify-center rounded-lg transition-colors',
            isSelected
              ? version === 'detailed'
                ? 'bg-gradient-to-br from-brand-primary to-brand-accent text-white'
                : 'bg-brand-primary text-white'
              : 'bg-muted/50 text-muted-foreground group-hover:bg-foreground/5'
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="flex-1">
          <span className="font-semibold text-foreground">{label}</span>
          <span className="ml-2 text-sm text-muted-foreground">{credits} 크레딧</span>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {isSelected && (
        <div className="absolute right-3 top-3 size-2 rounded-full bg-brand-primary" />
      )}
      {isRecommended && (
        <div className="absolute -right-8 top-3 rotate-45 bg-brand-primary px-8 py-0.5 text-[10px] font-semibold text-white">
          추천
        </div>
      )}
    </button>
  );
}

// PRDForm에서 사용
<div className="grid grid-cols-2 gap-3">
  <VersionButton
    version="basic"
    label="기본"
    credits={1}
    description="핵심 섹션만 포함"
    icon={FileText}
    isSelected={version === 'basic'}
    isLoading={isLoading}
    onSelect={() => setVersion('basic')}
  />
  <VersionButton
    version="detailed"
    label="상세"
    credits={2}
    description="모든 섹션 상세 작성"
    icon={Zap}
    isSelected={version === 'detailed'}
    isLoading={isLoading}
    onSelect={() => setVersion('detailed')}
    isRecommended
  />
</div>
```

**단순화 효과**:
- prd-form.tsx에서 70줄 제거
- 버튼 로직 재사용 가능
- 유지보수 용이

---

## 단순화 제안 요약

### 제안 1: 응답 헬퍼 함수 (우선순위: 높음)
**파일**: `/Volumes/SSD/project/nextjs/ideatoprd/app/api/generate-prd/route.ts`
**감소 줄 수**: 6줄
**구현 시간**: 5분

### 제안 2: 크레딧 검증 함수 추출 (우선순위: 높음)
**파일**: `/Volumes/SSD/project/nextjs/ideatoprd/app/api/generate-prd/route.ts`
**감소 줄 수**: 26줄
**구현 시간**: 10분

### 제안 3: 버전 설정 상수 (우선순위: 중간)
**파일**: `/Volumes/SSD/project/nextjs/ideatoprd/app/api/generate-prd/route.ts`
**감소 줄 수**: 10줄
**구현 시간**: 10분

### 제안 4: 크레딧 검증 훅 (우선순위: 중간)
**파일**: `/Volumes/SSD/project/nextjs/ideatoprd/app/(protected)/generate/page.tsx`
**감소 줄 수**: 20줄
**구현 시간**: 15분

### 제안 5: 스트리밍 훅 (우선순위: 중간)
**파일**: `/Volumes/SSD/project/nextjs/ideatoprd/app/(protected)/generate/page.tsx`
**감소 줄 수**: 15줄
**구현 시간**: 10분

### 제안 6: useUser 훅 단순화 (우선순위: 높음)
**파일**: `/Volumes/SSD/project/nextjs/ideatoprd/src/features/auth/hooks/use-user.ts`
**감소 줄 수**: 35줄
**구현 시간**: 15분

### 제안 7: VersionButton 컴포넌트 (우선순위: 낮음)
**파일**: `/Volumes/SSD/project/nextjs/ideatoprd/src/features/prd-generation/ui/prd-form.tsx`
**감소 줄 수**: 70줄
**구현 시간**: 20분

### 제안 8: Prose 스타일 상수화 (우선순위: 낮음)
**파일**: `/Volumes/SSD/project/nextjs/ideatoprd/src/features/prd-generation/ui/prd-viewer.tsx`
**감소 줄 수**: 20줄
**구현 시간**: 5분

---

## 구현 우선순위

### Phase 1 (즉시 구현 권장) - 35분
1. ✅ 응답 헬퍼 함수
2. ✅ 크레딧 검증 함수
3. ✅ useUser 훅 단순화

**효과**:
- 총 67줄 감소
- 코드 중복 제거
- 테스트 가능성 증가

### Phase 2 (다음 스프린트) - 40분
4. 버전 설정 상수
5. 크레딧 검증 훅
6. 스트리밍 훅

**효과**:
- 총 45줄 감소
- 페이지 컴포넌트 복잡도 감소
- 재사용 가능한 로직 분리

### Phase 3 (선택사항) - 25분
7. VersionButton 컴포넌트
8. Prose 스타일 상수화

**효과**:
- 총 90줄 감소
- 컴포넌트 응집도 향상
- 디자인 일관성 개선

---

## 예상 효과

| 메트릭 | 현재 | Phase 1 | Phase 1+2 | Phase 1+2+3 |
|--------|------|---------|-----------|------------|
| 총 코드 줄 수 | 760줄 | 693줄 | 648줄 | 558줄 |
| 감소율 | - | 8.8% | 14.7% | 26.6% |
| 중복 코드 | 높음 | 중간 | 낮음 | 매우 낮음 |
| 테스트 가능도 | 중간 | 높음 | 매우 높음 | 매우 높음 |
| 유지보수성 | 중간 | 중상 | 높음 | 매우 높음 |

---

## 결론

이 프로젝트는 **기능적으로는 잘 구현**되었지만, 다음 영역에서 개선 가능합니다:

### 주요 개선점
1. **HTTP 응답 처리**: 3회 반복 → 헬퍼 함수로 통합
2. **크레딧 검증**: 분산된 로직 → 중앙화된 함수/훅
3. **useUser 훅**: 중복 상태 변수 제거
4. **컴포넌트**: 큰 버튼 구조 → 재사용 가능한 컴포넌트

### 추천 구현 순서
**Phase 1부터 시작하여 즉시 가치를 얻을 수 있습니다.** Phase 1만 구현해도 코드 중복이 크게 감소하고 테스트 가능성이 높아집니다.

**총 예상 구현 시간**: 100분 (단계별 분산 가능)

