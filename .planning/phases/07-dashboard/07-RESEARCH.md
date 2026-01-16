# Phase 7: Dashboard - Research

**Researched:** 2026-01-16
**Domain:** Dashboard UI, PDF generation, Markdown rendering
**Confidence:** HIGH

<research_summary>
## Summary

PRD 히스토리, 내보내기, 사용자 대시보드 구현을 위한 연구. 기존 protected 레이아웃을 확장하여 사이드바 대시보드를 구축하고, Markdown 렌더링과 PDF 다운로드 기능을 추가합니다.

**핵심 발견:**
- `@react-pdf/renderer`는 클라이언트 사이드 전용 (dynamic import + `ssr: false` 필수)
- `react-markdown` + `remark-gfm`으로 GFM 테이블, 태스크 리스트 지원
- 기존 `(protected)` 레이아웃에 사이드바 추가하여 대시보드 구현
- `navigator.clipboard.writeText`로 Markdown 복사 (커스텀 훅 권장)

**Primary recommendation:** 기존 레이아웃 확장 + react-markdown + @react-pdf/renderer (클라이언트). frontend-design 플러그인으로 UI 구현.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-markdown | ^9.0.0 | Markdown 렌더링 | 가장 많이 사용되는 React Markdown 렌더러 |
| remark-gfm | ^4.0.0 | GFM 지원 | 테이블, 태스크 리스트, strikethrough |
| @react-pdf/renderer | ^4.0.0 | PDF 생성 | React 컴포넌트로 PDF 생성, 클라이언트 사이드 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-syntax-highlighter | ^15.5.0 | 코드 블록 하이라이팅 | PRD 내 코드 예시 렌더링 시 |
| lucide-react | ^0.300.0 | 아이콘 | 이미 프로젝트에 포함됨 |
| usehooks-ts | ^3.0.0 | 유틸 훅 | useCopyToClipboard 등 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-markdown | @mdx-js/react | MDX는 과도함, 순수 Markdown이면 react-markdown 충분 |
| @react-pdf/renderer | Puppeteer/Playwright | 서버 사이드 가능하나 복잡하고 리소스 소모 큼 |
| useCopyToClipboard | 직접 구현 | usehooks-ts가 더 안정적이고 테스트됨 |

**Installation:**
```bash
npm install react-markdown remark-gfm @react-pdf/renderer react-syntax-highlighter usehooks-ts
npm install -D @types/react-syntax-highlighter
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```
app/
├── (protected)/
│   ├── layout.tsx              # 기존 레이아웃 (헤더 + UserMenu)
│   └── dashboard/
│       ├── layout.tsx          # 대시보드 레이아웃 (사이드바)
│       ├── page.tsx            # 대시보드 홈 (PRD 목록)
│       ├── prds/
│       │   └── [id]/
│       │       └── page.tsx    # PRD 상세 뷰
│       ├── settings/
│       │   └── page.tsx        # 설정 페이지
│       └── credits/
│           └── page.tsx        # 크레딧 구매 페이지

src/
├── features/
│   └── prd/
│       ├── ui/
│       │   ├── PrdList.tsx         # PRD 목록
│       │   ├── PrdViewer.tsx       # Markdown 뷰어
│       │   ├── PrdPdfDownload.tsx  # PDF 다운로드 버튼
│       │   └── CopyMarkdownButton.tsx
│       └── model/
│           └── types.ts
├── widgets/
│   └── dashboard/
│       ├── Sidebar.tsx
│       └── DashboardHeader.tsx
└── shared/
    └── hooks/
        └── use-copy-to-clipboard.ts
```

### Pattern 1: Dashboard Layout with Sidebar
**What:** 중첩 레이아웃으로 대시보드 전용 사이드바 추가
**When to use:** 대시보드 페이지들
**Example:**
```typescript
// app/(protected)/dashboard/layout.tsx
import { Sidebar } from "@/src/widgets/dashboard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <Sidebar className="hidden md:flex w-64 shrink-0 border-r" />
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  )
}
```

### Pattern 2: Markdown Viewer with GFM Support
**What:** react-markdown + remark-gfm + 코드 하이라이팅
**When to use:** PRD 콘텐츠 렌더링
**Example:**
```typescript
// src/features/prd/ui/PrdViewer.tsx
'use client'

