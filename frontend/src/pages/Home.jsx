import JobList from "../components/JobList";

function Home() {

    return (

        <div className="container mt-5">

            <h1 className="text-center fw-bold mb-4">

                <i className="bi bi-briefcase-fill text-primary me-2"></i>

                Job Application Tracker

            </h1>

            <p className="text-center text-muted mb-5">
                Track all your job applications in one place.
            </p>

            <JobList />

        </div>

    );

}

export default Home;