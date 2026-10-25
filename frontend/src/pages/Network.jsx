// NavBar is the bar across the top of the page. It lives in its own file
// (components/NavBar.jsx) because the Feed page uses it too.
import NavBar from '../components/NavBar.jsx';

// sample data for the people you may know section since theres no backend yet. 
const suggestedPeople = [
    { id: 1, name: "Jayden Gajewski", initials: "JG", headline: "Student @ Northeastern University" },
    { id: 2, name: "Kevin Liu", initials: "KL", headline: "Student @ Northeastern University" },
    { id: 3, name: "Anthony Dorsey", initials: "AD", headline: "Student @ Northeastern University" },
    { id: 4, name: "Shlok Patel", initials: "SP", headline: "Oasis Mentor @ Northeastern University" },
    { id: 5, name: "Ekkam Singh", initials: "ES", headline: "Student @ Northeastern University" },
];

function Network() {
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
                        <h2 className="network-box-title">Requests</h2>
                    </section>
                    <section className="network-box">
                        <h2 className="network-box-title">People You May Know</h2>
                        <ul className="network-people">
                            {suggestedPeople.map((person) => (
                                <li key={person.id} className="network-person">
                                    <div className="feed-post-avatar" aria-hidden="true">{person.initials}</div>
                                    <p className="network-person-name">{person.name}</p>
                                    <p className="network-person-headline">{person.headline}</p>
                                    <button className="network-connect-button">Connect</button>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
                
                <div className="network-side">
                    <section className="network-box">
                        <h2 className="network-box-title">Groups</h2>
                    </section>
                </div>
            </main>
        </>
    );
}
    

export default Network;