import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface PrdViewerProps {
  content: string
}

export function PrdViewer({ content }: PrdViewerProps) {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto">
                <table>{children}</table>
              </div>
            )
          },
        }}
      >
        {content}
      </Markdown>
    </article>
  )
}
```

### Pattern 3: PDF Download with Dynamic Import
**What:** @react-pdf/renderer를 dynamic import로 클라이언트에서만 로드
**When to use:** PDF 다운로드 기능
**Example:**
```typescript
// src/features/prd/ui/PrdPdfDownload.tsx
'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { Button } from '@/src/shared/ui/button'

// Dynamic import with ssr: false
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
  { ssr: false, loading: () => <span>Loading...</span> }
)

// PDF Document must also be dynamically imported
const PrdDocument = dynamic(
  () => import('./PrdDocument').then(mod => mod.PrdDocument),
  { ssr: false }
)

interface PrdPdfDownloadProps {
  prd: {
    id: string
    title: string
    content: string // JSONB content
  }
}

export function PrdPdfDownload({ prd }: PrdPdfDownloadProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <Button disabled>Preparing PDF...</Button>
  }

  return (
    <PDFDownloadLink
      document={<PrdDocument prd={prd} />}
      fileName={`${prd.title.replace(/\s+/g, '-')}.pdf`}
    >
      {({ loading }) => (
        <Button disabled={loading}>
          {loading ? 'Generating...' : 'Download PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  )
}
```

### Pattern 4: Copy to Clipboard Hook
**What:** navigator.clipboard API를 안전하게 사용하는 커스텀 훅
**When to use:** Markdown 복사 기능
**Example:**
```typescript
// src/shared/hooks/use-copy-to-clipboard.ts
'use client'

import { useCallback, useState } from 'react'

type CopiedValue = string | null

export function useCopyToClipboard(): {
  copiedText: CopiedValue
  copy: (text: string) => Promise<boolean>
  reset: () => void
} {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null)

  const copy = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported')
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      return true
    } catch (error) {
      console.warn('Copy failed', error)
      setCopiedText(null)
      return false
    }
  }, [])

  const reset = useCallback(() => {
    setCopiedText(null)
  }, [])

  return { copiedText, copy, reset }
}
```

### Pattern 5: PRD PDF Document Component
**What:** @react-pdf/renderer용 PDF 문서 컴포넌트
**When to use:** PDF 생성 시
**Example:**
```typescript
// src/features/prd/ui/PrdDocument.tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'

// Register fonts (optional)
Font.register({
  family: 'Pretendard',
  src: '/fonts/Pretendard-Regular.woff',
})

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Pretendard',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
    lineHeight: 1.6,
  },
})

interface PrdDocumentProps {
  prd: {
    title: string
    content: {
      problem?: string
      solution?: string
      features?: string[]
      // ... other JSONB fields
    }
  }
}

