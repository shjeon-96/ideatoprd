# Vercel 환경 변수 설정 가이드

## ✅ 자동 설정 완료

다음 환경 변수는 이미 Vercel에 설정되었습니다:

| 변수 | 상태 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ 설정됨 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ 설정됨 |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ 설정됨 |
| `ANTHROPIC_API_KEY` | ✅ 설정됨 |
| `GOOGLE_CLIENT_ID` | ✅ 설정됨 |
| `GOOGLE_CLIENT_SECRET` | ✅ 설정됨 |

---

## ⚠️ 수동 설정 필요

### 1. Google OAuth Redirect URI 설정

Google Cloud Console에서 프로덕션 도메인을 추가해야 합니다.

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) 접속
2. OAuth 2.0 Client ID 선택
3. **Authorized redirect URIs**에 추가:
   ```
   https://ideatoprd.web-toolkit.app/auth/callback
   https://wjcfamfxjzhpnfkbater.supabase.co/auth/v1/callback
   ```

### 2. Supabase Redirect URL 설정

1. [Supabase Dashboard](https://supabase.com/dashboard/project/wjcfamfxjzhpnfkbater/auth/url-configuration) 접속
2. **Site URL** 변경:
   ```
   https://ideatoprd.web-toolkit.app
   ```
3. **Redirect URLs**에 추가:
   ```
   https://ideatoprd.web-toolkit.app/**
   https://idea-to-prd.vercel.app/**
   ```

---

## 🔧 선택적 환경 변수 (결제/검색 기능)

결제 및 웹 검색 기능을 사용하려면 아래 환경 변수를 추가로 설정하세요.

### Tavily API (Research PRD - 웹 검색)

PRD 생성 시 시장 조사 기능을 사용하려면 필요합니다.

1. [Tavily](https://tavily.com) 가입
2. API Key 발급
3. Vercel에 추가:
   ```bash
   printf 'YOUR_TAVILY_API_KEY' | vercel env add TAVILY_API_KEY production --force
   ```

### Lemon Squeezy (결제 시스템)

크레딧 구매 및 구독 기능을 사용하려면 필요합니다.

1. [Lemon Squeezy](https://app.lemonsqueezy.com) 가입
2. Store 생성 후 다음 정보 확인:
   - API Key: Settings > API
   - Store ID: Store URL에서 확인
   - Webhook Secret: Settings > Webhooks

3. Vercel에 추가:
   ```bash
   printf 'YOUR_API_KEY' | vercel env add LEMONSQUEEZY_API_KEY production --force
   printf 'YOUR_STORE_ID' | vercel env add LEMONSQUEEZY_STORE_ID production --force
   printf 'YOUR_WEBHOOK_SECRET' | vercel env add LEMONSQUEEZY_WEBHOOK_SECRET production --force
   ```

4. **Webhook URL 설정** (Lemon Squeezy Dashboard):
   ```
   https://ideatoprd.web-toolkit.app/api/webhook/lemon-squeezy
   ```

   구독할 이벤트:
   - `order_created`
   - `subscription_created`
   - `subscription_payment_success`
   - `subscription_cancelled`
   - `subscription_expired`
   - `subscription_resumed`

5. **상품 Variant ID 설정** (상품 생성 후):
   ```bash
   # 일회성 크레딧 패키지
   printf 'VARIANT_ID' | vercel env add NEXT_PUBLIC_LS_VARIANT_STARTER production --force
   printf 'VARIANT_ID' | vercel env add NEXT_PUBLIC_LS_VARIANT_BASIC production --force
   printf 'VARIANT_ID' | vercel env add NEXT_PUBLIC_LS_VARIANT_PRO production --force
   printf 'VARIANT_ID' | vercel env add NEXT_PUBLIC_LS_VARIANT_BUSINESS production --force

   # 구독 플랜
   printf 'VARIANT_ID' | vercel env add NEXT_PUBLIC_LS_VARIANT_SUB_BASIC_MONTHLY production --force
   printf 'VARIANT_ID' | vercel env add NEXT_PUBLIC_LS_VARIANT_SUB_BASIC_YEARLY production --force
   printf 'VARIANT_ID' | vercel env add NEXT_PUBLIC_LS_VARIANT_SUB_PRO_MONTHLY production --force
   printf 'VARIANT_ID' | vercel env add NEXT_PUBLIC_LS_VARIANT_SUB_PRO_YEARLY production --force
   printf 'VARIANT_ID' | vercel env add NEXT_PUBLIC_LS_VARIANT_SUB_BUSINESS_MONTHLY production --force
   printf 'VARIANT_ID' | vercel env add NEXT_PUBLIC_LS_VARIANT_SUB_BUSINESS_YEARLY production --force
   ```

---

## 🚀 재배포

환경 변수 설정 후 재배포:

```bash
vercel --prod
```

---

## 📋 체크리스트

- [ ] Google OAuth Redirect URI 추가
- [ ] Supabase Site URL 및 Redirect URLs 설정
- [ ] (선택) Tavily API Key 설정
- [ ] (선택) Lemon Squeezy 설정
- [ ] 재배포 완료
