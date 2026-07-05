import { useEffect, useState } from "react";
import API from "../services/api";

function JobList() {

    const [jobs, setJobs] = useState([]);

    const [newJob, setNewJob] = useState({
        companyName: "",
        role: "",
        status: "Applied"
    });
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const fetchJobs = () => {
        API.get("/jobs")
            .then(response => {
                setJobs(response.data);
            })
            .catch(error => console.error(error));
    };

    useEffect(() => {
        fetchJobs();
    }, []);
    const deleteJob = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this job?"
        );

        if (!confirmDelete) return;

        try {

            await API.delete(`/jobs/${id}`);

            fetchJobs();

        } catch (error) {

            console.error(error);
            alert("Unable to delete job");

        }

    };
    const editJob = (job) => {

        setEditingId(job.id);

        setNewJob({

            companyName: job.companyName,
            role: job.role,
            status: job.status

        });

    };

    const handleChange = (e) => {
        setNewJob({
            ...newJob,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

                if (editingId) {

                    await API.put(`/jobs/${editingId}`, newJob);

                } else {

                    await API.post("/jobs", newJob);

                }

                setNewJob({
                    companyName: "",
                    role: "",
                    status: "Applied"
                });

                setEditingId(null);

                fetchJobs();

            } catch (error) {

                console.error(error);
                alert("Operation Failed");

            }
    };
    const filteredJobs = jobs.filter((job) => {

        const matchesSearch =
            job.companyName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "All" || job.status === statusFilter;

        return matchesSearch && matchesStatus;

    });

    return (
        <div className="container mt-4">
            <div className="row mb-4">
            <div className="col-md">
                    <div className="card text-center shadow">
                        <div className="card-body">
                            <h5>
                                <i className="bi bi-list-check me-2"></i>
                                Total
                            </h5>
                            <h2>{jobs.length}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md">
                    <div className="card text-center shadow border-success">
                        <div className="card-body">
                            <h5>
                                <i className="bi bi-send-check me-2"></i>
                                Applied
                            </h5>
                            <h2>
                                {jobs.filter(j => j.status === "Applied").length}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md">
                    <div className="card text-center shadow border-warning">
                        <div className="card-body">
                            <h5>
                                <i className="bi bi-people-fill me-2"></i>
                                Interview
                            </h5>
                            <h2>
                                {jobs.filter(j => j.status === "Interview").length}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md">
                    <div className="card text-center shadow border-primary">
                        <div className="card-body">
                            <h5>
                                <i className="bi bi-award-fill me-2"></i>
                                Offer
                            </h5>
                            <h2>
                                {jobs.filter(j => j.status === "Offer").length}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md">
                    <div className="card text-center shadow border-danger">
                        <div className="card-body">
                            <h5>
                                <i className="bi bi-x-circle-fill me-2"></i>
                                Rejected
                            </h5>
                            <h2>
                                {jobs.filter(j => j.status === "Rejected").length}
                            </h2>
                        </div>
                    </div>
                </div>
                </div>
                <div className="row mb-4">

                    <div className="col-md-6">

                        <input
                            className="form-control"
                            placeholder="Search Company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                    </div>

                    <div className="col-md-6">

                        <select
                            className="form-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >

                            <option>All</option>
                            <option>Applied</option>
                            <option>Interview</option>
                            <option>Offer</option>
                            <option>Rejected</option>

                        </select>

                    </div>

                </div>

                <div className="card shadow mb-4">

                    <div className="card-body">

                        <h4 className="mb-3">

                            {editingId ? "Update Job" : "Add New Job"}

                        </h4>

                        <form onSubmit={handleSubmit} className="mb-0">

                <div className="row">

                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Company Name"
                            name="companyName"
                            value={newJob.companyName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Role"
                            name="role"
                            value={newJob.role}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-2">
                        <select
                            className="form-select"
                            name="status"
                            value={newJob.status}
                            onChange={handleChange}
                        >
                            <option>Applied</option>
                            <option>Interview</option>
                            <option>Rejected</option>
                            <option>Offer</option>
                        </select>
                    </div>

                    <div className="col-md-2 d-grid">
                        <button
                            type="submit"
                            className="btn btn-success"
                        >
                            {editingId ? "Update Job" : "Add Job"}
                        </button>
                    </div>

                </div>

            </form>

                </div>

            </div>

            <table className="table table-hover align-middle shadow">

                <thead className="table-dark">
                    <tr>
                        <th>Company</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {filteredJobs.map(job => (

                        <tr key={job.id}>

                            <td>{job.companyName}</td>

                            <td>{job.role}</td>

                            <td>
                                <span
                                    className={
                                        job.status === "Applied"
                                            ? "badge bg-primary"
                                            : job.status === "Interview"
                                            ? "badge bg-warning text-dark"
                                            : job.status === "Offer"
                                            ? "badge bg-success"
                                            : "badge bg-danger"
                                    }
                                >
                                    {job.status}
                                </span>
                            </td>

                            <td>

                                 <button
                                        className="btn btn-outline-warning"
                                        onClick={() => editJob(job)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn btn-outline-danger"
                                        onClick={() => deleteJob(job.id)}
                                    >
                                        Delete
                                    </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );

}

export default JobList;