
-- Add a function to get purchase details
CREATE OR REPLACE FUNCTION get_purchase_details(
  p_user_id UUID,
  p_sequence_id TEXT
) 
RETURNS TABLE (
  id UUID,
  sequence_id TEXT,
  amount_paid DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.sequence_id,
    p.amount_paid,
    p.created_at
  FROM 
    purchases p
  WHERE 
    p.user_id = p_user_id AND
    p.sequence_id = p_sequence_id AND
    p.status = 'completed'
  ORDER BY
    p.created_at DESC
  LIMIT 1;
END;
$$;

-- Add RLS Policy to allow access to the function
CREATE POLICY "Allow users to access their purchase details" 
  ON purchases 
  FOR SELECT 
  USING (auth.uid() = user_id);
