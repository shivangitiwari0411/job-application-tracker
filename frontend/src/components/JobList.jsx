import { useEffect, useState } from "react";
import API from "../services/api";

function JobList() {

    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        API.get("")
            .then(response => {
                setJobs(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <div className="container mt-4">

            <table className="table table-striped table-bordered">

                <thead className="table-dark">
                    <tr>
                        <th>Company</th>
                        <th>Role</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>

                    {jobs.map(job => (

                        <tr key={job.id}>
                            <td>{job.companyName}</td>
                            <td>{job.role}</td>
                            <td>{job.status}</td>
                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );

}

export default JobList;