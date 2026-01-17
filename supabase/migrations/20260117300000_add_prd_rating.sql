-- Add rating fields to prds table for quality feedback collection
-- Rating: 1 (thumbs down), 2 (thumbs up), NULL (not rated)
-- Feedback: optional text feedback from user

ALTER TABLE prds
ADD COLUMN rating smallint CHECK (rating IN (1, 2)),
ADD COLUMN rating_feedback text,
ADD COLUMN rated_at timestamptz;

-- Index for analytics queries
CREATE INDEX idx_prds_rating ON prds (rating) WHERE rating IS NOT NULL;

-- Comment for documentation
COMMENT ON COLUMN prds.rating IS '1 = thumbs down, 2 = thumbs up, NULL = not rated';
COMMENT ON COLUMN prds.rating_feedback IS 'Optional user feedback text';
COMMENT ON COLUMN prds.rated_at IS 'When the rating was submitted';
