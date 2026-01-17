# 코드 리팩토링 예제

이 문서는 제안된 각 단순화 방안의 구체적인 구현 코드를 제시합니다.

---

## 1. 응답 헬퍼 함수 (route.ts)

### Before (현재)
```typescript
// line 36-39
if (!validation.valid) {
  return new Response(JSON.stringify({ error: validation.error }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
}

// line 50-53 (반복)
return new Response(JSON.stringify({ error: '로그인이 필요합니다.' }), {
  status: 401,
  headers: { 'Content-Type': 'application/json' },
});

// line 74-80 (반복)
return new Response(
  JSON.stringify({ error: '크레딧이 부족합니다.' }),
  {
    status: 402,
    headers: { 'Content-Type': 'application/json' },
  }
);
```

### After (제안)
```typescript
// 파일 상단에 헬퍼 함수 추가
function createJsonResponse(
  data: Record<string, unknown>,
  status: number = 200
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// 사용
if (!validation.valid) {
  return createJsonResponse({ error: validation.error }, 400);
}

if (authError || !user) {
  return createJsonResponse({ error: '로그인이 필요합니다.' }, 401);
}

if (deductError || !deductResult) {
  return createJsonResponse({ error: '크레딧이 부족합니다.' }, 402);
}
```

**변화**:
- 코드 6줄 → 1줄 (3회 반복 제거)
- 일관된 응답 형식
- 추후 응답 수정 시 1곳만 변경

---

## 2. 크레딧 차감 함수 (route.ts)

### Before (현재)
```typescript
const creditsRequired = CREDITS_PER_VERSION[version];
const isDev = process.env.NODE_ENV === 'development';

// Skip credit deduction in development mode
if (!isDev) {
  const { data: deductResult, error: deductError } = await supabase.rpc(
    'deduct_credit',
    {
      p_user_id: userId,
      p_amount: creditsRequired,
      p_description: `PRD 생성: ${idea.slice(0, 50)}...`,
    }
  );

  if (deductError || !deductResult) {
    console.error('Credit deduction failed:', deductError);
    return new Response(
      JSON.stringify({ error: '크레딧이 부족합니다.' }),
      {
        status: 402,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
} else {
  console.log('[DEV] Skipping credit deduction');
}
```

### After (제안)
```typescript
async function deductCredits(
  supabase: ReturnType<typeof createClient>,
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
    console.error('Credit deduction failed:', error);
    return { success: false, error: '크레딧이 부족합니다.' };
  }

  return { success: true };
}

// 메인 함수에서 사용
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

**변화**:
- 로직 분리로 테스트 가능
- 메인 함수 읽기 쉬워짐
- 개발/프로덕션 분기가 명확

---

## 3. 버전별 설정 상수 (route.ts)

### Before (현재)
```typescript
const model = version === 'detailed' ? advancedModel : defaultModel;

const userPrompt = `
<user_input>
아이디어: ${idea}
버전: ${version === 'detailed' ? '상세 (Detailed)' : '기본 (Basic)'}
</user_input>

위 아이디어에 대한 PRD를 생성해주세요.
${version === 'basic' ? '핵심 섹션만 간략하게 작성해주세요.' : '모든 섹션을 상세하게 작성해주세요.'}
`;

const result = streamText({
  model,
  system: systemPrompt,
  prompt: userPrompt,
  maxOutputTokens: version === 'detailed' ? AI_CONFIG.maxTokens : 4096,
  temperature: AI_CONFIG.temperature,
  // ...
});
```

### After (제안)
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

const userPrompt = `
<user_input>
아이디어: ${idea}
버전: ${config.displayName}
</user_input>

위 아이디어에 대한 PRD를 생성해주세요.
${config.instruction}
`;

const result = streamText({
  model: config.model,
  system: systemPrompt,
  prompt: userPrompt,
  maxOutputTokens: config.maxTokens,
  temperature: AI_CONFIG.temperature,
  // ...
});
```

**변화**:
- 조건문 3개 → 0개
- 설정 중앙화
- 새 버전 추가 시 1곳만 수정

---

## 4. 크레딧 검증 훅 (새 파일)

**파일**: `src/features/purchase/hooks/use-credits-check.ts`

