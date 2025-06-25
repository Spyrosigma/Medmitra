import { createClient } from "@/utils/supabase/server";
import { ThemeSwitcher } from "@/components/landing/theme-switcher";
import { NavigationLinks } from "@/components/layout/navigation-links";
import { ClientLogoutButton } from "@/components/layout/client-logout-button";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Only show navbar when user is logged in
  if (!user) {
    return null;
  }

  return (
    <div className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="w-full max-w-4xl mx-auto px-1 sm:px-2">
        <div className="flex items-center justify-between h-12 sm:h-14">
          {/* Left side navigation links */}
          <div className="flex-1 min-w-0">
            <NavigationLinks className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide" />
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 ml-2 flex-shrink-0">
            <ClientLogoutButton className="rounded-full px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-xs sm:text-sm font-medium hover:bg-destructive/10 hover:text-destructive transition-all duration-200 whitespace-nowrap">
              <span className="hidden sm:inline">Sign out</span>
              <span className="sm:hidden border border-red-500 text-red-500 rounded-full px-1.5 py-0.5">Sign out</span>
            </ClientLogoutButton>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}