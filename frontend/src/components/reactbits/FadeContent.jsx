// FadeContent.jsx: a box that fades in and rises into place the first time
// you scroll down to it.
// Based on "Fade Content" from React Bits (reactbits.dev, by David Haz,
// MIT + Commons Clause license), simplified for ScoutSearch: React Bits'
// version needs the GSAP package, which this project doesn't have, so this
// one uses the browser's built-in IntersectionObserver instead. The fade
// itself is in index.css (under "React Bits effects").
//
// How to use it (in place of a <div>):
//   <FadeContent className="about-inner">...</FadeContent>
// "className" gives the box its normal look.

// useState remembers whether the box has been seen yet.
// useRef keeps a reference to the box on the screen, so the code can watch it.
// useEffect runs code after the box is on the screen.
import { useEffect, useRef, useState } from "react";

function FadeContent(props) {
    // false until the box scrolls into view, then true for good
    const [shown, setShown] = useState(false);

    // The box on the screen (filled in by ref={box} below)
    const box = useRef(null);

    // Runs once, after the box first appears on the page
    useEffect(() => {
        // An IntersectionObserver tells us when the box scrolls into view.
        // rootMargin "25%" at the bottom starts the fade a little BEFORE the box
        // reaches the screen, so people scrolling quickly never land on a
        // blank area waiting for it
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setShown(true);
                    // It only fades in once, so stop watching
                    observer.disconnect();
                }
            },
            { rootMargin: "0px 0px 25% 0px" }
        );
        observer.observe(box.current);

        // "Clean up": stop watching if the page closes before it's seen
        return () => observer.disconnect();
    }, []);

    return (
        // "fade-in-box-shown" is only added once the box has been seen.
        // index.css only hides the box for people who allow motion, so with
        // "reduce motion" turned on, everything is simply there (WCAG)
        <div ref={box} className={"fade-in-box " + (shown ? "fade-in-box-shown " : "") + props.className}>
            {props.children}
        </div>
    );
}

// Lets other files import FadeContent (About.jsx does this).
export default FadeContent;