```typescript
'use client';

import { useState, useCallback } from 'react';
import type { PRDVersion } from '@/src/entities';
import type { Profile } from '@/src/entities';

interface UseCreditsCheckReturn {
  showCreditModal: boolean;
  setShowCreditModal: (open: boolean) => void;
  requiredCredits: number;
  canGenerate: (version: PRDVersion) => boolean;
  showInsufficientCredits: (version: PRDVersion) => void;
}

interface UseCreditsCheckOptions {
  profile: Profile | null;
  creditsPerVersion: Record<PRDVersion, number>;
}

export function useCreditsCheck(
  options: UseCreditsCheckOptions
): UseCreditsCheckReturn {
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [requiredCredits, setRequiredCredits] = useState(0);

  const isDev = process.env.NODE_ENV === 'development';
  const currentCredits = options.profile?.credits ?? 0;

  const canGenerate = useCallback(
    (version: PRDVersion): boolean => {
      if (isDev) return true;
      return currentCredits >= options.creditsPerVersion[version];
    },
    [isDev, currentCredits, options.creditsPerVersion]
  );

  const showInsufficientCredits = useCallback((version: PRDVersion) => {
    setRequiredCredits(options.creditsPerVersion[version]);
    setShowCreditModal(true);
  }, [options.creditsPerVersion]);

  return {
    showCreditModal,
    setShowCreditModal,
    requiredCredits,
    canGenerate,
    showInsufficientCredits,
  };
}
```

### 사용 예제 (generate/page.tsx)
```typescript
import { useCreditsCheck } from '@/src/features/purchase/hooks/use-credits-check';
import { CREDITS_PER_VERSION } from '@/src/features/prd-generation';

export default function GeneratePage() {
  const { profile } = useUser();
  const creditsCheck = useCreditsCheck({
    profile,
    creditsPerVersion: CREDITS_PER_VERSION,
  });

  const handleGenerate = useCallback(
    async (data: { idea: string; template: PRDTemplate; version: PRDVersion }) => {
      // 첫 번째 체크: 로컬 검증
      if (!creditsCheck.canGenerate(data.version)) {
        creditsCheck.showInsufficientCredits(data.version);
        return;
      }

      setIsGenerating(true);
      setContent('');
      setError(null);

      try {
        const response = await fetch('/api/generate-prd', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          // 두 번째 체크: API 402 응답
          if (response.status === 402) {
            creditsCheck.showInsufficientCredits(data.version);
            setIsGenerating(false);
            return;
          }

          const errorData = await response.json();
          throw new Error(errorData.error || 'PRD 생성에 실패했습니다.');
        }

        // ... 스트리밍 처리
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'PRD 생성 중 오류가 발생했습니다.'
        );
      } finally {
        setIsGenerating(false);
      }
    },
    [creditsCheck]
  );

  // ... 나머지 코드
}
```

**변화**:
- 로직 재사용 가능
- 테스트 작성 용이
- 페이지 컴포넌트 복잡도 감소

---

## 5. 스트리밍 처리 훅 (새 파일)

**파일**: `src/shared/hooks/use-stream-response.ts`

```typescript
'use client';

import { useState, useCallback } from 'react';

interface UseStreamResponseReturn {
  content: string;
  setContent: (content: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
  processStream: (response: Response) => Promise<void>;
}

export function useStreamResponse(): UseStreamResponseReturn {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const processStream = useCallback(async (response: Response): Promise<void> => {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('스트리밍을 시작할 수 없습니다.');
    }

    const decoder = new TextDecoder();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setContent((prev) => prev + chunk);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '스트리밍 처리 실패';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return {
    content,
    setContent,
    error,
    setError,
    processStream,
  };
}
```

### 사용 예제 (generate/page.tsx)
```typescript
import { useStreamResponse } from '@/src/shared/hooks/use-stream-response';

export default function GeneratePage() {
  const stream = useStreamResponse();

  const handleGenerate = useCallback(
    async (data: { idea: string; template: PRDTemplate; version: PRDVersion }) => {
      // ... 크레딧 검증

      setIsGenerating(true);
      stream.setContent('');
      stream.setError(null);

      try {
        const response = await fetch('/api/generate-prd', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          // ... 에러 처리
        }

        // 스트리밍 처리 - 1줄!
        await stream.processStream(response);

        // ... 프로필 갱신
      } catch (err) {
        stream.setError(
          err instanceof Error ? err.message : 'PRD 생성 중 오류가 발생했습니다.'
        );
      } finally {
        setIsGenerating(false);
      }
    },
    [stream]
  );

  return (
    <>
      {/* ... */}
      <PRDViewer content={stream.content} isStreaming={isGenerating} />
      {stream.error && <ErrorAlert message={stream.error} />}
    </>
  );
}
```

