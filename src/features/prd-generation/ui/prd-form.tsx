'use client';

import { useState } from 'react';
import { Button } from '@/src/shared/ui/button';
import { TemplateSelector } from './template-selector';
import { MAX_IDEA_LENGTH, MIN_IDEA_LENGTH } from '../model/types';
import type { PRDTemplate, PRDVersion } from '@/src/entities';
import { Loader2, FileText, Zap } from 'lucide-react';

interface PRDFormProps {
  onSubmit: (data: {
    idea: string;
    template: PRDTemplate;
    version: PRDVersion;
  }) => void;
  isLoading: boolean;
  userCredits: number;
}

export function PRDForm({ onSubmit, isLoading, userCredits }: PRDFormProps) {
  const [idea, setIdea] = useState('');
  const [template, setTemplate] = useState<PRDTemplate>('saas');
  const [version, setVersion] = useState<PRDVersion>('basic');

  const creditsRequired = version === 'detailed' ? 2 : 1;
  const hasEnoughCredits = userCredits >= creditsRequired;
  const isValidIdea = idea.trim().length >= MIN_IDEA_LENGTH;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidIdea || !hasEnoughCredits || isLoading) return;
    onSubmit({ idea: idea.trim(), template, version });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Idea Input */}
      <div className="space-y-2">
        <label htmlFor="idea" className="text-sm font-medium">
          아이디어{' '}
          <span className="text-muted-foreground">
            ({idea.length}/{MAX_IDEA_LENGTH})
          </span>
        </label>
        <textarea
          id="idea"
          value={idea}
          onChange={(e) => setIdea(e.target.value.slice(0, MAX_IDEA_LENGTH))}
          placeholder="예: AI 기반 이력서 분석 서비스로 구직자의 이력서를 분석하고 개선점을 제안합니다."
          rows={3}
          disabled={isLoading}
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        />
        {idea.length > 0 && idea.length < MIN_IDEA_LENGTH && (
          <p className="text-sm text-destructive">
            최소 {MIN_IDEA_LENGTH}자 이상 입력해주세요.
          </p>
        )}
      </div>

      {/* Template Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium">템플릿 선택</label>
        <TemplateSelector
          value={template}
          onChange={setTemplate}
          disabled={isLoading}
        />
      </div>

      {/* Version Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium">PRD 버전</label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setVersion('basic')}
            disabled={isLoading}
            className={`flex-1 rounded-lg border-2 p-4 transition-all ${
              version === 'basic'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span className="font-medium">기본</span>
              <span className="ml-auto text-sm text-muted-foreground">
                1 크레딧
              </span>
            </div>
            <p className="mt-1 text-left text-sm text-muted-foreground">
              핵심 섹션만 포함
            </p>
          </button>
          <button
            type="button"
            onClick={() => setVersion('detailed')}
            disabled={isLoading}
            className={`flex-1 rounded-lg border-2 p-4 transition-all ${
              version === 'detailed'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span className="font-medium">상세</span>
              <span className="ml-auto text-sm text-muted-foreground">
                2 크레딧
              </span>
            </div>
            <p className="mt-1 text-left text-sm text-muted-foreground">
              모든 섹션 상세 작성
            </p>
          </button>
        </div>
      </div>

      {/* Credit Warning */}
      {!hasEnoughCredits && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          크레딧이 부족합니다. (보유: {userCredits}, 필요: {creditsRequired})
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={!isValidIdea || !hasEnoughCredits || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            PRD 생성 중...
          </>
        ) : (
          <>PRD 생성하기 ({creditsRequired} 크레딧)</>
        )}
      </Button>
    </form>
  );
}
