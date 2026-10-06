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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-8">About Us</h1>
            <p className="text-gray-700 mb-6">Welcome to our platform!</p>
            <Link to="/login" className="mt-6 text-blue-700 underline">
                Log in
            </Link>
        </div>
    )
}

export default About