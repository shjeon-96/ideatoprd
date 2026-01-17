export const AI_WRAPPER_TEMPLATE = `
<template_context>
This is an AI-Wrapper product built on top of LLMs (GPT, Claude, Gemini, etc.).
Focus on: differentiation from raw API access, cost optimization, prompt engineering, reliability, and defensible moat.
</template_context>

<domain_benchmarks>
Industry standards for AI wrapper products (use these as baseline):
- Gross Margin Target: 60-80% (after AI API costs)
- Cost per Request: Track and optimize religiously
- API Reliability Target: 99.9% uptime (with fallbacks)
- Latency (streaming): First token <500ms, full response varies by length
- Latency (non-streaming): <5s for typical requests
- User Satisfaction: Output quality rating >4/5
- Rate Limit Utilization: <80% of provider limits (headroom for spikes)
- Prompt Iteration Cycle: Test improvements weekly
- Model Refresh: Evaluate new models within 2 weeks of release
</domain_benchmarks>

<critical_considerations>
MUST address in PRD:
1. **Defensible Moat** (critical - why not just use ChatGPT/Claude directly?):
   - Proprietary data/context (fine-tuning, RAG with unique corpus)
   - Specialized UX (workflow integration, not just chat)
   - Domain expertise encoded in prompts (years of learning baked in)
   - Multi-step orchestration (complex pipelines users can't easily replicate)
   - Output formatting/integration (direct export to tools they use)

2. **Model Strategy**:
   - Primary model: Best quality for your use case
   - Fallback model: Different provider for reliability
   - Cost optimization: Use smaller models for simpler subtasks
   - Evaluation: A/B test model changes before full rollout

3. **Cost Management**:
   - Token counting: Display to users, set limits
   - Caching: Hash identical requests, cache responses
   - Prompt optimization: Shorter prompts = lower cost
   - Tiered models: Use expensive models only when needed

4. **Reliability & Failover**:
   - Multi-provider: Don't depend on single AI provider
   - Graceful degradation: Fallback to simpler model, not error
   - Queue management: Handle rate limits with retries/backoff
   - Monitoring: Track latency, errors, cost per request

5. **Safety & Moderation**:
   - Input filtering: Block prompt injection, harmful content
   - Output filtering: Check for hallucinations, inappropriate content
   - Rate limiting: Per-user limits to prevent abuse
   - Audit logging: Track all requests for debugging/compliance
</critical_considerations>

<additional_sections>
- AI Model Strategy (primary/fallback selection, evaluation criteria, upgrade path)
- Cost Analysis (per-request cost breakdown, margin calculation, optimization tactics)
- Prompt Engineering (system prompt design, few-shot examples, output formatting)
- Differentiation Strategy (why users choose this over raw API access)
- Reliability Architecture (fallbacks, caching, rate limit handling)
- Safety & Moderation (input/output filtering, abuse prevention, compliance)
</additional_sections>

<common_pitfalls>
Avoid these AI wrapper-specific mistakes:
- No moat: "ChatGPT with a different UI" is not defensible
- Ignoring costs: AI API costs can destroy margins at scale
- Single provider dependency: One API outage = your product is down
- No caching: Paying for identical requests repeatedly
- Prompt in frontend: Users can extract and replicate your "secret sauce"
- No rate limits: One abusive user can exhaust your API budget
- Hallucination blindness: AI outputs need validation for critical use cases
- Model lock-in: Design for model-agnostic architecture when possible
- Overpromising quality: AI outputs vary; set realistic expectations
</common_pitfalls>

<example_ko>
<idea>AI 블로그 글 작성 도우미</idea>
<prd_excerpt>
## AI Model Strategy
| 용도 | 모델 | 비용/1K tokens | 선택 이유 |
|------|------|---------------|----------|
| 글 생성 | Claude 3.5 Sonnet | $0.003 input / $0.015 output | 한국어 품질 최고 |
| 요약/키워드 | Claude 3.5 Haiku | $0.00025 / $0.00125 | 단순 작업, 비용 절감 |
| Fallback | GPT-4o-mini | $0.00015 / $0.0006 | Claude 장애 시 |

## Cost Analysis
- 평균 요청: 500 input + 2000 output tokens
- 비용/요청: ~$0.03 (Sonnet 기준)
- 목표 마진: 70% → 최소 가격 $0.10/글
- 최적화: 시스템 프롬프트 캐싱(50% 절감), 반복 요청 캐싱

## Differentiation (왜 ChatGPT 직접 사용 안 하나?)
1. **한국어 최적화**: 맞춤법, 어조, 문화적 뉘앙스 반영 프롬프트
2. **SEO 통합**: 키워드 밀도, 메타 태그 자동 생성
3. **워크플로우**: 워드프레스/노션 직접 발행
4. **톤앤매너 프리셋**: 업종별 20+ 템플릿 (ChatGPT에 매번 설명 불필요)
</prd_excerpt>
</example_ko>

<example_en>
<idea>AI-powered code review assistant</idea>
<prd_excerpt>
## Differentiation Strategy
Raw API users must:
- Write prompts from scratch every time
- Manually format code context
- Handle token limits themselves
- No persistence of codebase context

Our product provides:
- **Codebase-aware context**: RAG with project structure, dependencies, conventions
- **IDE integration**: Review in VS Code/JetBrains, not copy-paste
- **Learning system**: Improves based on accepted/rejected suggestions
- **Team conventions**: Enforces style guide automatically

## Cost Optimization
| Technique | Savings | Implementation |
|-----------|---------|----------------|
| Prompt caching | 40% | Hash system prompt + context |
| Tiered models | 30% | Haiku for syntax, Sonnet for logic |
| Diff-only context | 25% | Only changed code + imports, not full files |
| Response caching | 15% | Cache identical file reviews for 24h |

Target cost: <$0.01 per file reviewed (enables unlimited tier pricing)

## Reliability Architecture
- Primary: Claude API (best code understanding)
- Fallback 1: GPT-4 (different provider)
- Fallback 2: Local CodeLlama (offline capability for enterprise)
- Circuit breaker: After 3 failures, switch to fallback for 5 minutes
</prd_excerpt>
</example_en>
`;
