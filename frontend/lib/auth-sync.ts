import { createClient } from "@/utils/supabase/client";

export class AuthSync {
  private static instance: AuthSync;
  private supabase = createClient();
  private storageKey = 'auth_sync_event';
  private authStateKey = 'supabase_auth_state';
  private isSigningOut = false; // Prevent multiple simultaneous sign-outs

  private constructor() {
    this.init();
  }

  public static getInstance(): AuthSync {
    if (!AuthSync.instance) {
      AuthSync.instance = new AuthSync();
    }
    return AuthSync.instance;
  }

  private init() {
    // Listen for storage changes (cross-tab communication)
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.handleStorageChange.bind(this));
      
      // Listen for Supabase auth state changes
      this.supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT' && !this.isSigningOut) {
          // Only broadcast if this wasn't initiated by cross-tab sync
          this.broadcastSignOut();
        }
        
        // Update auth state in localStorage for cross-tab sync
        if (session) {
          localStorage.setItem(this.authStateKey, JSON.stringify({
            user: session.user,
            timestamp: Date.now()
          }));
        } else {
          localStorage.removeItem(this.authStateKey);
        }
      });

      // Check for existing auth state on initialization
      this.checkAuthState();
    }
  }

  private handleStorageChange(event: StorageEvent) {
    // Handle cross-tab logout events
    if (event.key === this.storageKey && event.newValue) {
      const data = JSON.parse(event.newValue);
      if (data.type === 'SIGN_OUT') {
        this.handleCrossTabSignOut();
      }
    }

    // Handle auth state changes from other tabs
    if (event.key === this.authStateKey) {
      if (!event.newValue) {
        // Auth state was removed in another tab - sign out this tab
        this.handleCrossTabSignOut();
      }
    }
  }

  private async handleCrossTabSignOut() {
    if (this.isSigningOut) return; // Prevent multiple simultaneous sign-outs
    
    this.isSigningOut = true;
    
    try {
      // Sign out from Supabase in this tab
      await this.supabase.auth.signOut();
      
      // Redirect to home page immediately
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error during cross-tab sign out:', error);
      // Force redirect even if signOut fails
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } finally {
      this.isSigningOut = false;
    }
  }

  private broadcastSignOut() {
    if (typeof window !== 'undefined') {
      // Broadcast sign out event to other tabs immediately
      const event = {
        type: 'SIGN_OUT',
        timestamp: Date.now()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(event));
      
      // Clean up immediately using requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        localStorage.removeItem(this.storageKey);
      });
    }
  }

  private async checkAuthState() {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      const storedAuth = localStorage.getItem(this.authStateKey);
      
      if (session && !storedAuth) {
        localStorage.setItem(this.authStateKey, JSON.stringify({
          user: session.user,
          timestamp: Date.now()
        }));
      }
      
      // If we have stored auth state but no session, clear it
      if (!session && storedAuth) {
        localStorage.removeItem(this.authStateKey);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    }
  }

  // Public method to trigger sign out sync
  public async triggerSignOut() {
    if (this.isSigningOut) return; // Prevent multiple simultaneous sign-outs
    
    this.isSigningOut = true;
    
    try {
      // Broadcast first for immediate cross-tab sync
      this.broadcastSignOut();
      
      // Then sign out from Supabase
      await this.supabase.auth.signOut();
      
      // Redirect the current tab to home page
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error during sign out:', error);
      // Force redirect even if signOut fails
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      throw error;
    } finally {
      this.isSigningOut = false;
    }
  }

  // Clean up event listeners
  public destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.handleStorageChange.bind(this));
    }
  }
}

// Initialize auth sync when module is imported
if (typeof window !== 'undefined') {
  AuthSync.getInstance();
} 