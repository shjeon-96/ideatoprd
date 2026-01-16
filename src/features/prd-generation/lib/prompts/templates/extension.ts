export const EXTENSION_TEMPLATE = `
<template_context>
This is a Browser Extension or App Plugin.
Focus on: host app integration, permissions, update mechanism, store policies.
</template_context>

<additional_sections>
- Host Application Requirements
- Permission Scope (minimal viable)
- Store Submission Guidelines (Chrome/Firefox/Safari)
- Update & Migration Strategy
</additional_sections>

<example>
<idea>웹페이지 요약 Chrome 확장</idea>
<prd_excerpt>
## Permissions
- activeTab: 현재 탭 콘텐츠 읽기 (필수)
- storage: 설정 저장 (필수)
- clipboardWrite: 요약 복사 (선택)

## Store Compliance
- Chrome Web Store 정책 준수
- 개인정보 처리방침 필수
</prd_excerpt>
</example>
`;
