// Network.jsx is the My Network page (yoursite.com/network).
// It has 3 boxes: Requests (people who asked to connect with you),
// People You May Know, and Groups.
// Everything on it is made-up sample data for now, because the site isn't
// connected to the backend yet. Clicking the buttons only changes what you
// see, and it all goes back to the start when the page is refreshed.
// The styles for this page are in index.css, under "Network page".

// useState lets the page remember a value and redraw itself when it changes.
// useRef keeps a reference to something on the screen (here: the Requests
// title), so the code can move the keyboard focus to it.
import { useRef, useState } from 'react';
// NavBar is the bar across the top of the page. It lives in its own file
// (components/NavBar.jsx) because the Feed page uses it too.
import NavBar from '../components/NavBar.jsx';

// ---------- Sample data ----------
// Later, this data would come from the backend instead.

// People who asked to connect with you (the Requests box). These people are
// made up, which is why the box has an "Examples" tag
const connectionRequests = [
    { id: 1, name: "Maya Chen", initials: "MC", headline: "Junior @ Boston Latin School" },
    { id: 2, name: "Diego Ramirez", initials: "DR", headline: "Co-op Student @ Northeastern University" },
    { id: 3, name: "Priya Nair", initials: "PN", headline: "Research Assistant @ Tufts University" },
];

// sample data for the people you may know section since theres no backend yet.
const suggestedPeople = [
    { id: 1, name: "Jayden Gajewski", initials: "JG", headline: "Student @ Northeastern University" },
    { id: 2, name: "Kevin Liu", initials: "KL", headline: "Student @ Northeastern University" },
    { id: 3, name: "Anthony Dorsey", initials: "AD", headline: "Student @ Northeastern University" },
    { id: 4, name: "Shlok Patel", initials: "SP", headline: "Oasis Mentor @ Northeastern University" },
    { id: 5, name: "Ekkam Singh", initials: "ES", headline: "Student @ Northeastern University" },
];

// Groups you could join (the Groups box). The groups and their member
// counts are made up, which is why the box has an "Examples" tag
const suggestedGroups = [
    { id: 1, name: "Northeastern Co-op Seekers", initials: "NC", members: 1284 },
    { id: 2, name: "High School Coders of Boston", initials: "HC", members: 412 },
    { id: 3, name: "Research Opportunities Club", initials: "RO", members: 638 },
    { id: 4, name: "First-Gen Job Hunters", initials: "FG", members: 297 },
];

// ---------- Pieces of the page ----------
// Each function below is one piece of the page.

// One request in the Requests box: the person, then Accept and Ignore.
// "props" holds the info passed in by Network below. props.onAnswer is a
// function from Network: calling it with true means Accept, false means Ignore
function RequestRow(props) {
    return (
        <li className="network-request">
            {/* The circle with their initials. The name is right next to it,
                so screen readers skip the circle (WCAG) */}
            <div className="feed-post-avatar" aria-hidden="true">{props.person.initials}</div>
            <div className="network-request-text">
                <p className="network-request-name">{props.person.name}</p>
                <p className="network-request-headline">{props.person.headline}</p>
            </div>
            <div className="network-request-buttons">
                {/* Every request has the same two buttons, so aria-label adds the
                    person's name. It starts with the word you see ("Accept"), so
                    voice control users can still say "click Accept" (WCAG) */}
                <button
                    type="button"
                    className="network-accept-button"
                    aria-label={"Accept " + props.person.name}
                    onClick={() => props.onAnswer(true)}
                >
                    Accept
                </button>
                <button
                    type="button"
                    className="network-ignore-button"
                    aria-label={"Ignore " + props.person.name}
                    onClick={() => props.onAnswer(false)}
                >
                    Ignore
                </button>
            </div>
        </li>
    );
}

// One person in People You May Know, with a Connect button that works like
// the Feed's Like button
function PersonBox(props) {
    // "sent" remembers whether you clicked Connect. It starts as false.
    // Each person gets their own "sent", so connecting with one person
    // doesn't change the others
    const [sent, setSent] = useState(false);

    return (
        <li className="network-person">
            <div className="feed-post-avatar" aria-hidden="true">{props.person.initials}</div>
            <p className="network-person-name">{props.person.name}</p>
            <p className="network-person-headline">{props.person.headline}</p>
            {/* "sent ? A : B" means: if sent is true, use A. Otherwise, use B.
                Clicking flips "sent" ("!" means "the opposite of"), so clicking
                Pending takes the request back.
                aria-pressed tells screen readers whether it's on (WCAG), and
                aria-label adds the person's name, starting with the word you see */}
            <button
                type="button"
                className={sent ? "network-connect-button network-connect-button-on" : "network-connect-button"}
                aria-pressed={sent}
                aria-label={sent ? "Pending: request sent to " + props.person.name : "Connect with " + props.person.name}
                onClick={() => setSent(!sent)}
            >
                {sent ? "Pending" : "Connect"}
            </button>
        </li>
    );
}

