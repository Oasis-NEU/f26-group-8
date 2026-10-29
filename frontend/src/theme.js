// theme.js is everything about the Light / Dark / System choice that isn't
// drawn on the screen: reading and saving the choice, asking the computer
// whether it's in dark mode, and putting the choice into effect.
//
// How the pieces fit together:
// - index.html has a tiny script that runs BEFORE the page is drawn. It
//   does the same thing as applyTheme() below, so the page never flashes
//   the wrong colors while the rest of the site loads.
// - ThemeProvider.jsx (in components/) wraps the whole app (see main.jsx).
//   It keeps track of the choice and shares it with every page.
// - Any component can call useTheme() (below) to read the choice or change it.
//   ThemeToggle.jsx, the sun/moon button in the top bars, does that.
// - index.css has two sets of colors, one under :root[data-theme="light"]
//   and one under :root[data-theme="dark"]. applyTheme() picks the set.

// createContext makes a "context": a way to share one value with every
// component inside it, without passing it through every component by hand.
// useContext reads that shared value.
import { createContext, useContext } from 'react';

// The name the choice is saved under in localStorage (the small storage
// space each website gets in the browser)
export const themeStorageKey = 'scoutsearch-theme';

// The computer's own light/dark setting, as a "media query"
const darkQuery = '(prefers-color-scheme: dark)';

// Reads the saved choice. Only Light and Dark are ever saved: if nothing
// is saved, the choice is System (follow the computer).
// try/catch: some private windows block localStorage. Then it's System
export function loadThemeChoice() {
    try {
        const saved = localStorage.getItem(themeStorageKey);
        if (saved === 'light' || saved === 'dark') return saved;
    } catch {
        // Reading is blocked. Fall through to System
    }
    return 'system';
}

// Saves the choice, so it's still there after a reload and on every page.
// Picking System removes the saved choice, so a later change on the
// computer is followed again
export function saveThemeChoice(choice) {
    try {
        if (choice === 'system') {
            localStorage.removeItem(themeStorageKey);
        } else {
            localStorage.setItem(themeStorageKey, choice);
        }
    } catch {
        // Saving is blocked. The choice still works until the tab is closed
    }
}

// 'dark' if the computer is in dark mode right now, otherwise 'light'
export function systemTheme() {
    return window.matchMedia(darkQuery).matches ? 'dark' : 'light';
}

// Calls callback('dark') or callback('light') every time the computer
// switches between light and dark mode, with no reload.
// It gives back a function that stops listening (useEffect uses that to clean up)
export function watchSystemTheme(callback) {
    const media = window.matchMedia(darkQuery);
    function handleChange(event) {
        callback(event.matches ? 'dark' : 'light');
    }
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
}

// Puts 'light' or 'dark' into effect by writing it onto the <html> tag:
// data-theme picks the color set in index.css, and color-scheme tells the
// browser to draw its own parts (scrollbars, form boxes) to match
export function applyTheme(resolvedTheme) {
    const html = document.documentElement;
    html.dataset.theme = resolvedTheme;
    html.style.colorScheme = resolvedTheme;
}

// The shared value. ThemeProvider.jsx fills it with
// { theme, resolvedTheme, setTheme }
export const ThemeContext = createContext(null);

// Lets any component use the theme:
//   const { theme, resolvedTheme, setTheme } = useTheme();
// - theme is what the person picked: 'light', 'dark', or 'system'
// - resolvedTheme is what's actually showing: always 'light' or 'dark'
//   (when theme is 'system', it's whatever the computer is set to)
// - setTheme('dark') changes it
export function useTheme() {
    const value = useContext(ThemeContext);
    // A clear message if a component is used outside ThemeProvider by mistake
    if (!value) {
        throw new Error('useTheme() only works inside <ThemeProvider> (see main.jsx)');
    }
    return value;
}
