// ClickSpark.jsx: little lines that burst out from wherever you click,
// like sparks.
// Based on "Click Spark" from React Bits (reactbits.dev, by David Haz,
// MIT + Commons Clause license), simplified for ScoutSearch:
// - it draws on one see-through layer over the screen, so it doesn't need
//   to wrap the page
// - it only draws while sparks are flying, instead of all the time
// - it skips sparks for people who turned on "reduce motion" (WCAG)
// The spark color is --spark-color in index.css.
//
// How to use it: put <ClickSpark /> anywhere on a page.

// useRef keeps a reference to the drawing area on the screen.
// useEffect runs code after it's on the screen.
import { useEffect, useRef } from "react";

// How the sparks look. Change these numbers to change the burst
const SPARK_COUNT = 8;      // how many lines in each burst
const SPARK_LENGTH = 12;    // how long each line starts, in pixels
const SPARK_DISTANCE = 22;  // how far the lines fly out, in pixels
const SPARK_TIME = 400;     // how long a burst lasts, in milliseconds

function ClickSpark() {
    // The <canvas> below. A canvas is an area the code can draw on
    const canvasRef = useRef(null);

    // Runs once, after the canvas first appears on the page
    useEffect(() => {
        const canvas = canvasRef.current;
        // "context" is the pen we draw with
        const context = canvas.getContext("2d");

        // Every spark that's flying right now
        let sparks = [];
        // The next drawing step, or null when nothing is being drawn
        let frame = null;

        // Makes the canvas's drawing area match its size on the screen
        // (clientWidth and clientHeight; index.css stretches it over the
        // window). devicePixelRatio is how many real pixels a screen packs
        // into one CSS pixel (2 on most phones), so the lines stay sharp
        // instead of blurry
        function resize() {
            const ratio = window.devicePixelRatio || 1;
            canvas.width = canvas.clientWidth * ratio;
            canvas.height = canvas.clientHeight * ratio;
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
        }

        // Draws one frame of the animation. The browser calls it about 60
        // times a second (through requestAnimationFrame) while sparks are flying.
        // "now" is the time in milliseconds
        function draw(now) {
            // Wipe the last frame
            context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

            // Throw away sparks that are done
            sparks = sparks.filter((spark) => now - spark.start < SPARK_TIME);

            for (const spark of sparks) {
                // How far along this spark is, from 0 (just clicked) to 1 (done)
                const progress = Math.max(0, (now - spark.start) / SPARK_TIME);
                // "Ease out": fast at first, then slowing down
                const eased = progress * (2 - progress);
                // The line moves outward and gets shorter as it goes
                const distance = eased * SPARK_DISTANCE;
                const length = SPARK_LENGTH * (1 - eased);

                // The line's two ends, worked out with a bit of trigonometry:
                // cos and sin turn the spark's angle into a direction
                const x1 = spark.x + distance * Math.cos(spark.angle);
                const y1 = spark.y + distance * Math.sin(spark.angle);
                const x2 = spark.x + (distance + length) * Math.cos(spark.angle);
                const y2 = spark.y + (distance + length) * Math.sin(spark.angle);

                context.strokeStyle = spark.color;
                context.lineWidth = 2;
                context.lineCap = "round";
                context.beginPath();
                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
                context.stroke();
            }

            // Keep going while there are sparks; stop when there aren't
            frame = sparks.length > 0 ? requestAnimationFrame(draw) : null;
        }

        // Runs on every click anywhere on the page
        function handleClick(event) {
            // detail is 0 when the "click" came from the keyboard (Enter on a
            // link). Those have no mouse position, so skip them
            if (event.detail === 0) return;
            // No sparks for people who turned on "reduce motion" (WCAG)
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

            // Reads the spark color from index.css, so it stays with the site's colors
            const color = getComputedStyle(canvas).getPropertyValue("--spark-color").trim();
            const start = performance.now();

            // One spark per direction, spread evenly around a circle
            // (Math.PI * 2 is a full circle)
            for (let i = 0; i < SPARK_COUNT; i++) {
                sparks.push({
                    x: event.clientX,
                    y: event.clientY,
                    angle: (Math.PI * 2 * i) / SPARK_COUNT,
                    start: start,
                    color: color,
                });
            }

            // Start drawing, unless it's already running
            if (frame === null) frame = requestAnimationFrame(draw);
        }

        resize();
        window.addEventListener("resize", resize);
        window.addEventListener("click", handleClick);

        // "Clean up" when the page closes: stop listening and stop drawing
        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("click", handleClick);
            if (frame !== null) cancelAnimationFrame(frame);
        };
    }, []);

    return (
        // Decoration only, so screen readers skip it (WCAG)
        <canvas ref={canvasRef} className="click-spark-canvas" aria-hidden="true"></canvas>
    );
}

// Lets other files import ClickSpark (About.jsx does this).
export default ClickSpark;
