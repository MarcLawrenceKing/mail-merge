import { useState } from "react";
import { getStoredTheme, setTheme } from "../theme";
import type { Theme } from "../theme";


const ThemeToggle = () => {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme());

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    setThemeState(next);
  };

  return (
    <button
      className="btn me-2"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <i
        className={`bi ${
          theme === "light" ? "bi-moon-fill" : "bi-sun-fill"
        }`}
      />
    </button>
  );
};

export default ThemeToggle;
