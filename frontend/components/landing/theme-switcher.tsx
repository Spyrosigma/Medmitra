"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const ICON_SIZE = 16;

  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary transition-colors duration-200"
    >
      {theme === "light" ? (
        <Sun
          key="light"
          size={ICON_SIZE}
          className="text-primary"
        />
      ) : (
        <Moon
          key="dark"
          size={ICON_SIZE}
          className="text-primary"
        />
      )}
    </Button>
  );
};

export { ThemeSwitcher };
