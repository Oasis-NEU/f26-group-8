// StarBorder.jsx: a link with two small lights that travel along its top
// and bottom edges, like stars.
// Based on "Star Border" from React Bits (reactbits.dev, by David Haz,
// MIT + Commons Clause license), simplified for ScoutSearch: it's always a
// <Link> to another page of our site, and all of its styles live in index.css
// (under "React Bits effects") instead of in the file.
//
// How to use it:
//   <StarBorder to="/signup" className="about-button">Sign up</StarBorder>
// "to" is the page to go to. "className" styles the button inside the lights.

// Link makes a clickable link to another page of OUR site (like /signup).
import { Link } from "react-router";

function StarBorder(props) {
    return (
        // The outer link. Its 2px of padding is the thin ring the lights shine through
        <Link to={props.to} className="star-border">
            {/* The two lights: one runs along the bottom edge, one along the top.
                They're decoration, so screen readers skip them (WCAG) */}
            <span className="star-border-light-bottom" aria-hidden="true"></span>
            <span className="star-border-light-top" aria-hidden="true"></span>

            {/* The button itself, drawn on top of the lights so they only show
                around its edge */}
            <span className={"star-border-face " + props.className}>{props.children}</span>
        </Link>
    );
}

// Lets other files import StarBorder (About.jsx does this).
export default StarBorder;
