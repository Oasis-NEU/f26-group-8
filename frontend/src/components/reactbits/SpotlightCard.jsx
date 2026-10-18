// SpotlightCard.jsx: a box with a soft glow that follows the mouse around
// inside it, like a flashlight.
// Based on "Spotlight Card" from React Bits (reactbits.dev, by David Haz,
// MIT + Commons Clause license), simplified for ScoutSearch: the glow's look
// is in index.css (under "React Bits effects"), and this file only tells the
// CSS where the mouse is.
//
// How to use it:
//   <SpotlightCard className="about-audience">...</SpotlightCard>
// "className" gives the box its normal look (color, padding, corners).

function SpotlightCard(props) {
    // Runs every time the mouse moves inside the box.
    // event.currentTarget is the box itself. getBoundingClientRect() says
    // where the box is on the screen, so subtracting its left/top edge gives
    // the mouse's position INSIDE the box.
    // setProperty saves that position as two CSS variables (--spot-x and
    // --spot-y), and index.css centers the glow on them.
    function handleMouseMove(event) {
        const box = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty("--spot-x", (event.clientX - box.left) + "px");
        event.currentTarget.style.setProperty("--spot-y", (event.clientY - box.top) + "px");
    }

    return (
        // The glow is only decoration (it doesn't show anything new), so
        // keyboard and screen reader users don't miss anything without it
        <div className={"spotlight-box " + props.className} onMouseMove={handleMouseMove}>
            {props.children}
        </div>
    );
}

// Lets other files import SpotlightCard (About.jsx does this).
export default SpotlightCard;