**변화**:
- 15줄 스트리밍 로직 제거
- 재사용 가능한 스트리밍 훅
- 에러 처리 개선

---

## 6. useUser 훅 단순화

**파일**: `src/features/auth/hooks/use-user.ts`

### Before (현재)
```typescript
interface UseUserReturn {
  user: User | null;
  profile: Profile | null;
  loading: boolean;           // 중복
  isLoading: boolean;         // 중복
  error: Error | null;
  isAuthenticated: boolean;
  refetch: () => Promise<void>;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);  // 중복
  const [error, setError] = useState<Error | null>(null);
  const loadingRef = useRef(true);  // 불필요

  const fetchProfile = useCallback(async (userId: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return null;
    }
    return data;
  }, []);

  const refetch = useCallback(async () => {
    if (!user) return;
    const profileData = await fetchProfile(user.id);
    setProfile(profileData);
  }, [user, fetchProfile]);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    // Fetch initial user state with timeout  <- 불필요
    const fetchUser = async () => {
      try {
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
          loadingRef.current = false;
          setLoading(false);
        }
      }
    };

    fetchUser();

    // Safety timeout - ensure loading stops after 5 seconds  <- 불필요
    const timeout = setTimeout(() => {
      if (isMounted && loadingRef.current) {
        loadingRef.current = false;
        setLoading(false);
      }
    }, 5000);

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);

        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        } else {
          setProfile(null);
        }

        loadingRef.current = false;
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      isMounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  return {
    user,
    profile,
    loading,       // 제거
    isLoading: loading,  // 제거
    error,
    isAuthenticated: !!user,
    refetch,
  };
}
```

### After (제안)
```typescript
interface UseUserReturn {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  refetch: () => Promise<void>;
}

// 별도 모듈 함수 (재사용 가능)
async function fetchProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return error ? null : data;
}

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

    // Subscribe to auth state changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
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

    // Cleanup subscription on unmount
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const refetch = useCallback(
    async () => {
      if (!user?.id) return;
      const profileData = await fetchProfile(user.id);
      if (profileData) {
        setProfile(profileData);
      }
    },
    [user?.id]
  );

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

**변화**:
- 상태 변수 2개 제거 (`loading`, `loadingRef`)
- 5초 타임아웃 제거 (불필요)
- 35줄 감소
- 의존성 배열 더 명확

---

## 7. VersionButton 컴포넌트 (새 파일)

**파일**: `src/features/prd-generation/ui/version-button.tsx`

```typescript
'use client';

import { cn } from '@/src/shared/lib/utils';
import type { PRDVersion } from '@/src/entities';
import type { ComponentType } from 'react';

interface VersionButtonProps {
  version: PRDVersion;
  label: string;
  credits: number;
  description: string;
  icon: ComponentType<{ className?: string }>;
  isSelected: boolean;
  isLoading: boolean;
  isRecommended?: boolean;
  onSelect: () => void;
}

