import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark =
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  const buttonLabel = darkMode ? "Bytt til lys modus" : "Bytt til mørk modus";

  return (
    <button
      onClick={toggleDarkMode}
      className="dark-mode-toggle"
      aria-label={buttonLabel}
      aria-pressed={darkMode}
      title={buttonLabel}
    >
      {darkMode ? (
        <FiSun className="icon" aria-hidden="true" />
      ) : (
        <FiMoon className="icon" aria-hidden="true" />
      )}
    </button>
  );
}
