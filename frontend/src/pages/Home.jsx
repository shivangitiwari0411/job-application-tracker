import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobList from "../components/JobList";

function Home() {
    const navigate = useNavigate();
    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/login");

    };

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
        }

    }, [navigate]);

    return (

        <div className="container mt-5">
            <div className="d-flex justify-content-end mb-3">

                        <button
                            className="btn btn-danger"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </div>

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