-- Add 'research' to prd_version enum for trend-based PRD generation
-- This version includes web search for market trends, competitors, and technology insights

-- Add new enum value
alter type public.prd_version add value if not exists 'research';

-- Update comments for documentation
comment on type public.prd_version is 'PRD generation version: basic (1 credit), detailed (2 credits), research (3 credits with web search)';
