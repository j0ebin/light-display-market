import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

interface DeletionRequest {
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export default function DeletionStatus() {
  const router = useRouter();
  const { code } = router.query;
  const [request, setRequest] = useState<DeletionRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDeletionStatus() {
      if (!code) return;

      try {
        const { data, error } = await supabase
          .from('deletion_requests')
          .select('status, created_at, updated_at')
          .eq('confirmation_code', code)
          .single();

        if (error) throw error;
        setRequest(data);
      } catch (err) {
        setError('Failed to fetch deletion status. Please try again later.');
        console.error('Error fetching deletion status:', err);
      }
    }

    fetchDeletionStatus();
  }, [code]);

  if (!code) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full p-6">
          <h1 className="text-2xl font-bold mb-4">Invalid Request</h1>
          <p className="text-muted-foreground">
            No confirmation code provided. Please make sure you have the correct URL.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full p-6">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full p-6">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p className="text-muted-foreground">
            Fetching your deletion request status...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-6">
        <h1 className="text-2xl font-bold mb-4">Data Deletion Status</h1>
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">Status</h2>
            <p className="text-muted-foreground capitalize">{request.status}</p>
          </div>
          
          <div>
            <h2 className="font-semibold">Request Received</h2>
            <p className="text-muted-foreground">
              {new Date(request.created_at).toLocaleString()}
            </p>
          </div>

          <div>
            <h2 className="font-semibold">Last Updated</h2>
            <p className="text-muted-foreground">
              {new Date(request.updated_at).toLocaleString()}
            </p>
          </div>

          {request.status === 'pending' && (
            <p className="text-sm text-muted-foreground mt-4">
              Your data deletion request is being processed. This may take up to 30 days to complete.
              You can check back here anytime using this URL to see the current status.
            </p>
          )}

          {request.status === 'completed' && (
            <p className="text-sm text-muted-foreground mt-4">
              Your data has been successfully deleted from our systems.
            </p>
          )}

          {request.status === 'failed' && (
            <div className="mt-4">
              <p className="text-sm text-destructive">
                We encountered an issue while processing your deletion request.
                Please contact our support team for assistance.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 