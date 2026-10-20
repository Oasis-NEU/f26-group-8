// TextType.jsx: a line of text that types itself out, one letter at a time,
// then erases and types the next word, like someone typing live.
// Based on "Text Type" from React Bits (reactbits.dev, by David Haz,
// MIT + Commons Clause license), simplified for ScoutSearch:
// - it doesn't use the "gsap" package. A new npm package changes
//   package.json for everyone, so the blinking bar is plain CSS instead,
//   and the typing is done with timers
// - it only has the options the site needs (see the list below)
// - it types through the words once and stops on the last one, instead of
//   looping forever. WCAG 2.2.2 says text that keeps changing on its own for
//   more than 5 seconds needs a way to pause it, and stopping is simpler
// - for people who turned on "reduce motion", it doesn't type at all: it
//   just shows all the words at once (WCAG)
// - screen readers get the whole sentence at once, not letter by letter
// The styles are in index.css, under "React Bits effects" (Text Type).
//
// How to use it:
//   <TextType
//       as="p"                                  the tag to draw (p, span, ...)
//       prefix="Join now to find"               words that stay in place
//       words={["internships", "co-ops"]}       the words typed one after another
//       typingSpeed={70}                        wait between typed letters, in ms
//       deletingSpeed={40}                      wait between erased letters, in ms
//       pauseDuration={1400}                    how long a finished word stays, in ms
//       loop={false}                            true = start over after the last word
//   />

// useState remembers a value and redraws when it changes.
// useEffect runs code after the page is drawn (here: the typing timers).
import { useEffect, useState } from "react";
// wantsReducedMotion: true when the visitor turned on "reduce motion", either
// in their computer's settings or on our Settings page (see settings.js)
import { wantsReducedMotion } from "../../settings.js";

function TextType(props) {
    // The tag to draw. "p" if none was given
    const Tag = props.as || "p";
    const words = props.words;
    const typingSpeed = props.typingSpeed || 70;
    const deletingSpeed = props.deletingSpeed || 40;
    const pauseDuration = props.pauseDuration || 1400;
    const loop = props.loop || false;

    // Read once: reduce motion on or off
    const [reduceMotion] = useState(wantsReducedMotion);

    // Which word is being typed (0 = the first one)
    const [wordIndex, setWordIndex] = useState(0);
    // How many letters of that word are showing
    const [count, setCount] = useState(0);
    // true while the word is being erased
    const [erasing, setErasing] = useState(false);

    // Runs after every change above. Each run schedules exactly one next
    // step (type a letter, erase a letter, or move to the next word), and
    // the clean-up at the bottom cancels it if something changes first.
    useEffect(() => {
        // No typing for "reduce motion": the words are just shown (see below)
        if (reduceMotion) return;

        const word = words[wordIndex];
        const isLast = wordIndex === words.length - 1;
        let timer;

        if (!erasing) {
            if (count < word.length) {
                // Type the next letter
                timer = setTimeout(() => setCount(count + 1), typingSpeed);
            } else if (loop || !isLast) {
                // The word is finished. Let it be read, then start erasing it.
                // (The last word is left alone, so the typing stops there)
                timer = setTimeout(() => setErasing(true), pauseDuration);
            }
        } else if (count > 0) {
            // Erase the last letter
            timer = setTimeout(() => setCount(count - 1), deletingSpeed);
        } else {
            // Nothing left: a short beat, then the next word starts
            timer = setTimeout(() => {
                setErasing(false);
                setWordIndex((wordIndex + 1) % words.length);
            }, 250);
        }

        // Cancels the timer if the page is left, or something changes first
        return () => clearTimeout(timer);
    }, [reduceMotion, words, wordIndex, count, erasing, typingSpeed, deletingSpeed, pauseDuration, loop]);

    // What's showing right now. With "reduce motion" that's all the words at
    // once; otherwise it's the typed part of the current word
    const shown = reduceMotion
        ? words.join(", ")
        : words[wordIndex].slice(0, count);

    return (
        <Tag className={"text-type " + (props.className || "")}>
            {/* The whole sentence, hidden on screen ("sr-only") but read out by
                screen readers right away, instead of letter by letter (WCAG) */}
            <span className="sr-only">{props.prefix} {words.join(", ")}</span>

            {/* The part people see. aria-hidden hides it from screen readers,
                because they already heard the sentence above */}
            <span aria-hidden="true">
                {/* The words that stay in place */}
                <span className="text-type-prefix">{props.prefix}</span>
                {/* The typed words, and the blinking bar after them. The bar is
                    left out for "reduce motion", since nothing is typing */}
                <span className="text-type-line">
                    {shown}
                    {!reduceMotion && <span className="text-type-cursor"></span>}
                </span>
            </span>
        </Tag>
    );
}

// Lets other files import TextType (Signup.jsx does this).
export default TextType;
