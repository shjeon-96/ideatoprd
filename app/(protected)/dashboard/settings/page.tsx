import Link from 'next/link';
import { Coins, User, Mail, Calendar, Settings, ArrowRight, Sparkles, Crown } from 'lucide-react';
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
          <p className="text-muted-foreground">로그인이 필요합니다.</p>
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
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('ko-KR', {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">설정</h1>
          <p className="mt-1 text-muted-foreground">
            계정 정보와 크레딧을 관리하세요.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Subscription Section */}
        <Card className="card-3d border-border/50 bg-card xl:col-span-1">
          <CardHeader className="border-b border-border/50 pb-6">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Crown className="size-5 text-brand-primary" />
              구독
            </CardTitle>
            <CardDescription>구독 플랜 관리</CardDescription>
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
                      {SUBSCRIPTION_PLANS[subscriptionPlan].name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {subscriptionStatus === 'active' && '활성 구독'}
                      {subscriptionStatus === 'cancelled' && '취소됨 (기간 만료 시 종료)'}
                    </p>
                  </div>
                </div>

                {/* Subscription details */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">월간 크레딧</span>
                    <span className="font-medium">{SUBSCRIPTION_PLANS[subscriptionPlan].monthlyCredits}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">크레딧 캡</span>
                    <span className="font-medium">{SUBSCRIPTION_PLANS[subscriptionPlan].creditCap}</span>
                  </div>
                  {subscriptionRenewsAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {subscriptionStatus === 'cancelled' ? '종료일' : '다음 결제일'}
                      </span>
                      <span className="font-medium">
                        {new Date(subscriptionRenewsAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  )}
                </div>

                <Link href="/subscribe" className="block">
                  <Button variant="outline" className="h-12 w-full font-semibold">
                    구독 관리
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {/* No subscription */}
                <div className="rounded-xl bg-muted/30 p-6 text-center">
                  <Crown className="mx-auto size-12 text-muted-foreground/50" />
                  <p className="mt-4 font-medium text-foreground">구독 중이 아닙니다</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    구독하면 매월 크레딧이 자동으로 충전됩니다.
                  </p>
                </div>

                <Link href="/subscribe" className="block">
                  <Button className="btn-magnetic group h-12 w-full bg-gradient-to-r from-brand-primary to-brand-accent font-semibold text-white shadow-md hover:shadow-lg">
                    구독 시작하기
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
              프로필
            </CardTitle>
            <CardDescription>계정 정보</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              {profile?.avatar_url ? (
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
                  {memberSince} 가입
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
                  <p className="text-xs text-muted-foreground">이름</p>
                  <p className="font-medium text-foreground">{displayName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-background">
                  <Mail className="size-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">이메일</p>
                  <p className="font-medium text-foreground">{userEmail}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-background">
                  <Calendar className="size-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">가입일</p>
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
              크레딧
            </CardTitle>
            <CardDescription>PRD 생성 크레딧</CardDescription>
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
                  사용 가능한 크레딧
                </p>
              </div>
            </div>

            {/* Credit info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="size-1.5 rounded-full bg-brand-primary" />
                기본 PRD 생성: 1 크레딧
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="size-1.5 rounded-full bg-brand-primary" />
                상세 PRD 생성: 2 크레딧
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="size-1.5 rounded-full bg-violet-500" />
                리서치 PRD 생성: 3 크레딧
              </div>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              크레딧을 구매하여 더 많은 PRD를 생성하세요.
              한 번 구매하면 영구적으로 사용할 수 있습니다.
            </p>

            <Link href="/purchase" className="block">
              <Button className="btn-magnetic group h-12 w-full bg-gradient-to-r from-brand-primary to-brand-accent font-semibold text-white shadow-md hover:shadow-lg">
                크레딧 구매하기
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
