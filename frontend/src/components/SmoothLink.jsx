// SmoothLink.jsx is a <Link> that fades smoothly from one page to the next,
// instead of the new page appearing with a jolt.
// It uses the browser's "View Transitions" feature: the browser takes a
// picture of the page, switches pages, and then fades from the old picture
// to the new page. The top bar stays put during the fade (see "Page
// transitions" in index.css). Browsers without the feature, and people who
// turned on "reduce motion", just get the normal, instant switch (WCAG).
//
// How to use it (exactly like <Link>):
//   <SmoothLink to="/login">Log in</SmoothLink>

// Link makes a clickable link to another page of our site.
// useNavigate lets the code send the user to another page.
import { Link, useNavigate } from "react-router";
// flushSync tells React "draw the new page right now", not a moment later.
// The browser needs the new page to be on the screen by the time its fade starts.
import { flushSync } from "react-dom";
// wantsReducedMotion: true when the visitor turned on "reduce motion", either
// in their computer's settings or on our Settings page (see settings.js)
import { wantsReducedMotion } from "../settings.js";

function SmoothLink(props) {
    const navigate = useNavigate();

    // Runs when the link is clicked
    function handleClick(event) {
        // If the link was given its own onClick, run that first
        if (props.onClick) props.onClick(event);

        // Leave special clicks alone, so "open in a new tab" (Ctrl or Cmd
        // click, middle click) and the like still work normally
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        // No fade for browsers that can't do it, or for "reduce motion"
        if (!document.startViewTransition || wantsReducedMotion()) return;

        // Take over the click: stop the normal link jump, and do it as a fade
        event.preventDefault();
        document.startViewTransition(() => {
            flushSync(() => navigate(props.to));
        });
    }

    // "...props" passes along everything else (to, className, children, ...)
    return <Link {...props} onClick={handleClick} />;
}

// Lets other files import SmoothLink (Signup.jsx and Login.jsx do this).
export default SmoothLink
