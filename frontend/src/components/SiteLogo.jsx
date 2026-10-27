// SiteLogo.jsx is the ScoutSearch logo: the binoculars picture and the name,
// with "Scout" in blue and "Search" in navy.
// The picture uses the site's colors from :root in index.css: a navy
// square (--text), sky-blue lenses (--accent), and blue-white lines (--card).
// An SVG file can't read those variables, so if the site's colors change,
// change them in assets/scoutsearch-icon.svg (and public/favicon.svg) too.
// It's used in every top bar (About, Login, Signup, and NavBar.jsx) and in
// the About page's footer, so a change here shows up in all of them.
// It's only the picture and the name. Each page wraps it in its own link,
// because the logo goes somewhere different on different pages.
// The styles are in index.css, under "Site logo".

// useState lets the logo remember a value. useEffect runs a bit of code
// after the logo shows up on the screen.
import { useEffect, useState } from "react";
// The binoculars picture. Importing it gives back its web address, which
// goes in <img src>. (The same picture is the favicon on the browser tab)
import binoculars from "../assets/scoutsearch-icon.svg";

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
      {/* alt="" because the name is right next to it, so screen readers
          would just say "ScoutSearch" twice (WCAG). width and height save
          its space before the picture loads, so nothing jumps around */}
      <img className="site-logo-icon" src={binoculars} alt="" width="36" height="36" />
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
