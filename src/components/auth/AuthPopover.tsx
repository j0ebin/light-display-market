import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogIn, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthSignIn from './AuthSignIn';
import AuthSignUp from './AuthSignUp';
import AuthResetPassword from './AuthResetPassword';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type AuthView = 'signIn' | 'signUp' | 'resetPassword';

const AuthPopover = () => {
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
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="rounded-full px-5">
            <User size={18} className="mr-2" />
            Profile
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <div className="flex items-center space-x-2 p-2 mb-2 border-b">
            <User className="h-4 w-4" />
            <span className="font-medium text-sm truncate">{user.user_metadata?.full_name || user.email}</span>
          </div>
          <DropdownMenuItem onClick={handleProfileClick}>
            My Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut}>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)} className="rounded-full px-5">
        <LogIn size={18} className="mr-2" />
        Sign In
      </Button>
      <DialogContent className="sm:max-w-[425px]">
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

export default AuthPopover;
