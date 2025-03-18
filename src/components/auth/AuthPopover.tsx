
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import AuthSignIn from './AuthSignIn';
import AuthSignUp from './AuthSignUp';
import AuthResetPassword from './AuthResetPassword';

export type AuthView = 'signIn' | 'signUp' | 'resetPassword';

const AuthPopover = () => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<AuthView>('signIn');
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    // Reset to sign in view when closing
    setTimeout(() => setView('signIn'), 300);
  };

  const handleViewChange = (newView: AuthView) => {
    setView(newView);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="rounded-full px-5">
          <LogIn size={18} className="mr-2" />
          Sign In
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        {view === 'signIn' && (
          <AuthSignIn 
            onViewChange={handleViewChange} 
            onSuccess={() => {
              handleClose();
              navigate('/');
            }}
          />
        )}
        {view === 'signUp' && (
          <AuthSignUp 
            onViewChange={handleViewChange} 
            onSuccess={() => {
              handleClose();
              navigate('/');
            }}
          />
        )}
        {view === 'resetPassword' && (
          <AuthResetPassword 
            onViewChange={handleViewChange}
            onSuccess={() => {
              handleClose();
            }}
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

export default AuthPopover;
