import JobList from "../components/JobList";

function Home() {

    return (

        <div className="container mt-5">

            <h1 className="text-center mb-4">
                Job Application Tracker
            </h1>

            <JobList />

        </div>

    );

}

export default Home;