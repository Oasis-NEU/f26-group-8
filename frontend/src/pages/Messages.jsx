// NavBar is the bar across the top of the page. It lives in its own file
// (components/NavBar.jsx) because the Feed page uses it too.
import NavBar from '../components/NavBar.jsx';

function Messages() {
    return (
        <>
            {/* <title> is the name shown on the browser tab (WCAG) */}
            <title>Messages | ScoutSearch</title>
            <NavBar />
            <main>
                <h1>Messages</h1>
            </main>
        </>
    );
}

export default Messages;