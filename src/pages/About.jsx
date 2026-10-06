import { useState } from "react";
import { Link } from "react-router";

const features = [
    {
        title: "Made for Students",
        description: "Simple yet efficient platform for students ranging from high school to college students to find internships, co-ops, and research positions."
    },
    {
        title: "Filters",
        description: "Search by major, GPA, location, remote or on-site, and more. Find the perfect opportunity that fits your needs."
    },
    {
        title: "Real events",
        description: "Find real events and opportunities that are happening in your area or online related to your qualifications and interests."
    },
    {
        title: "Resume Builder",
        description: "Enter your information once and generate a resume in seconds. You can also download your resume as a PDF."
    },
]

function About() {
    const [current, setCurrent] = useState(0);

    const slide = features[current];
    const isFirst = current === 0;
    const isLast = current === features.length - 1;

    return (
        <div className="page">
            <Link to="/login" className="btn-primary top-right">
                Log in
            </Link>
            <h1 className="page-title">About Us</h1>
            <p className="subtitle">Welcome to our platform!</p>
        </div>
    )
}

export default About