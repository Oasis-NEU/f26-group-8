// SiteLogo.jsx is the ScoutSearch logo: the binoculars picture and the name,
// with "Scout" in blue and "Search" in the text color.
// The picture is drawn right here (not loaded from a file), so its colors
// can come from index.css: --logo-tile (the square), --logo-lens (the
// lenses), and --logo-line (the outlines). That's how it changes with light
// and dark mode: in dark mode the square is a lighter blue, so it doesn't
// disappear into the dark page. (public/favicon.svg is the same drawing for
// the browser tab, with its colors written in, since a tab can't read them)
// It's used in every top bar (About, Login, Signup, and NavBar.jsx) and in
// the About page's footer, so a change here shows up in all of them.
// It's only the picture and the name. Each page wraps it in its own link,
// because the logo goes somewhere different on different pages.
// The styles are in index.css, under "Site logo".

// useState lets the logo remember a value. useEffect runs a bit of code
// after the logo shows up on the screen.
import { useEffect, useState } from "react";

// The binoculars picture. Each shape has a class instead of a color, and
// index.css gives each class its color ("Site logo"). viewBox is the
// drawing's own grid (160 by 160); CSS sets how big it shows up
function Binoculars() {
  return (
    // aria-hidden: the name is right next to it, so screen readers would
    // just say "ScoutSearch" twice (WCAG). width and height save its space
    // until the styles load, so nothing jumps around
    <svg className="site-logo-icon" viewBox="0 0 160 160" width="36" height="36" aria-hidden="true" focusable="false">
      {/* The rounded square behind everything */}
      <rect className="site-logo-tile" width="160" height="160" rx="36" />
      {/* The handle, the two side arms, and the bridge between the lenses */}
      <g className="site-logo-lines" fill="none" strokeLinecap="round">
        <line x1="128" y1="96" x2="142" y2="120" strokeWidth="14" />
        <line x1="26" y1="70" x2="12" y2="64" strokeWidth="8" />
        <line x1="134" y1="70" x2="148" y2="64" strokeWidth="8" />
        <path d="M74 66 Q80 56 86 66" strokeWidth="8" />
      </g>
      {/* The two lenses */}
      <circle className="site-logo-lens" cx="50" cy="74" r="22" />
      <circle className="site-logo-lens" cx="110" cy="74" r="22" />
      {/* The rims around the lenses, and the little shine on each */}
      <g className="site-logo-lines" fill="none">
        <circle cx="50" cy="74" r="24" strokeWidth="9" />
        <circle cx="110" cy="74" r="24" strokeWidth="9" />
        <path d="M38 68 Q42 60 50 58" strokeWidth="4" strokeLinecap="round" />
        <path d="M98 68 Q102 60 110 58" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function SiteLogo() {
  // "playIntro" is true only for the first page you open in this browser tab,
  // the same way the Feed title's intro works (see FeedHeader in Feed.jsx).
  // Every page has its own top bar, so without this the logo would fade in
  // again every time you click to another page, which gets distracting.
  // sessionStorage is a small notebook the browser keeps until you close the tab.
  // try/catch: in some private windows the notebook is turned off, and reading
  // it causes an error. If that happens, just skip the fade
  const [playIntro] = useState(() => {
    try {
      return sessionStorage.getItem("logo-intro-played") === null;
    } catch {
      return false;
    }
  });

  // After the logo shows up, write in the notebook that the fade played
  useEffect(() => {
    try {
      sessionStorage.setItem("logo-intro-played", "yes");
    } catch {
      // The notebook is turned off. Nothing to do
    }
  }, []);

  return (
    // "site-logo-intro" is what turns the fade on (see "Site logo" in index.css)
    <span className={playIntro ? "site-logo site-logo-intro" : "site-logo"}>
      <Binoculars />
      {/* The name is real text, not part of the picture, so it stays sharp
          at any size and screen readers can read it */}
      <span className="site-logo-name">
        <span className="site-logo-scout">Scout</span>Search
      </span>
    </span>
  );
}

// "export default" lets other files import SiteLogo
export default SiteLogo;
