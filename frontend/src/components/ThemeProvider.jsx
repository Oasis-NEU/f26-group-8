// ThemeProvider.jsx keeps track of the Light / Dark / System choice and
// shares it with every page. main.jsx wraps the whole app in it, so every
// page (and any page added later) gets light and dark mode automatically.
// The reading, saving, and applying is in theme.js; this file decides WHEN
// to do them. Components read it with useTheme() (also in theme.js).

// useState remembers a value and redraws when it changes.
// useEffect runs code after drawing. useMemo keeps the same object between
// redraws unless something in it changed. useRef remembers something
// without redrawing.
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    ThemeContext,
    applyTheme,
    loadThemeChoice,
    saveThemeChoice,
    systemTheme,
    themeStorageKey,
    watchSystemTheme,
} from '../theme.js';
// True when animations should be skipped (the computer's or our Settings' "reduce motion")
import { wantsReducedMotion } from '../settings.js';

// How long the colors fade when switching (index.css, "Switching between light and dark")
const FADE_TIME = 200;

// props.children is everything inside <ThemeProvider> ... </ThemeProvider>
function ThemeProvider(props) {
    // What the person picked: 'light', 'dark', or 'system'.
    // (Passing loadThemeChoice without () means "only read it the first time")
    const [theme, setThemeChoice] = useState(loadThemeChoice);

    // What the computer is set to right now: 'light' or 'dark'
    const [systemChoice, setSystemChoice] = useState(systemTheme);

    // What's actually showing. With System, it follows the computer
    const resolvedTheme = theme === 'system' ? systemChoice : theme;

    // Listen for the computer switching between light and dark mode (for
    // example, at sunset), so System updates right away with no reload.
    // It always listens, so picking System later is correct straight away
    useEffect(() => watchSystemTheme(setSystemChoice), []);

    // If the choice is changed in another tab of the site, follow it here too.
    // The "storage" event only fires in the OTHER tabs, never the one that saved
    useEffect(() => {
        function handleStorage(event) {
            if (event.key === themeStorageKey || event.key === null) {
                setThemeChoice(loadThemeChoice());
            }
        }
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    // The last theme put into effect, and the timer that ends the fade
    const shownTheme = useRef(null);
    const fadeTimer = useRef(null);

    // Put the theme into effect whenever it changes.
    // The very first time, index.html's script already did it, so there's
    // nothing to fade. After that, the "theme-changing" class makes every
    // color fade for a moment instead of snapping (unless "reduce motion" is on)
    useEffect(() => {
        const html = document.documentElement;
        const isChange = shownTheme.current !== null && shownTheme.current !== resolvedTheme;
        if (isChange && !wantsReducedMotion()) {
            html.classList.add('theme-changing');
            clearTimeout(fadeTimer.current);
            fadeTimer.current = setTimeout(() => html.classList.remove('theme-changing'), FADE_TIME);
        }
        applyTheme(resolvedTheme);
        shownTheme.current = resolvedTheme;
    }, [resolvedTheme]);

    // Stop the fade timer if the whole app closes
    useEffect(() => () => clearTimeout(fadeTimer.current), []);

    // What every component gets from useTheme(). setTheme saves the choice
    // (Light and Dark are remembered; System clears it) and then changes it
    const value = useMemo(() => ({
        theme,
        resolvedTheme,
        setTheme(choice) {
            if (choice !== 'light' && choice !== 'dark' && choice !== 'system') return;
            saveThemeChoice(choice);
            setThemeChoice(choice);
        },
    }), [theme, resolvedTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {props.children}
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;
