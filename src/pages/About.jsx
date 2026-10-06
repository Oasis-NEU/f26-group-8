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
            <div aria-live="polite" className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">{slide.title}</h2>
                <p className="text-gray-700 mb-6">{slide.description}</p>
                <div className="flex justify-between">  
                    <button
                        onClick={() => setCurrent(current - 1)}
                        disabled={isFirst}
                        className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md ${isFirst ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setCurrent(current + 1)}
                        disabled={isLast}
                        className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md ${isLast ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Next
                    </button>
                </div>
            </div>
            <Link to="/login" className="mt-6 text-blue-700 underline">
                Log in
            </Link>
        </div>
    )
}

export default About