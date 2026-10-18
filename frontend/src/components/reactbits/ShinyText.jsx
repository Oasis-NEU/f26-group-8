// ShinyText.jsx: words with a band of light that sweeps across them.
// Based on "Shiny Text" from React Bits (reactbits.dev, by David Haz,
// MIT + Commons Clause license), simplified for ScoutSearch: the sweep is
// plain CSS, so this file only puts the words in a <span> with the right class.
// The styles are in index.css, under "React Bits effects".
//
// How to use it:
//   <ShinyText>For high school and college students</ShinyText>

// "props.children" is whatever is written between <ShinyText> and </ShinyText>
function ShinyText(props) {
    return (
        // The words stay real text, so screen readers read them normally
        <span className="shiny-text">{props.children}</span>
    );
}

// Lets other files import ShinyText (About.jsx does this).
export default ShinyText;
