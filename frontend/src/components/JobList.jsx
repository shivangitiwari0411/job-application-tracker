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

    return (
        <div className="container mt-4">

            <form onSubmit={handleSubmit} className="mb-4">

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

                    <div className="col-md-2">
                        <button className="btn btn-primary w-100">

                            {editingId ? "Update Job" : "Add Job"}

                        </button>
                    </div>

                </div>

            </form>

            <table className="table table-striped table-bordered">

                <thead className="table-dark">
                    <tr>
                        <th>Company</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {jobs.map(job => (

                        <tr key={job.id}>

                            <td>{job.companyName}</td>

                            <td>{job.role}</td>

                            <td>{job.status}</td>

                            <td>

                                 <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => editJob(job)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
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