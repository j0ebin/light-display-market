import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { AuthView } from './AuthPopover';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

interface AuthSignInProps {
  onViewChange: (view: AuthView) => void;
  onSuccess: () => void;
}

const AuthSignIn = ({ onViewChange, onSuccess }: AuthSignInProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await signIn(values.email, values.password);
      onSuccess();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Invalid email or password.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-8 pb-8">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Welcome back</h2>
        <p className="text-sm text-muted-foreground">
          Enter your email to sign in to your account
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="current-password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Form>

      <div className="mt-4 text-center text-sm">
        <Button
          variant="link"
          className="text-muted-foreground hover:text-primary px-2"
          onClick={() => onViewChange('resetPassword')}
        >
          Forgot password?
        </Button>
      </div>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Don't have an account?</span>{' '}
        <Button
          variant="link"
          className="text-primary hover:text-primary/90 px-2"
          onClick={() => onViewChange('signUp')}
        >
          Sign up
        </Button>
      </div>
    </div>
  );
};

export default AuthSignIn;
