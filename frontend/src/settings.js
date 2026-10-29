// settings.js remembers the choices made on the Settings page (colors,
// fonts, privacy, accessibility) and puts them into effect on every page.
//
// How it works:
// - The choices are saved in the browser's "localStorage", a small storage
//   space each website gets. So they're still there after a reload. (They're
//   only saved in this browser for now. Once the site has a backend, they
//   should be saved to your account instead, so they follow you everywhere.)
// - applySettings() writes each choice onto the page's <html> tag, like
//   <html data-palette="mint" data-font="readable">. index.css has rules
//   for each one (under "Settings: site-wide choices"), so the whole site changes.
// - main.jsx runs applySettings() once when the site opens, and the
//   Settings page runs it again every time something is changed.
// - Light / Dark / System is NOT in here. It has its own file (theme.js),
//   because the sun/moon button in every top bar changes it too.

// The name the choices are saved under in localStorage
const storageKey = 'scoutsearch-settings';

// What every choice starts as, before anyone changes it
export const defaultSettings = {
    // Appearance
    palette: 'blue',            // the site's colors: 'blue', 'mint', or 'lavender'
                                // (this used to be called "theme"; light and dark are in theme.js)
    headings: 'classic',        // heading style: 'classic' or 'sign' (the road-sign font)

    // Privacy & data
    profileVisibility: 'everyone', // who can see your profile: 'everyone', 'members', or 'connections'
    shareEmail: false,          // show your email on your profile
    shareSchool: true,          // show your school
    shareConnections: true,     // show how many connections you have
    shareProfileViews: false,   // show how many people viewed your profile
    shareResume: true,          // let job listers see your resume
    allowMessages: true,        // let job listers message you

    // Accessibility
    font: 'default',            // 'default', 'readable' (Atkinson Hyperlegible), or 'wide' (Verdana)
    textSize: 100,              // how big the text is, in percent: 100 (normal) up to 150
    highContrast: false,        // darker text and lines
    textSpacing: false,         // more space between lines, letters, and words
    underlineLinks: false,      // underline every link
    reduceMotion: false,        // turn off animations
    strongFocus: false,         // a thicker keyboard outline
};

// Reads the saved choices. Anything that was never saved uses the default.
// "try/catch" means: if reading fails (some private windows block
// localStorage, or the saved text got broken), just use the defaults
export function loadSettings() {
    try {
        const saved = JSON.parse(localStorage.getItem(storageKey));
        // "...": copy everything from defaultSettings, then everything saved on top
        const settings = { ...defaultSettings, ...saved };
        // The colors used to be saved as "theme". Anyone who picked Mint or
        // Lavender before keeps it under the new name
        if (saved && saved.theme && !saved.palette) {
            settings.palette = saved.theme;
        }
        delete settings.theme;
        // The text size used to be saved as a word ('normal', 'large', 'larger').
        // The slider needs a number, so anyone who picked a word before gets
        // the matching number instead
        const oldSizes = { normal: 100, large: 112, larger: 125 };
        if (typeof settings.textSize !== 'number') {
            settings.textSize = oldSizes[settings.textSize] || 100;
        }
        return settings;
    } catch {
        return { ...defaultSettings };
    }
}

// Saves the choices, so they're still there next time
export function saveSettings(settings) {
    try {
        // localStorage can only hold text, so JSON.stringify turns the choices into text
        localStorage.setItem(storageKey, JSON.stringify(settings));
    } catch {
        // If saving is blocked, the choices still work until the page is closed
    }
}

// Puts the choices into effect by writing them onto the <html> tag.
// dataset.textSpacing = 'on' becomes data-text-spacing="on" in the HTML.
// On/off choices are written as "on" or "off"
export function applySettings(settings) {
    const html = document.documentElement;
    html.dataset.palette = settings.palette;
    html.dataset.headings = settings.headings;
    html.dataset.font = settings.font;
    // The text size is a number, so it goes in a CSS variable instead:
    // 125 becomes --text-zoom: 1.25, which index.css uses to zoom the page
    html.style.setProperty('--text-zoom', settings.textSize / 100);
    html.dataset.highContrast = settings.highContrast ? 'on' : 'off';
    html.dataset.textSpacing = settings.textSpacing ? 'on' : 'off';
    html.dataset.underlineLinks = settings.underlineLinks ? 'on' : 'off';
    html.dataset.reduceMotion = settings.reduceMotion ? 'on' : 'off';
    html.dataset.strongFocus = settings.strongFocus ? 'on' : 'off';
    // The privacy choices aren't written here: they don't change how the
    // site looks. Later, the backend would use them to decide what others see
}

// True when animations should be skipped: either the computer's own
// "reduce motion" setting is on, or it was turned on in our Settings page.
// TextType and SmoothLink use this (WCAG)
export function wantsReducedMotion() {
    return (
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        document.documentElement.dataset.reduceMotion === 'on'
    );
}
