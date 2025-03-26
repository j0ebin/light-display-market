import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogIn, User, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthSignIn from './AuthSignIn';
import AuthSignUp from './AuthSignUp';
import AuthResetPassword from './AuthResetPassword';
import { AuthView } from './AuthPopover';
import { cn } from '@/lib/utils';

interface AuthDialogProps {
  triggerClassName?: string;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ triggerClassName }) => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<AuthView>('signIn');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleClose = () => {
    setOpen(false);
    // Reset to sign in view when closing
    setTimeout(() => setView('signIn'), 300);
  };

  const handleViewChange = (newView: AuthView) => {
    setView(newView);
  };

  const handleSignOut = async () => {
    await logout();
    handleClose();
    navigate('/');
  };

  const handleProfileClick = () => {
    handleClose();
    navigate('/profile');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {user ? (
          <Button className={triggerClassName || "rounded-full px-5"} variant="outline">
            <User size={18} className="mr-2" />
            Profile
          </Button>
        ) : (
          <Button className={triggerClassName || "rounded-full px-5"}>
            <LogIn size={18} className="mr-2" />
            Sign In
          </Button>
        )}
      </DialogTrigger>
      <DialogContent 
        className={cn(
          "fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] p-0",
          user ? "w-full max-w-xs" : "w-full max-w-md"
        )}
      >
        {user ? (
          <div className="p-6 bg-card rounded-lg border shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{user.email}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleClose}
              >
                <X size={16} />
              </Button>
            </div>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleProfileClick}
              >
                My Profile
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-lg border shadow-lg overflow-hidden">
            <div className="flex justify-end p-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleClose}
              >
                <X size={16} />
              </Button>
            </div>
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
