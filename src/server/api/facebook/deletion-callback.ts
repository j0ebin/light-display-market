import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function parseSignedRequest(signedRequest: string, appSecret: string) {
  const [encodedSig, payload] = signedRequest.split('.');
  
  // decode the data
  const sig = Buffer.from(encodedSig.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
  const data = JSON.parse(
    Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
  );

  // confirm the signature
  const expectedSig = crypto
    .createHmac('sha256', appSecret)
    .update(payload)
    .digest();

  if (!crypto.timingSafeEqual(sig, expectedSig)) {
    throw new Error('Bad signed JSON signature!');
  }

  return data;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const signedRequest = req.body.signed_request;
    if (!signedRequest) {
      return res.status(400).json({ error: 'Missing signed_request parameter' });
    }

    const appSecret = process.env.FACEBOOK_APP_SECRET;
    if (!appSecret) {
      return res.status(500).json({ error: 'Missing app secret configuration' });
    }

    // Parse and verify the signed request
    const data = parseSignedRequest(signedRequest, appSecret);
    const userId = data.user_id;

    // Create a unique confirmation code
    const confirmationCode = crypto.randomBytes(16).toString('hex');

    // Store deletion request in database
    await supabase
      .from('deletion_requests')
      .insert({
        facebook_user_id: userId,
        confirmation_code: confirmationCode,
        status: 'pending'
      });

    // Start the deletion process
    // TODO: Implement actual data deletion logic here
    // This should delete all user data associated with the Facebook user ID

    // Return the status URL and confirmation code
    const statusUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/account/deletion-status?code=${confirmationCode}`;
    
    return res.status(200).json({
      url: statusUrl,
      confirmation_code: confirmationCode
    });
  } catch (error) {
    console.error('Error processing deletion request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 