// One group in the Groups box, with a Join button.
// It uses the same look as Connect, and the same on/off idea
function GroupRow(props) {
    // "joined" remembers whether you clicked Join. It starts as false
    const [joined, setJoined] = useState(false);

    // Joining adds you to the member count, so it goes up by 1 while you're in.
    // toLocaleString() adds the commas (1284 becomes "1,284")
    const members = props.group.members + (joined ? 1 : 0);

    return (
        <li className="network-group">
            {/* The group's square with its letters. Its name is right next
                to it, so screen readers skip the square (WCAG) */}
            <div className="network-group-square" aria-hidden="true">{props.group.initials}</div>
            <div className="network-group-text">
                <p className="network-group-name">{props.group.name}</p>
                <p className="network-group-members">{members.toLocaleString()} members</p>
            </div>
            <button
                type="button"
                className={joined ? "network-connect-button network-connect-button-on" : "network-connect-button"}
                aria-pressed={joined}
                aria-label={joined ? "Joined " + props.group.name : "Join " + props.group.name}
                onClick={() => setJoined(!joined)}
            >
                {joined ? "Joined" : "Join"}
            </button>
        </li>
    );
}

// Network is the whole page. It puts the pieces above together.
function Network() {
    // The requests still waiting for an answer. It starts as the whole sample
    // list. Accepting or ignoring someone takes them out of it
    const [requests, setRequests] = useState(connectionRequests);

    // The note at the top of the Requests box after you answer someone
    // ("You're now connected with ..."). It starts empty ('')
    const [requestNote, setRequestNote] = useState('');

    // The Requests title, so the keyboard focus can move there (see answerRequest)
    const requestsTitle = useRef(null);

    // Runs when Accept or Ignore is clicked. "person" is who it was for, and
    // "accepted" is true for Accept and false for Ignore
    function answerRequest(person, accepted) {
        // .filter() makes a new list with everyone except this person
        setRequests(requests.filter((request) => request.id !== person.id));

        // The note says what happened. It's in a role="status" box (below),
        // so screen readers read it out loud (WCAG)
        if (accepted) {
            setRequestNote(`You're now connected with ${person.name}.`);
        } else {
            setRequestNote(`You ignored ${person.name}'s request.`);
        }

        // The button you clicked disappears along with the request. Without
        // this, keyboard users would be dropped back at the top of the page,
        // so the focus moves to the Requests title instead (WCAG)
        requestsTitle.current.focus();
    }

    return (
        <>
            {/* <title> is the name shown on the browser tab (WCAG) */}
            <title>My Network | ScoutSearch</title>
            <NavBar />
            {/* "network-page" splits the page into the 2 columns*/}
            <main className="network-page">
                <h1 className="sr-only">My Network</h1>

                <div className="network-main">
                    <section className="network-box">
                        {/* tabIndex={-1} lets the code focus the title (see
                            answerRequest) without adding it to the Tab order.
                            The number in ( ) is how many are left */}
                        <h2 className="network-box-title" ref={requestsTitle} tabIndex={-1}>
                            Requests{requests.length > 0 && ` (${requests.length})`}
                            <span className="network-example-tag">Examples</span>
                        </h2>

                        {/* The note after you answer someone. role="status" makes
                            screen readers read it out loud when it changes (WCAG) */}
                        <p role="status" className="network-note">{requestNote}</p>

                        {/* If there are requests left, list them. If not, say so,
                            so the box is never just blank */}
                        {requests.length > 0 ? (
                            <ul className="network-requests">
                                {requests.map((person) => (
                                    <RequestRow
                                        key={person.id}
                                        person={person}
                                        onAnswer={(accepted) => answerRequest(person, accepted)}
                                    />
                                ))}
                            </ul>
                        ) : (
                            <p className="network-empty">
                                No requests right now. When someone asks to connect with you, they'll show up here.
                            </p>
                        )}
                    </section>
                    <section className="network-box">
                        <h2 className="network-box-title">People You May Know</h2>
                        <ul className="network-people">
                            {suggestedPeople.map((person) => (
                                <PersonBox key={person.id} person={person} />
                            ))}
                        </ul>
                    </section>
                </div>

                <div className="network-side">
                    <section className="network-box">
                        <h2 className="network-box-title">
                            Groups
                            <span className="network-example-tag">Examples</span>
                        </h2>
                        {/* The list is never empty right now, because the sample
                            groups are always there. Once groups come from the
                            backend there might be none, so this message is ready */}
                        {suggestedGroups.length > 0 ? (
                            <ul className="network-groups">
                                {suggestedGroups.map((group) => (
                                    <GroupRow key={group.id} group={group} />
                                ))}
                            </ul>
                        ) : (
                            <p className="network-empty">
                                No groups to show yet. Groups for your school, major, and interests will show up here.
                            </p>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
}

export default Network;
