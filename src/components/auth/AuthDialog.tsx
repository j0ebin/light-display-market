
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import AuthSignIn from './AuthSignIn';
import AuthSignUp from './AuthSignUp';
import AuthResetPassword from './AuthResetPassword';
import { AuthView } from './AuthPopover';

interface AuthDialogProps {
  triggerClassName?: string;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ triggerClassName }) => {
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={triggerClassName || "rounded-full px-5"}>
          <LogIn size={18} className="mr-2" />
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0">
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
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
