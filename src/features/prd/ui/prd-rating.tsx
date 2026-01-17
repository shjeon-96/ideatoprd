'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Send, Check } from 'lucide-react';
import { Button } from '@/src/shared/ui/button';
import { Textarea } from '@/src/shared/ui/textarea';
import { cn } from '@/src/shared/lib/utils';

interface PrdRatingProps {
  prdId: string;
  initialRating?: number | null;
  initialFeedback?: string | null;
}

type RatingValue = 1 | 2; // 1 = thumbs down, 2 = thumbs up

export function PrdRating({ prdId, initialRating, initialFeedback }: PrdRatingProps) {
  const [rating, setRating] = useState<RatingValue | null>(
    initialRating as RatingValue | null
  );
  const [feedback, setFeedback] = useState(initialFeedback ?? '');
  const [showFeedback, setShowFeedback] = useState(!!initialRating);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(!!initialRating);
  const [error, setError] = useState<string | null>(null);

  const handleRatingClick = (value: RatingValue) => {
    setRating(value);
    setShowFeedback(true);
    setIsSubmitted(false);
  };

  const handleSubmit = async () => {
    if (!rating) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/prds/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prdId,
          rating,
          feedback: feedback.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      setIsSubmitted(true);
    } catch {
      setError('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Was this PRD helpful?</span>
        {isSubmitted && (
          <span className="flex items-center gap-1 text-xs text-green-600">
            <Check className="h-3 w-3" />
            Thanks for your feedback!
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={rating === 2 ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleRatingClick(2)}
          className={cn(
            'gap-1.5',
            rating === 2 && 'bg-green-600 hover:bg-green-700'
          )}
        >
          <ThumbsUp className="h-4 w-4" />
          Helpful
        </Button>
        <Button
          variant={rating === 1 ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleRatingClick(1)}
          className={cn(
            'gap-1.5',
            rating === 1 && 'bg-orange-600 hover:bg-orange-700'
          )}
        >
          <ThumbsDown className="h-4 w-4" />
          Not helpful
        </Button>
      </div>

      {showFeedback && (
        <div className="space-y-2 pt-2">
          <Textarea
            placeholder={
              rating === 1
                ? "What could be improved? (optional)"
                : "What did you like? (optional)"
            }
            value={feedback}
            onChange={(e) => {
              setFeedback(e.target.value);
              setIsSubmitted(false);
            }}
            rows={2}
            className="resize-none text-sm"
          />
          <div className="flex items-center justify-between">
            {error && <span className="text-xs text-destructive">{error}</span>}
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isSubmitting || !rating}
              className="ml-auto gap-1.5"
            >
              {isSubmitting ? (
                'Submitting...'
              ) : isSubmitted ? (
                <>
                  <Check className="h-3 w-3" />
                  Submitted
                </>
              ) : (
                <>
                  <Send className="h-3 w-3" />
                  Submit
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
