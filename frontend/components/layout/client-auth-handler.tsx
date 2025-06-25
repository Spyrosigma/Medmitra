"use client";

import { useEffect } from "react";
import { AuthSync } from "@/lib/auth-sync";

export function ClientAuthHandler() {
  useEffect(() => {
    const authSync = AuthSync.getInstance();
    return () => {
      authSync.destroy();
    };
  }, []);

  return null;
} 