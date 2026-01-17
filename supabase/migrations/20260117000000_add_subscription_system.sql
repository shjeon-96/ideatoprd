-- Subscription System Migration
-- Adds subscription support alongside existing one-time credit purchases

-- 1. Create subscription plan enum
CREATE TYPE subscription_plan AS ENUM ('basic', 'pro', 'business');

-- 2. Create subscription status enum
CREATE TYPE subscription_status AS ENUM ('active', 'paused', 'cancelled', 'expired', 'past_due');

-- 3. Create billing interval enum
CREATE TYPE billing_interval AS ENUM ('monthly', 'yearly');

-- 4. Extend usage_type enum with subscription_credit
ALTER TYPE usage_type ADD VALUE 'subscription_credit';

-- 5. Create subscriptions table
CREATE TABLE public.subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan subscription_plan NOT NULL,
  status subscription_status NOT NULL DEFAULT 'active',
  billing_interval billing_interval NOT NULL DEFAULT 'monthly',

  -- Lemon Squeezy integration
  lemon_squeezy_subscription_id text UNIQUE NOT NULL,
  lemon_squeezy_customer_id text,
  lemon_squeezy_variant_id text,

  -- Credit configuration
  monthly_credits integer NOT NULL,
  credit_cap integer NOT NULL,

  -- Billing period
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,

  -- Cancellation tracking
  cancelled_at timestamptz,
  ends_at timestamptz,

  -- Payment info
  amount_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'USD',

  -- Timestamps
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 6. Extend profiles table with subscription info
ALTER TABLE public.profiles
  ADD COLUMN subscription_plan subscription_plan,
  ADD COLUMN subscription_status subscription_status,
  ADD COLUMN subscription_renews_at timestamptz;

-- 7. Create indexes for performance
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_subscriptions_lemon_squeezy_id ON public.subscriptions(lemon_squeezy_subscription_id);
CREATE INDEX idx_profiles_subscription_status ON public.profiles(subscription_status) WHERE subscription_status IS NOT NULL;

-- 8. Enable RLS on subscriptions table
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 9. RLS policies for subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all subscriptions"
  ON public.subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 10. Updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 11. Updated_at trigger for subscriptions
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 11. Grant subscription credits function (with cap enforcement)
CREATE OR REPLACE FUNCTION public.grant_subscription_credits(
  p_user_id uuid,
  p_amount integer,
  p_credit_cap integer,
  p_subscription_id uuid DEFAULT NULL,
  p_description text DEFAULT 'Monthly subscription credit'
)
RETURNS integer -- Returns actual credits granted (may be less due to cap)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_current_credits integer;
  v_credits_to_add integer;
  v_new_credits integer;
BEGIN
  -- Get current credits with lock
  SELECT credits INTO v_current_credits
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF v_current_credits IS NULL THEN
    RETURN 0;
  END IF;

  -- Calculate how many credits can be added (cap enforcement)
  IF v_current_credits >= p_credit_cap THEN
    -- Already at or above cap, no credits added
    RETURN 0;
  END IF;

  -- Calculate actual credits to add (don't exceed cap)
  v_credits_to_add := LEAST(p_amount, p_credit_cap - v_current_credits);
  v_new_credits := v_current_credits + v_credits_to_add;

  -- Update credits
  UPDATE public.profiles
  SET credits = v_new_credits,
      updated_at = now()
  WHERE id = p_user_id;

  -- Log the credit addition
  INSERT INTO public.usage_logs (
    user_id, usage_type, credits_delta,
    credits_before, credits_after,
    description, metadata
  ) VALUES (
    p_user_id, 'subscription_credit', v_credits_to_add,
    v_current_credits, v_new_credits,
    p_description,
    jsonb_build_object(
      'subscription_id', p_subscription_id,
      'requested_amount', p_amount,
      'cap', p_credit_cap,
      'capped', v_credits_to_add < p_amount
    )
  );

  RETURN v_credits_to_add;
END;
$$;

-- 12. Get active subscription function
CREATE OR REPLACE FUNCTION public.get_active_subscription(p_user_id uuid)
RETURNS TABLE (
  id uuid,
  plan subscription_plan,
  status subscription_status,
  billing_interval billing_interval,
  monthly_credits integer,
  credit_cap integer,
  current_period_end timestamptz,
  cancelled_at timestamptz,
  ends_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.plan,
    s.status,
    s.billing_interval,
    s.monthly_credits,
    s.credit_cap,
    s.current_period_end,
    s.cancelled_at,
    s.ends_at
  FROM public.subscriptions s
  WHERE s.user_id = p_user_id
    AND s.status IN ('active', 'cancelled')
    AND (s.ends_at IS NULL OR s.ends_at > now())
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$;

-- 13. Grant execute permissions
GRANT EXECUTE ON FUNCTION public.grant_subscription_credits(uuid, integer, integer, uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_active_subscription(uuid) TO authenticated;
