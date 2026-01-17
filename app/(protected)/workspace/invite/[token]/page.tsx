'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Mail, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/src/shared/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/shared/ui/card';
import { acceptInvitation } from '@/src/features/workspace';

type InviteStatus = 'loading' | 'valid' | 'accepted' | 'error';

/**
 * Accept workspace invitation page
 */
export default function AcceptInvitePage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('workspace.invite');
  const token = params.token as string;

  const [status, setStatus] = useState<InviteStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    // In a real implementation, we would validate the token here
    // For now, just mark as valid
    setStatus('valid');
  }, [token]);

  const handleAccept = async () => {
    setIsAccepting(true);
    setError(null);

    try {
      const result = await acceptInvitation(token);

      if (result.success && result.workspaceId) {
        setStatus('accepted');
        // Redirect to the dashboard - user can navigate to workspace from there
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setStatus('error');
        setError(result.error ?? t('failed'));
      }
    } catch (err) {
      setStatus('error');
      setError(
        err instanceof Error ? err.message : t('failed')
      );
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div
              className={`flex size-16 items-center justify-center rounded-2xl ${
                status === 'accepted'
                  ? 'bg-green-500/10'
                  : status === 'error'
                    ? 'bg-destructive/10'
                    : 'bg-primary/10'
              }`}
            >
              {status === 'loading' && (
                <Loader2 className="size-8 text-primary animate-spin" />
              )}
              {status === 'valid' && <Mail className="size-8 text-primary" />}
              {status === 'accepted' && (
                <CheckCircle className="size-8 text-green-500" />
              )}
              {status === 'error' && (
                <XCircle className="size-8 text-destructive" />
              )}
            </div>
          </div>
          <CardTitle className="text-2xl">
            {status === 'loading' && t('loading')}
            {status === 'valid' && t('title')}
            {status === 'accepted' && t('welcome')}
            {status === 'error' && t('error')}
          </CardTitle>
          <CardDescription>
            {status === 'loading' && t('validating')}
            {status === 'valid' && t('invited')}
            {status === 'accepted' && t('joined')}
            {status === 'error' && t('problemMessage')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'valid' && (
            <div className="space-y-4">
              <Button
                onClick={handleAccept}
                className="w-full"
                disabled={isAccepting}
              >
                {isAccepting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {t('accepting')}
                  </>
                ) : (
                  t('accept')
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/dashboard')}
                disabled={isAccepting}
              >
                {t('decline')}
              </Button>
            </div>
          )}

          {status === 'accepted' && (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                {t('redirecting')}
              </p>
              <Loader2 className="size-6 animate-spin mx-auto text-muted-foreground" />
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
                  {error}
                </div>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/dashboard')}
              >
                {t('goToDashboard')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
