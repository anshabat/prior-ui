import { useRef, useEffect } from "react";

export function useThemeRef() {
  const themeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Function to update theme attribute
    const updateTheme = (isDark: boolean) => {
      if (themeRef.current) {
        themeRef.current.setAttribute("data-theme", isDark ? "dark" : "light");
      }
    };

    // Handler for when the preference changes
    const handleChange = (event: MediaQueryListEvent) => {
      updateTheme(event.matches);
    };

    // Add event listener
    mediaQuery.addEventListener("change", handleChange);

    // Set initial value
    updateTheme(mediaQuery.matches);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return themeRef;
}