export function VersionButton({
  label,
  credits,
  description,
  icon: Icon,
  isSelected,
  isLoading,
  isRecommended = false,
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
              ? 'bg-brand-primary text-white'
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
```

### 사용 예제 (prd-form.tsx)
```typescript
import { VersionButton } from './version-button';
import { FileText, Zap } from 'lucide-react';

export function PRDForm({ onSubmit, isLoading, userCredits }: PRDFormProps) {
  const [idea, setIdea] = useState('');
  const [template, setTemplate] = useState<PRDTemplate>('saas');
  const [version, setVersion] = useState<PRDVersion>('basic');

  // ... 나머지 로직

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ... 기타 필드 */}

      {/* Version Selector - 매우 간결해짐 */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">PRD 버전</label>
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
      </div>

      {/* ... 나머지 */}
    </form>
  );
}
```

**변화**:
- prd-form.tsx에서 70줄 제거
- 재사용 가능한 버튼 컴포넌트
- 유지보수 용이

---

## 8. Prose 스타일 상수화 (새 파일)

**파일**: `src/features/prd-generation/lib/prose-styles.ts`

```typescript
export const PROSE_CONTAINER_CLASS = [
  'prose prose-neutral dark:prose-invert max-w-none',

  // Headings
  'prose-headings:font-bold prose-headings:tracking-tight',
  'prose-h1:text-3xl prose-h1:text-foreground prose-h1:mb-4',
  'prose-h2:text-2xl prose-h2:text-foreground prose-h2:mt-8 prose-h2:mb-3',
  'prose-h2:border-b prose-h2:border-border prose-h2:pb-2',
  'prose-h3:text-xl prose-h3:text-foreground prose-h3:mt-6 prose-h3:mb-2',
  'prose-h4:text-lg prose-h4:text-foreground',

  // Paragraphs
  'prose-p:text-foreground/90 prose-p:leading-7',
  'prose-strong:text-foreground prose-strong:font-semibold',
  'prose-em:text-foreground/80',

  // Lists
  'prose-li:text-foreground/90 prose-li:marker:text-brand-primary',
  'prose-ul:my-4 prose-ol:my-4',

  // Links
  'prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline',

  // Blockquotes
  'prose-blockquote:border-l-brand-primary prose-blockquote:text-foreground/80',
  'prose-blockquote:not-italic',

  // Code
  'prose-code:text-brand-primary prose-code:bg-muted prose-code:px-1.5',
  'prose-code:py-0.5 prose-code:rounded prose-code:font-normal',
  'prose-code:before:content-none prose-code:after:content-none',

  // Code blocks
  'prose-pre:bg-[#1e1e2e] prose-pre:border prose-pre:border-border',

  // Tables
  'prose-table:border prose-table:border-border',
  'prose-th:bg-muted prose-th:text-foreground prose-th:font-semibold',
  'prose-th:px-4 prose-th:py-2',
  'prose-td:px-4 prose-td:py-2 prose-td:border-t prose-td:border-border',

  // Horizontal rule
  'prose-hr:border-border',
].join(' ');
```

### 사용 예제 (prd-viewer.tsx)
```typescript
import { PROSE_CONTAINER_CLASS } from '../lib/prose-styles';

export function PRDViewer({ content, isStreaming }: PRDViewerProps) {
  // ... 컴포넌트 로직

  return (
    <div className="relative rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        {/* ... */}
      </div>

      {/* Content - Markdown Rendered */}
      <div ref={containerRef} className="h-[500px] overflow-y-auto p-6 bg-background">
        <article className={PROSE_CONTAINER_CLASS}>
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              code: CodeBlock,
              table: ResponsiveTable,
            }}
          >
            {content}
          </Markdown>
          {isStreaming && (
            <span className="inline-block motion-safe:animate-pulse text-primary">▌</span>
          )}
        </article>
      </div>
    </div>
  );
}
```

**변화**:
- prd-viewer.tsx에서 20줄 제거
- 스타일 재사용 가능
- 유지보수 용이

---

## 통합 구현 체크리스트

### Phase 1 (35분)
- [ ] 응답 헬퍼 함수 추가
- [ ] 크레딧 차감 함수 추가
- [ ] useUser 훅 단순화
- [ ] 테스트 실행: `npm run test`

### Phase 2 (40분)
- [ ] 버전 설정 상수 추가
- [ ] 크레딧 검증 훅 생성 (`use-credits-check.ts`)
- [ ] 스트리밍 훅 생성 (`use-stream-response.ts`)
- [ ] 페이지 리팩토링
- [ ] 테스트 실행: `npm run test`

### Phase 3 (25분)
- [ ] VersionButton 컴포넌트 생성
- [ ] PRDForm 리팩토링
- [ ] Prose 스타일 상수 생성
- [ ] PRDViewer 리팩토링
- [ ] 테스트 실행: `npm run test`

### 최종 검증
- [ ] 개발 서버 실행: `npm run dev`
- [ ] 페이지 동작 확인
- [ ] 브라우저 콘솔 에러 확인
- [ ] 크레딧 로직 테스트
- [ ] 스트리밍 생성 테스트

