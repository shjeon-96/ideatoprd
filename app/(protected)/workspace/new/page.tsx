'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Building2, Loader2 } from 'lucide-react';
import { Button } from '@/src/shared/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/shared/ui/card';
import { createWorkspace } from '@/src/features/workspace';

/**
 * Create new workspace page
 */
export default function NewWorkspacePage() {
  const router = useRouter();
  const t = useTranslations('workspace');
  const tCommon = useTranslations('common');
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(t('create.nameRequired'));
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const result = await createWorkspace(name.trim());

      if (result.success && result.workspaceId) {
        // Redirect to dashboard - workspace will appear in switcher
        router.push('/dashboard');
      } else {
        setError(result.error ?? t('create.failed'));
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t('create.failed')
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
              <Building2 className="size-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">{t('create.title')}</CardTitle>
          <CardDescription>
            {t('create.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-2"
              >
                {t('name')}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('create.placeholder')}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={isCreating}
              />
              <p className="text-sm text-muted-foreground mt-1">
                {t('slugInfo')}
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
                disabled={isCreating}
              >
                {tCommon('cancel')}
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isCreating || !name.trim()}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {t('create.creating')}
                  </>
                ) : (
                  t('create.button')
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