export function PrdDocument({ prd }: PrdDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{prd.title}</Text>

        {prd.content.problem && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Problem</Text>
            <Text style={styles.text}>{prd.content.problem}</Text>
          </View>
        )}

        {prd.content.solution && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Solution</Text>
            <Text style={styles.text}>{prd.content.solution}</Text>
          </View>
        )}

        {prd.content.features && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            {prd.content.features.map((feature, i) => (
              <Text key={i} style={styles.text}>• {feature}</Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  )
}
```

### Anti-Patterns to Avoid
- **서버 컴포넌트에서 @react-pdf/renderer 사용:** 반드시 'use client' + dynamic import
- **전체 PDF 라이브러리 한 번에 import:** tree-shaking 안 됨, dynamic import로 분리
- **react-markdown에서 dangerouslySetInnerHTML:** XSS 위험, 기본 sanitize 사용
- **클립보드 API 지원 체크 없이 사용:** 구형 브라우저에서 오류 발생
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Markdown to HTML | 직접 파싱 | react-markdown | XSS 방지, 플러그인 생태계 |
| PDF 생성 | canvas/직접 구현 | @react-pdf/renderer | 복잡한 레이아웃, 폰트 처리 |
| 코드 하이라이팅 | 정규식 기반 파싱 | react-syntax-highlighter | 수백 개 언어 지원, 테마 |
| 클립보드 복사 | document.execCommand | navigator.clipboard API | 보안, 비동기 지원 |
| 테이블 반응형 | CSS만으로 처리 | 감싸는 div + overflow-x-auto | 모바일에서 깨짐 방지 |

**Key insight:** Markdown 파싱과 PDF 생성은 엣지 케이스가 많습니다. 특히 GFM 테이블, 코드 블록, 중첩 리스트 등은 직접 구현하면 버그가 많습니다. 검증된 라이브러리를 사용하세요.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: @react-pdf/renderer SSR 충돌
**What goes wrong:** 빌드 시 `ba.Component is not a constructor` 에러
**Why it happens:** 서버 컴포넌트에서 브라우저 전용 라이브러리 import
**How to avoid:**
- `'use client'` 지시어 추가
- `dynamic(() => import(...), { ssr: false })` 사용
- Next.js 14.1.1 이상 사용
**Warning signs:** 로컬 개발에선 동작하나 빌드 시 실패

### Pitfall 2: PDF 폰트 누락
**What goes wrong:** PDF에서 한글이 깨지거나 표시 안 됨
**Why it happens:** @react-pdf/renderer는 기본 폰트에 한글 없음
**How to avoid:**
- `Font.register()`로 한글 폰트 등록
- woff/woff2 파일을 public 폴더에 배치
- 또는 Google Fonts URL 사용
**Warning signs:** PDF에서 특정 문자가 □로 표시

### Pitfall 3: Markdown XSS 공격
**What goes wrong:** 악성 스크립트가 실행됨
**Why it happens:** HTML 태그가 그대로 렌더링됨
**How to avoid:**
- react-markdown은 기본적으로 HTML sanitize
- `rehype-sanitize` 플러그인으로 추가 보호
- 사용자 입력 Markdown에 특히 주의
**Warning signs:** `<script>` 태그가 포함된 콘텐츠

### Pitfall 4: 클립보드 권한 거부
**What goes wrong:** 복사 실패, 사용자에게 피드백 없음
**Why it happens:** HTTPS가 아니거나 사용자가 권한 거부
**How to avoid:**
- try-catch로 에러 처리
- 실패 시 사용자에게 명확한 피드백
- 로컬 개발 시 localhost는 자동 허용
**Warning signs:** 복사 버튼 클릭 후 아무 반응 없음

### Pitfall 5: 대용량 PRD PDF 생성 지연
**What goes wrong:** PDF 생성 중 UI 멈춤
**Why it happens:** 클라이언트 사이드 PDF 생성은 메인 스레드 차단
**How to avoid:**
- Web Worker 사용 고려 (복잡)
- 로딩 상태 명확히 표시
- 매우 긴 PRD는 페이지 분할
**Warning signs:** PDF 다운로드 버튼 클릭 후 브라우저 프리징
</common_pitfalls>

<code_examples>
## Code Examples

### Responsive Sidebar Component
```typescript
// src/widgets/dashboard/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, Settings, CreditCard, Home } from 'lucide-react'
import { cn } from '@/src/shared/lib/utils'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/prds', icon: FileText, label: 'My PRDs' },
  { href: '/dashboard/credits', icon: CreditCard, label: 'Credits' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={cn('flex flex-col p-4', className)}>
      <nav className="space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href ||
            (href !== '/dashboard' && pathname.startsWith(href))

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
```

### PRD List with Pagination
```typescript
// src/features/prd/ui/PrdList.tsx
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/src/shared/ui/card'
import type { Database } from '@/src/entities'

type Prd = Database['public']['Tables']['prds']['Row']

interface PrdListProps {
  prds: Prd[]
}

export function PrdList({ prds }: PrdListProps) {
  if (prds.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No PRDs yet</p>
        <Link href="/generate" className="text-primary hover:underline">
          Generate your first PRD
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {prds.map((prd) => (
        <Link key={prd.id} href={`/dashboard/prds/${prd.id}`}>
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="line-clamp-1">{prd.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {prd.idea}
              </CardDescription>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                <span>{prd.template}</span>
                <span>•</span>
                <span>{new Date(prd.created_at).toLocaleDateString()}</span>
              </div>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  )
}
```

### Copy Button with Feedback
```typescript
// src/features/prd/ui/CopyMarkdownButton.tsx
'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/src/shared/ui/button'
import { useCopyToClipboard } from '@/src/shared/hooks/use-copy-to-clipboard'

interface CopyMarkdownButtonProps {
  markdown: string
}

export function CopyMarkdownButton({ markdown }: CopyMarkdownButtonProps) {
  const { copy } = useCopyToClipboard()
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const success = await copy(markdown)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="gap-2"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Copy Markdown
        </>
      )}
    </Button>
  )
}
```
</code_examples>

<sota_updates>
## State of the Art (2025-2026)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| @react-pdf 서버 렌더링 시도 | 클라이언트 전용 + dynamic import | 2024+ | SSR 에러 방지 |
| Pages Router 레이아웃 | App Router 중첩 레이아웃 | 2024+ | 더 깔끔한 구조 |
| document.execCommand | navigator.clipboard API | 2020+ | 보안, 비동기 지원 |
| react-markdown v8 | react-markdown v9 | 2024+ | ESM only, 성능 개선 |

**New tools/patterns to consider:**
- **Parallel Routes:** 사이드바와 메인 콘텐츠를 독립적으로 렌더링
- **Streaming:** PRD 목록을 점진적으로 로드
- **Server Actions:** PDF 생성 요청을 서버에서 처리 (Puppeteer 대안)

**Deprecated/outdated:**
- **document.execCommand('copy'):** deprecated, navigator.clipboard 권장
- **react-pdf 서버 사이드 렌더링 in App Router:** 아직 불안정
</sota_updates>

<open_questions>
## Open Questions

1. **PDF 서버 사이드 생성**
   - What we know: Puppeteer/Playwright로 가능하나 리소스 많이 사용
   - What's unclear: Vercel Edge에서 실행 가능 여부
   - Recommendation: MVP에서는 클라이언트 사이드 사용, 추후 서버 API 검토

2. **PRD 콘텐츠 구조**
   - What we know: Phase 5에서 JSONB로 저장 예정
   - What's unclear: 정확한 JSONB 스키마 (Phase 5 완료 후 확정)
   - Recommendation: Phase 5 결과에 따라 PrdDocument 컴포넌트 조정
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- /diegomura/react-pdf - PDF 생성 패턴, BlobProvider, PDFDownloadLink
- /remarkjs/react-markdown - Markdown 렌더링, GFM 플러그인, 커스텀 컴포넌트
- Next.js Layouts Docs - 중첩 레이아웃

### Secondary (MEDIUM confidence)
- usehooks-ts - 클립보드 훅
- react-pdf Next.js GitHub Discussion - SSR 이슈

### Tertiary (LOW confidence - needs validation)
- WebSearch의 Puppeteer PDF 생성 - 서버 사이드 대안으로 검토 필요
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: react-markdown, @react-pdf/renderer
- Ecosystem: remark-gfm, react-syntax-highlighter
- Patterns: 대시보드 레이아웃, Markdown 뷰어, PDF 다운로드
- Pitfalls: SSR 호환성, 폰트, 클립보드 권한

**Confidence breakdown:**
- Standard stack: HIGH - 공식 문서 + Context7
- Architecture: HIGH - Next.js 공식 패턴 + 프로젝트 기존 구조 참고
- Pitfalls: HIGH - GitHub Issues + 공식 문서
- Code examples: HIGH - Context7 + 공식 문서에서 추출

**Research date:** 2026-01-16
**Valid until:** 2026-02-16 (30 days - 라이브러리들 안정적)

**Integration with existing code:**
- 기존 `(protected)` 레이아웃 구조 확장
- `prds` 테이블의 JSONB content 활용
- frontend-design 플러그인으로 UI 구현 예정
</metadata>

---

*Phase: 07-dashboard*
*Research completed: 2026-01-16*
*Ready for planning: yes*
