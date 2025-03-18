
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { LogIn, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthSignIn from './AuthSignIn';
import AuthSignUp from './AuthSignUp';
import AuthResetPassword from './AuthResetPassword';

export type AuthView = 'signIn' | 'signUp' | 'resetPassword';

const AuthPopover = () => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<AuthView>('signIn');
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleClose = () => {
    setOpen(false);
    // Reset to sign in view when closing
    setTimeout(() => setView('signIn'), 300);
  };

  const handleViewChange = (newView: AuthView) => {
    setView(newView);
  };

  const handleSignOut = async () => {
    await signOut();
    handleClose();
    navigate('/');
  };

  const handleProfileClick = () => {
    handleClose();
    navigate('/profile');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {user ? (
          <Button variant="outline" className="rounded-full px-5">
            <User size={18} className="mr-2" />
            Profile
          </Button>
        ) : (
          <Button className="rounded-full px-5">
            <LogIn size={18} className="mr-2" />
            Sign In
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        {user ? (
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-4 w-4" />
              <span className="font-medium">{user.email}</span>
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
          <>
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
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default AuthPopover;
