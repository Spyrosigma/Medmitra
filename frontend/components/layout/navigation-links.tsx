"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, PenTool, Sparkles, LayoutDashboard } from "lucide-react";

interface NavigationLinksProps {
  className?: string;
}

export function NavigationLinks({ className }: NavigationLinksProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/cases') {
      return pathname.startsWith('/cases');
    } else if (path === '/dashboard') {
      return pathname.startsWith('/dashboard');
    } else if (path === '/performance') {
      return pathname.startsWith('/performance');
    } else {
      return pathname === path;
    }
  };

  return (
    <div className={className}>

      <Link href="/dashboard">
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-full w-10 h-10 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 p-0 sm:p-2 text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center ${isActive('/dashboard')
            ? 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/20 hover:text-primary'
            : 'hover:bg-primary/10 hover:text-primary'
            }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="hidden sm:inline whitespace-nowrap ml-2">Dashboard</span>
        </Button>
      </Link>

      <Link href="/cases">
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-full w-10 h-10 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 p-0 sm:p-2 text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center ${isActive('/cases')
            ? 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/20 hover:text-primary'
            : 'hover:bg-primary/10 hover:text-primary'
            }`}
        >
          <PenTool className="w-4 h-4 sm:w-4 sm:h-4 sm:mr-2" />
          <span className="hidden sm:inline whitespace-nowrap">Cases</span>
        </Button>
      </Link>


      <Link href="/performance">
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-full w-10 h-10 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 p-0 sm:p-2 text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center ${isActive('/performance')
            ? 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/20 hover:text-primary'
            : 'hover:bg-primary/10 hover:text-primary'
            }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline whitespace-nowrap ml-2">Performance</span>
        </Button>
      </Link>
    </div>
  );
} 