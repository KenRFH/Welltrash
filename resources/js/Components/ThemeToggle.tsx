// ponytail: theme limited to 'light' | 'dark' via localStorage and matchMedia; add multi-palette system theme presets when requested.
import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
    className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
    const [isDark, setIsDark] = useState<boolean>(false);

    useEffect(() => {
        // Read initial state from <html> class
        const checkDark = () => {
            const hasDarkClass = document.documentElement.classList.contains("dark");
            setIsDark(hasDarkClass);
        };

        checkDark();

        const handleThemeChange = () => checkDark();
        window.addEventListener("welltrash-theme-change", handleThemeChange);

        return () => {
            window.removeEventListener("welltrash-theme-change", handleThemeChange);
        };
    }, []);

    const toggleTheme = () => {
        const nextDark = !isDark;
        setIsDark(nextDark);

        if (nextDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }

        // Update meta theme-color for mobile browser header
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute("content", nextDark ? "#09090b" : "#0C3325");
        }

        // Notify other toggle instances on the page
        window.dispatchEvent(new Event("welltrash-theme-change"));
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
            title={isDark ? "Mode Terang" : "Mode Gelap"}
            className={`p-2 rounded-full border transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                isDark
                    ? "bg-zinc-800 border-zinc-700 text-amber-400 hover:bg-zinc-700 hover:text-amber-300"
                    : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            } ${className}`}
        >
            {isDark ? (
                <Sun className="w-4 h-4 transition-transform duration-200 rotate-0 hover:rotate-45" />
            ) : (
                <Moon className="w-4 h-4 transition-transform duration-200 -rotate-12 hover:rotate-0" />
            )}
        </button>
    );
}
