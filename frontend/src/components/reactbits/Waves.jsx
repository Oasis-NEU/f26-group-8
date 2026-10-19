// Waves.jsx: thin flowing lines that drift slowly behind the page and bend
// away from the mouse.
// Based on "Waves" from React Bits (reactbits.dev, by David Haz,
// MIT + Commons Clause license), simplified for ScoutSearch:
// - it uses two sine waves instead of the original's noise code, so it
//   needs no extra code or packages
// - it stops drawing while the browser tab is hidden (saves battery)
// - for people who turned on "reduce motion", and on phone-sized screens,
//   it draws one still picture and never moves (WCAG; it also saves battery,
//   and on a small screen the Pause button would cover the page)
// - a "Pause background" button lets anyone stop it. WCAG 2.2.2 says
//   anything that moves on its own for more than 5 seconds needs a way to
//   pause it
// The line color is --wave-color in index.css.
//
// How to use it: put <Waves /> first inside the page's wrapper.

// useEffect runs code after it's on the screen.
// useRef keeps something around between redraws without redrawing the page.
// useState remembers something (here: paused or not) and redraws when it changes.
import { useEffect, useRef, useState } from "react";

// How the waves look. Change these numbers to change the effect
const LINE_GAP = 22;     // space between the up-and-down lines, in pixels
const POINT_GAP = 12;    // space between the points along each line, in pixels
const WAVE_SIZE = 22;    // how far the lines sway left and right, in pixels
const SPEED = 0.00025;   // how fast they drift (bigger = faster). Slow on purpose, so it's calm
const MOUSE_REACH = 170; // how close the mouse has to be to bend the lines, in pixels
const MOUSE_PUSH = 28;   // how far the lines bend away from the mouse, in pixels
const MOUSE_EASE = 0.1;  // how quickly the bend follows the mouse (1 = instantly).
                         // A bit slow on purpose, so it glides instead of jumping

// True when the waves should stay still: the visitor turned on "reduce
// motion" in their settings, or the screen is phone-sized (760px or narrower)
function shouldStayStill() {
    return window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 760px)").matches;
}

function Waves() {
    // The <canvas> below. A canvas is an area the code can draw on
    const canvasRef = useRef(null);

    // Whether the visitor pressed "Pause background"
    const [paused, setPaused] = useState(false);

    // Read once: the button is only shown when the waves can move
    const [stayStill] = useState(shouldStayStill);

    // How long the waves have been moving, in milliseconds. Kept in a ref
    // so pausing and playing continues from the same spot instead of jumping
    const elapsed = useRef(0);

    // Runs after the canvas appears, and again whenever "paused" changes
    useEffect(() => {
        const canvas = canvasRef.current;
        // "context" is the pen we draw with
        const context = canvas.getContext("2d");

        // Where the mouse really is, and where the bend is drawn right now
        // (the bend slides toward the mouse a little each frame).
        // -9999 means "far off the screen", so nothing bends at first
        const target = { x: -9999, y: -9999 };
        const mouse = { x: -9999, y: -9999 };

        // The line color, read from index.css so it stays with the site's colors
        let color = "";

        // The next drawing step, or null when nothing is being drawn
        let frame = null;
        // The time of the last frame, to know how much time passed
        let last = null;

        // Makes the canvas's drawing area match the window, and keeps the
        // lines sharp on screens that pack 2 real pixels into 1 (most phones)
        function resize() {
            const ratio = window.devicePixelRatio || 1;
            canvas.width = canvas.clientWidth * ratio;
            canvas.height = canvas.clientHeight * ratio;
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            color = getComputedStyle(canvas).getPropertyValue("--wave-color").trim();
            drawWaves();
        }

        // Draws every line once, for the current time and mouse position
        function drawWaves() {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            const time = elapsed.current * SPEED;

            // Wipe the last frame
            context.clearRect(0, 0, width, height);
            context.strokeStyle = color;
            context.lineWidth = 1;

            // One line going down the screen every LINE_GAP pixels
            for (let x = -LINE_GAP; x <= width + LINE_GAP; x += LINE_GAP) {
                context.beginPath();

                // Points down the line every POINT_GAP pixels
                for (let y = -POINT_GAP; y <= height + POINT_GAP; y += POINT_GAP) {
                    // How far this point sways. Two sine waves added together,
                    // moving at different speeds, look natural instead of
                    // like one regular wiggle
                    let dx = Math.sin(y * 0.004 + x * 0.002 + time) * WAVE_SIZE
                        + Math.sin(y * 0.011 - x * 0.0015 - time * 1.7) * (WAVE_SIZE / 3);
                    let dy = 0;

                    // If the mouse is close, push the point away from it.
                    // The closer the mouse, the bigger the push
                    const awayX = x + dx - mouse.x;
                    const awayY = y - mouse.y;
                    const distance = Math.hypot(awayX, awayY); // straight-line distance
                    if (distance > 0 && distance < MOUSE_REACH) {
                        const push = (1 - distance / MOUSE_REACH) * MOUSE_PUSH;
                        dx += (awayX / distance) * push;
                        dy += (awayY / distance) * push;
                    }

                    // The first point starts the line; the rest connect to it
                    if (y === -POINT_GAP) context.moveTo(x + dx, y + dy);
                    else context.lineTo(x + dx, y + dy);
                }

                context.stroke();
            }
        }

        // One step of the animation. The browser calls it about 60 times a
        // second (through requestAnimationFrame). "now" is the time in milliseconds
        function step(now) {
            if (last !== null) elapsed.current += now - last;
            last = now;

            // The bend glides toward the mouse instead of jumping to it
            mouse.x += (target.x - mouse.x) * MOUSE_EASE;
            mouse.y += (target.y - mouse.y) * MOUSE_EASE;

            drawWaves();
            frame = requestAnimationFrame(step);
        }

        function start() {
            if (frame === null) {
                last = null;
                frame = requestAnimationFrame(step);
            }
        }

        function stop() {
            if (frame !== null) cancelAnimationFrame(frame);
            frame = null;
        }

        // Remembers where the mouse is. Only real mice: on a phone, a finger
        // tap would make the lines jump
        function handlePointerMove(event) {
            if (event.pointerType !== "mouse") return;
            target.x = event.clientX;
            target.y = event.clientY;
        }

        // Stops drawing while the browser tab is hidden, and starts again after
        function handleVisibility() {
            if (document.hidden) stop();
            else start();
        }

        resize();
        window.addEventListener("resize", resize);

        // Only move when the visitor allows motion and hasn't pressed Pause.
        // Otherwise the still picture drawn by resize() stays on the screen
        const moving = !paused && !shouldStayStill();
        if (moving) {
            window.addEventListener("pointermove", handlePointerMove);
            document.addEventListener("visibilitychange", handleVisibility);
            start();
        }

        // "Clean up" when the page closes or Pause is pressed: stop listening
        // and stop drawing
        return () => {
            stop();
            window.removeEventListener("resize", resize);
            window.removeEventListener("pointermove", handlePointerMove);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [paused]);

    return (
        <>
            {/* The lines. Decoration only, so screen readers skip it (WCAG) */}
            <canvas ref={canvasRef} className="waves-canvas" aria-hidden="true"></canvas>

            {/* The Pause / Play button (WCAG 2.2.2). Not shown when the waves
                stay still (reduce motion, or a phone), because then nothing moves */}
            {!stayStill && (
                <button type="button" className="waves-pause" onClick={() => setPaused(!paused)}>
                    {paused ? "Play background" : "Pause background"}
                </button>
            )}
        </>
    );
}

// Lets other files import Waves (About.jsx does this).
export default Waves;
