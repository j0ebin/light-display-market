
-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  sequence_id TEXT NOT NULL,
  amount_paid DECIMAL(10, 2) NOT NULL,
  seller_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS purchases_user_id_idx ON purchases(user_id);
CREATE INDEX IF NOT EXISTS purchases_sequence_id_idx ON purchases(sequence_id);
CREATE INDEX IF NOT EXISTS purchases_stripe_session_id_idx ON purchases(stripe_session_id);

-- Add RLS policies
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own purchases
CREATE POLICY "Users can view their own purchases" 
  ON purchases FOR SELECT 
  USING (auth.uid() = user_id);

-- Add update modified timestamp trigger
CREATE TRIGGER update_purchases_updated_at
  BEFORE UPDATE ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();
