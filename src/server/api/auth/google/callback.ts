import { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Code is required' });
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.VITE_GOOGLE_CLIENT_ID!,
        client_secret: process.env.VITE_GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/auth/callback`,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      throw new Error(`Failed to exchange code: ${error}`);
    }

    const tokens = await tokenResponse.json();
    return res.status(200).json(tokens);
  } catch (error) {
    console.error('Token exchange error:', error);
    return res.status(500).json({ message: 'Failed to exchange authorization code' });
  }
} 