-- Update default credits from 3 to 5
ALTER TABLE public.profiles 
ALTER COLUMN credits_remaining SET DEFAULT 5;

-- Update existing free users who have credits remaining to reflect new max
UPDATE public.profiles 
SET credits_remaining = LEAST(credits_remaining + 2, 5)
WHERE subscription_tier = 'free';