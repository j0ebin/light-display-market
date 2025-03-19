
-- Add a function to create purchases
CREATE OR REPLACE FUNCTION create_purchase(
  p_user_id UUID,
  p_sequence_id TEXT,
  p_amount_paid DECIMAL(10, 2),
  p_seller_id TEXT,
  p_status TEXT DEFAULT 'pending',
  p_stripe_session_id TEXT DEFAULT NULL
) 
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO purchases (
    user_id,
    sequence_id,
    amount_paid,
    seller_id,
    status,
    stripe_session_id
  ) VALUES (
    p_user_id,
    p_sequence_id,
    p_amount_paid,
    p_seller_id,
    p_status,
    p_stripe_session_id
  )
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- Add policy to allow users to execute the function
CREATE POLICY "Allow users to execute create_purchase" 
  ON purchases 
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
