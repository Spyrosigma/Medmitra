"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthSync } from "@/lib/auth-sync";

interface ClientLogoutButtonProps {
  className?: string;
  children: React.ReactNode;
}

export function ClientLogoutButton({ className, children }: ClientLogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    if (isLoading) return; // Prevent multiple clicks
    
    setIsLoading(true);
    try {
      const authSync = AuthSync.getInstance();
      await authSync.triggerSignOut();
      // Redirect will be handled by the auth sync system
    } catch (error) {
      console.error("Sign out error:", error);
      // Force redirect even if there's an error
      window.location.href = "/";
    }
    // Note: We don't set isLoading to false in finally block
    // because the page will redirect anyway
  };

  return (
    <Button
      onClick={handleSignOut}
      disabled={isLoading}
      variant="ghost"
      size="sm"
      className={className}
    >
      {isLoading ? "Signing out..." : children}
    </Button>
  );
} 