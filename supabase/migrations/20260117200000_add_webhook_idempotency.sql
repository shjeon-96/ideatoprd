-- Add idempotency support for webhook processing
-- Prevents duplicate credit grants on webhook retries

-- Add last_invoice_id to subscriptions for payment idempotency
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS last_invoice_id text;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_last_invoice_id
ON public.subscriptions(last_invoice_id)
WHERE last_invoice_id IS NOT NULL;

-- Create processed_webhooks table for general idempotency
CREATE TABLE IF NOT EXISTS public.processed_webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id text UNIQUE NOT NULL,
  event_name text NOT NULL,
  processed_at timestamptz DEFAULT now() NOT NULL,
  metadata jsonb
);

-- Index for cleanup queries
CREATE INDEX IF NOT EXISTS idx_processed_webhooks_processed_at
ON public.processed_webhooks(processed_at);

-- RLS: Only service role can access
ALTER TABLE public.processed_webhooks ENABLE ROW LEVEL SECURITY;

-- Clean up old webhook records (keep 30 days)
-- This should be run periodically via cron or scheduled function
CREATE OR REPLACE FUNCTION public.cleanup_old_webhooks()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM public.processed_webhooks
  WHERE processed_at < now() - interval '30 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.cleanup_old_webhooks() TO service_role;
