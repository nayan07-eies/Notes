import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from "@/app/store/uiSlice"; // Adjust path to your auth slice

export function LogoutButton({ variant = "ghost", className = "" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    if(confirm("Are you sure you want to sign out?"))
    dispatch(logout());
    navigate('/');
  };

  return (
    <Button 
      variant={variant} 
      onClick={handleLogout}
      className={`w-full flex items-center justify-start gap-2 ${className}`}
    >
      <LogOut className="h-4 w-4" />
      <span>Log Out</span>
    </Button>
  );
}