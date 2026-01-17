import Link from 'next/link';
import { Coins, User, Mail, Calendar, Settings, ArrowRight, Sparkles, Crown } from 'lucide-react';
import { getTranslations, getLocale } from 'next-intl/server';
import { createClient } from '@/src/shared/lib/supabase/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/shared/ui/card';
import { Button } from '@/src/shared/ui/button';
import { SUBSCRIPTION_PLANS } from '@/src/features/subscription/model/subscription-plans';

export const metadata = {
  title: 'Settings | IdeaToPRD',
  description: 'Manage your account settings and view profile information',
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const t = await getTranslations('settings');
  const tSub = await getTranslations('subscription');
  const locale = await getLocale();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-muted">
            <User className="size-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">{t('loginRequired')}</p>
        </div>
      </div>
    );
  }

  // Get profile from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, display_name, avatar_url, credits, created_at, subscription_plan, subscription_status, subscription_renews_at')
    .eq('id', user.id)
    .single();

  const userEmail = profile?.email ?? user.email ?? 'Unknown';
  const displayName = profile?.display_name ?? userEmail.split('@')[0];
  const userInitial = displayName.charAt(0).toUpperCase();
  const credits = profile?.credits ?? 0;
  const subscriptionPlan = profile?.subscription_plan;
  const subscriptionStatus = profile?.subscription_status;
  const subscriptionRenewsAt = profile?.subscription_renews_at;
  const dateLocale = locale === 'ko' ? 'ko-KR' : 'en-US';
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(dateLocale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown';

  return (
    <div className="animate-fade-in space-y-8">
      {/* Page Header */}
      <div className="flex items-start gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-muted">
          <Settings className="size-7 text-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('title')}</h1>
          <p className="mt-1 text-muted-foreground">
            {t('description')}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Subscription Section */}
        <Card className="card-3d border-border/50 bg-card xl:col-span-1">
          <CardHeader className="border-b border-border/50 pb-6">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Crown className="size-5 text-brand-primary" />
              {t('subscription.title')}
            </CardTitle>
            <CardDescription>{t('subscription.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {subscriptionPlan && subscriptionStatus ? (
              <>
                {/* Active subscription */}
                <div className="flex items-center gap-5 rounded-xl bg-gradient-to-br from-brand-secondary/50 to-brand-secondary/20 p-6">
                  <div className="glow-brand flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-lg">
                    <Crown className="size-8 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold tracking-tight text-foreground">
                      {tSub(SUBSCRIPTION_PLANS[subscriptionPlan].nameKey)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {subscriptionStatus === 'active' && t('subscription.active')}
                      {subscriptionStatus === 'cancelled' && t('subscription.cancelled')}
                    </p>
                  </div>
                </div>

                {/* Subscription details */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('subscription.monthlyCredits')}</span>
                    <span className="font-medium">{SUBSCRIPTION_PLANS[subscriptionPlan].monthlyCredits}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('subscription.creditCap')}</span>
                    <span className="font-medium">{SUBSCRIPTION_PLANS[subscriptionPlan].creditCap}</span>
                  </div>
                  {subscriptionRenewsAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {subscriptionStatus === 'cancelled' ? t('subscription.endDate') : t('subscription.nextBillingDate')}
                      </span>
                      <span className="font-medium">
                        {new Date(subscriptionRenewsAt).toLocaleDateString(dateLocale)}
                      </span>
                    </div>
                  )}
                </div>

                <Link href="/subscribe" className="block">
                  <Button variant="outline" className="h-12 w-full font-semibold">
                    {t('subscription.manage')}
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {/* No subscription */}
                <div className="rounded-xl bg-muted/30 p-6 text-center">
                  <Crown className="mx-auto size-12 text-muted-foreground/50" />
                  <p className="mt-4 font-medium text-foreground">{t('subscription.notSubscribed')}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t('subscription.subscribeInfo')}
                  </p>
                </div>

                <Link href="/subscribe" className="block">
                  <Button className="btn-magnetic group h-12 w-full bg-gradient-to-r from-brand-primary to-brand-accent font-semibold text-white shadow-md hover:shadow-lg">
                    {t('subscription.start')}
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        {/* Profile Section */}
        <Card className="card-3d border-border/50 bg-card">
          <CardHeader className="border-b border-border/50 pb-6">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="size-5 text-brand-primary" />
              {t('profile.title')}
            </CardTitle>
            <CardDescription>{t('profile.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              {profile?.avatar_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="size-20 rounded-2xl border-2 border-border object-cover shadow-md"
                />
              ) : (
                <div className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent text-3xl font-bold text-white shadow-md">
                  {userInitial}
                </div>
              )}
              <div>
                <p className="text-xl font-semibold text-foreground">{displayName}</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="size-3.5" />
                  {memberSince} {t('profile.joinedSuffix')}
                </p>
              </div>
            </div>

            {/* Profile details */}
            <div className="space-y-4 rounded-xl bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-background">
                  <User className="size-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{t('profile.name')}</p>
                  <p className="font-medium text-foreground">{displayName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-background">
                  <Mail className="size-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{t('profile.email')}</p>
                  <p className="font-medium text-foreground">{userEmail}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-background">
                  <Calendar className="size-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{t('profile.joinDate')}</p>
                  <p className="font-medium text-foreground">{memberSince}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credits Section */}
        <Card className="card-3d border-border/50 bg-card">
          <CardHeader className="border-b border-border/50 pb-6">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Coins className="size-5 text-brand-primary" />
              {t('credits.title')}
            </CardTitle>
            <CardDescription>{t('credits.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Credit display */}
            <div className="flex items-center gap-5 rounded-xl bg-gradient-to-br from-brand-secondary/50 to-brand-secondary/20 p-6">
              <div className="glow-brand flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-lg">
                <Sparkles className="size-8 text-white" />
              </div>
              <div>
                <p className="text-4xl font-bold tracking-tight text-foreground">
                  {credits}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('credits.available')}
                </p>
              </div>
            </div>

            {/* Credit info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="size-1.5 rounded-full bg-brand-primary" />
                {t('credits.basicInfo')}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="size-1.5 rounded-full bg-brand-primary" />
                {t('credits.detailedInfo')}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="size-1.5 rounded-full bg-violet-500" />
                {t('credits.researchInfo')}
              </div>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {t('credits.purchaseInfo')}
            </p>

            <Link href="/purchase" className="block">
              <Button className="btn-magnetic group h-12 w-full bg-gradient-to-r from-brand-primary to-brand-accent font-semibold text-white shadow-md hover:shadow-lg">
                {t('credits.purchase')}
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
