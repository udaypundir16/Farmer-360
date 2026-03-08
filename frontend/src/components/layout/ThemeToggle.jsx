import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '../ui/button';

export default function ThemeToggle() {
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') || 'light'
    );

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
            root.classList.add(systemTheme);
            return;
        }

        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-10 h-10 bg-white/50 border border-primary-100/50 text-primary-700 hover:bg-primary-50 hover:text-primary-800 transition-all duration-300"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? (
                <Sun size={22} className="text-gold-500 fill-gold-500" />
            ) : (
                <Moon size={22} className="text-primary-700 fill-primary-700" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
