import React, { useState } from 'react';
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
import { GoogleLogin } from '@/components/auth/GoogleLogin';
import { FacebookLogin } from '@/components/auth/FacebookLogin';
import { Palette, Users, Star } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface AuthSignUpProps {
  onViewChange: (view: AuthView) => void;
  onSuccess: () => void;
}

const AuthSignUp = ({ onViewChange, onSuccess }: AuthSignUpProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const { data, error } = await signUp(values.email, values.password);
      
      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Please check your email to confirm your account.',
      });
      onSuccess();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-8 pb-8">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Join the Community</h2>
        <p className="text-sm text-muted-foreground">
          Create your account to start designing amazing light displays
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="col-span-1">
          <GoogleLogin />
        </div>
        <div className="col-span-1">
          <FacebookLogin />
        </div>
      </div>

      <div className="space-y-3 mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Palette className="h-4 w-4 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">Design stunning light displays with our easy-to-use tools</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">Connect with other light display enthusiasts</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Star className="h-4 w-4 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">Get inspired by featured displays from the community</p>
        </div>
      </div>

      <div className="relative mb-8">
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
                    placeholder="Create a password"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="new-password"
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
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Confirm your password"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </Form>
      </div>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Already have an account?</span>{' '}
        <Button
          variant="link"
          className="text-primary hover:text-primary/90 px-2"
          onClick={() => onViewChange('signIn')}
        >
          Sign in
        </Button>
      </div>
    </div>
  );
};

export default AuthSignUp;
