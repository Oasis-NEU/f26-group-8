// ThemeToggle.jsx is the round button in the top bar that changes the colors
// between Light, Dark, and System (follow your computer). Its picture shows
// what's picked right now: a sun, a moon, or a screen.
// Clicking it opens a small menu with the three choices, with a check mark
// on the one that's on.
// It's in the About, Log in, and Sign up top bars (just left of Log in), and
// in NavBar.jsx (just left of your circle), so it's on every page.
// The choice itself is kept by ThemeProvider.jsx; this file only shows it
// and changes it, through useTheme() (theme.js).
// The styles are in index.css, under "Top bar: theme menu".
//
// Using it with the keyboard (WCAG):
// - Tab to the button, then Enter, Space, or the Down arrow opens the menu
// - Up and Down arrows move between the choices (Home and End jump to the
//   first and last), Enter or Space picks one
// - Escape closes the menu and goes back to the button; Tab closes it too

// useEffect runs code after drawing. useId makes an id that's unique on
// the page. useRef keeps a reference to something on the screen.
// useState remembers a value and redraws when it changes.
import { useEffect, useId, useRef, useState } from "react";
// useTheme reads and changes the choice. systemTheme says what the computer is set to
import { systemTheme, useTheme } from "../theme.js";

// ---------- The pictures ----------
// Line drawings that use "currentColor", so they're the same color as the
// words around them in both light and dark. They're decoration (the words
// and aria-label say the same thing), so screen readers skip them (WCAG)

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

// A computer screen, for "System" (follow your computer)
function ScreenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="2" y="4" width="20" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

// ---------- The choices ----------
const choices = [
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
  { value: "system", label: "System", Icon: ScreenIcon },
];

// What screen readers hear after a choice is picked
function announcementFor(choice) {
  if (choice === "light") return "Light theme on";
  if (choice === "dark") return "Dark theme on";
  // System also says which one that is right now
  return "System theme on, following your device (" + systemTheme() + " right now)";
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // "open" is true while the menu is showing
  const [open, setOpen] = useState(false);

  // The words in the hidden live region below, read out after a change
  const [announcement, setAnnouncement] = useState("");

  // The wrapper (to tell clicks inside from clicks outside), the button
  // (to put the focus back on it), and each choice (for the arrow keys)
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  const choiceRefs = useRef([]);

  // An id for the menu, so the button can say which part of the page it opens
  const menuId = useId();

  // The choice that's on right now, and its place in the list
  const currentIndex = choices.findIndex((choice) => choice.value === theme);
  const current = choices[currentIndex];

  // When the menu opens, move the focus to the choice that's on, so the
  // arrow keys start from there. While it's open, a click anywhere outside closes it
  useEffect(() => {
    if (!open) return;
    choiceRefs.current[currentIndex].focus();

    function handleClickOutside(event) {
      if (!wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, currentIndex]);

  // Runs when the focus leaves something inside. event.relatedTarget is
  // where the focus went; if that's outside (for example, Tab past the
  // menu), close it
  function handleBlur(event) {
    if (!wrapperRef.current.contains(event.relatedTarget)) {
      setOpen(false);
    }
  }

  // The Down arrow on the button opens the menu too, like other menus (WCAG)
  function handleButtonKeyDown(event) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault(); // stops the arrow from also scrolling the page
      setOpen(true);
    }
  }

  // The keys inside the menu
  function handleMenuKeyDown(event, index) {
    let next = null;
    if (event.key === "ArrowDown") next = (index + 1) % choices.length;
    if (event.key === "ArrowUp") next = (index - 1 + choices.length) % choices.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = choices.length - 1;

    if (next !== null) {
      event.preventDefault();
      choiceRefs.current[next].focus();
    }

    // Escape closes the menu and puts the focus back on the button, so
    // keyboard users don't get lost (WCAG)
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      buttonRef.current.focus();
    }
  }

  // Runs when a choice is picked (clicked, or Enter / Space on it)
  function pick(choice) {
    setTheme(choice);
    setAnnouncement(announcementFor(choice));
    setOpen(false);
    buttonRef.current.focus();
  }

  return (
    <div className="theme-menu" ref={wrapperRef} onBlur={handleBlur}>
      {/* The round button. aria-label is its name for screen readers.
          aria-haspopup and aria-expanded say it opens a menu and whether
          it's open; aria-controls says which part of the page it opens.
          title shows the current choice when the mouse rests on it, and
          screen readers read it after the name (WCAG) */}
      <button
        type="button"
        ref={buttonRef}
        className="theme-menu-button"
        aria-label="Change color theme"
        title={"Theme: " + current.label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(!open)}
        onKeyDown={handleButtonKeyDown}
      >
        <current.Icon />
      </button>

      {/* "open && (...)" means "only draw the menu while it's open".
          role="menu" and role="menuitemradio" tell screen readers it's a
          menu where one choice is on, and aria-checked says which (WCAG) */}
      {open && (
        <div id={menuId} className="theme-menu-list" role="menu" aria-label="Color theme">
          {choices.map((choice, index) => (
            <button
              key={choice.value}
              type="button"
              // Remembers each choice, so the arrow keys can move the focus to it.
              // The { } keep it from giving anything back: in React 19, a
              // value given back from a ref is treated as clean-up code
              ref={(element) => {
                choiceRefs.current[index] = element;
              }}
              className="theme-menu-item"
              role="menuitemradio"
              aria-checked={choice.value === theme}
              // -1: Tab skips the choices (the arrow keys move between them),
              // so one Tab press leaves the menu, like in other menus
              tabIndex={-1}
              onClick={() => pick(choice.value)}
              onKeyDown={(event) => handleMenuKeyDown(event, index)}
            >
              <choice.Icon />
              {choice.label}
              <span className="theme-menu-check">
                <CheckIcon />
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Hidden words that screen readers read out when they change,
          like "Dark theme on" (aria-live="polite" waits until they finish
          what they're saying). It's always on the page, even when empty,
          so screen readers notice the change (WCAG) */}
      <span className="sr-only" aria-live="polite">{announcement}</span>
    </div>
  );
}

// "export default" lets other files import ThemeToggle
export default ThemeToggle;
