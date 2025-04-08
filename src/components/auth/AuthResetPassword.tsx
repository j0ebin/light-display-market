import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { AuthView } from './AuthPopover';
import { Loader2 } from 'lucide-react';

// Form validation schema
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type FormValues = z.infer<typeof formSchema>;

interface AuthResetPasswordProps {
  onViewChange: (view: AuthView) => void;
  onSuccess: () => void;
}

const AuthResetPassword: React.FC<AuthResetPasswordProps> = ({ onViewChange, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setEmailSent(true);
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password.",
      });
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message || "There was a problem sending the reset link.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Reset Your Password</h2>
        <p className="text-sm text-muted-foreground">
          Don't worry, it happens! Enter your email and we'll send you instructions to reset your password.
        </p>
      </div>
      
      {emailSent ? (
        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              Password reset link has been sent to your email address. Please check your inbox.
            </AlertDescription>
          </Alert>
          <Button 
            className="w-full" 
            onClick={() => onViewChange('signIn')}
          >
            Back to Sign In
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Send Reset Instructions"
              )}
            </Button>
          </form>
        </Form>
      )}

      <div className="mt-6 text-center text-sm">
        <p className="text-muted-foreground">
          Remember your password?{" "}
          <Button
            variant="link"
            className="p-0 text-primary"
            onClick={() => onViewChange('signIn')}
          >
            Sign in
          </Button>
        </p>
      </div>
    </div>
  );
};

export default AuthResetPassword;
