import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import StatusChart from "../charts/StatusChart";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";

function JobList() {

    const [jobs, setJobs] = useState([]);
    const [allJobs, setAllJobs] = useState([]);

    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [totalPages, setTotalPages] = useState(0);


    const [newJob, setNewJob] = useState({
        companyName: "",
        role: "",
        status: "Applied",
        dateApplied: new Date().toISOString().split("T")[0]
    });
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortField, setSortField] = useState("");

    const fetchJobs = () => {

        API.get(`/jobs/paged?page=${page}&size=${size}`)
            .then(response => {

                setJobs(response.data.content);

                setTotalPages(response.data.totalPages);

            });
            API.get("/jobs")
                .then(response => {
                    setAllJobs(response.data);
                });

    };

    useEffect(() => {
        fetchJobs();
    }, [page]);
    const sortJobs = (field) => {

        setSortField(field);

        if (field === "") {

            fetchJobs();
            return;

        }

        API.get(`/jobs/sorted?field=${field}`)
            .then(response => {

                setJobs(response.data);

            })
            .catch(error => {

                console.error(error);

            });

    };

    const deleteJob = async (id) => {

        const result = await Swal.fire({

            title: "Delete Job?",

            text: "This action cannot be undone.",

            icon: "warning",

            showCancelButton: true,

            confirmButtonColor: "#d33",

            cancelButtonColor: "#3085d6",

            confirmButtonText: "Yes, Delete",

            cancelButtonText: "Cancel"

        });

        if (!result.isConfirmed) return;
        try {

            await API.delete(`/jobs/${id}`);

            toast.success("Job Deleted Successfully!");

            fetchJobs();

        } catch (error) {

            console.error(error);
            toast.error("Unable to delete job");

        }

    };
    const editJob = (job) => {

        setEditingId(job.id);

        setNewJob({

            companyName: job.companyName,
            role: job.role,
            status: job.status,
            dateApplied: job.dateApplied

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
                    status: "Applied",
                    dateApplied: new Date().toISOString().split("T")[0]
                });

                setEditingId(null);

                fetchJobs();

                toast.success(
                    editingId
                        ? "Job Updated Successfully!"
                        : "Job Added Successfully!"
                );

            } catch (error) {

                console.error(error);
                toast.error("Operation Failed");

            }
    };
    const exportToExcel = () => {

        const worksheet = XLSX.utils.json_to_sheet(allJobs);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Jobs"
        );

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });

        const file = new Blob(
            [excelBuffer],
            {
                type:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
            }
        );

        saveAs(file, "JobApplications.xlsx");

    };
    const exportToPDF = () => {

        const doc = new jsPDF();

        doc.setFontSize(18);

        doc.text("Job Application Report", 14, 20);

        autoTable(doc, {

            startY: 30,

            head: [[
                "Company",
                "Role",
                "Status",
                "Date Applied"
            ]],

            body: allJobs.map(job => [

                job.companyName,

                job.role,

                job.status,

                job.dateApplied

            ])

        });

        doc.save("JobApplications.pdf");

    };
    const today = new Date();

    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const thisMonthCount = allJobs.filter(job => {

        if (!job.dateApplied) return false;

        const d = new Date(job.dateApplied);

        return (
            d.getMonth() === currentMonth &&
            d.getFullYear() === currentYear
        );

    }).length;

    const successRate =
        allJobs.length === 0
            ? 0
            : Math.round(
                (allJobs.filter(j => j.status === "Offer").length /
                    allJobs.length) * 100
            );
    const filteredJobs = [...jobs]
        .filter((job) => {

            const matchesSearch =
                job.companyName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "All" ||
                job.status === statusFilter;

            return matchesSearch && matchesStatus;

        })
        .sort((a, b) => {

            if (sortField === "") return 0;

            return a[sortField]
                .toString()
                .localeCompare(b[sortField].toString());

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
                            <h2>{allJobs.length}</h2>
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
                                {allJobs.filter(j => j.status === "Applied").length}
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
                                {allJobs.filter(j => j.status === "Interview").length}
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
                                {allJobs.filter(j => j.status === "Offer").length}
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
                                {allJobs.filter(j => j.status === "Rejected").length}
                            </h2>
                        </div>
                    </div>
                </div>
                </div>
                <div className="row mb-4">

                    <div className="col-md-6">

                        <div className="card shadow border-info">

                            <div className="card-body text-center">

                                <h5>
                                    <i className="bi bi-calendar-check me-2"></i>
                                    Applications This Month
                                </h5>

                                <h2>{thisMonthCount}</h2>

                            </div>

                        </div>

                    </div>

                    <div className="col-md-6">

                        <div className="card shadow border-success">

                            <div className="card-body text-center">

                                <h5>
                                    <i className="bi bi-graph-up-arrow me-2"></i>
                                    Success Rate
                                </h5>

                                <h2>{successRate}%</h2>

                            </div>

                        </div>

                    </div>

                </div>

                <StatusChart jobs={allJobs} />
                <div className="row mb-4">

                    <div className="col-md-3">

                        <input
                            className="form-control"
                            placeholder="Search Company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                    </div>

                    <div className="col-md-3">

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

                        <div className="col-md-3">

                            <select
                                className="form-select"
                                value={sortField}
                                onChange={(e) => setSortField(e.target.value)}
                            >

                                <option value="">Sort By</option>
                                <option value="companyName">Company Name</option>
                                <option value="role">Role</option>
                                <option value="status">Status</option>

                            </select>

                        </div>
                        <div className="col-md-3 d-grid">

                            <button
                                className="btn btn-success"
                                onClick={exportToExcel}
                            >
                                <i className="bi bi-file-earmark-excel-fill me-2"></i>

                                Export Excel

                            </button>
                            <button
                                        className="btn btn-danger"
                                        onClick={exportToPDF}
                                    >
                                        <i className="bi bi-file-earmark-pdf-fill me-2"></i>
                                        Export PDF
                                    </button>

                        </div>

                        </div>

                <div className="card shadow mb-4">

                    <div className="card-body">

                        <h4 className="mb-3">

                            {editingId ? "Update Job" : "Add New Job"}

                        </h4>

                        <form onSubmit={handleSubmit} className="mb-0">

                <div className="row">

                    <div className="col-md-3">
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

                    <div className="col-md-3">
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

                        <input
                            type="date"
                            className="form-control"
                            name="dateApplied"
                            value={newJob.dateApplied}
                            onChange={handleChange}
                        />

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
                        <th>Date Applied</th>
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
                                {job.dateApplied}
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
            <div className="d-flex justify-content-center align-items-center mt-4">

                <button
                    className="btn btn-outline-primary me-3"
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                >
                    ← Previous
                </button>

                <span className="fw-bold">
                    Page {page + 1} of {totalPages}
                </span>

                <button
                    className="btn btn-outline-primary ms-3"
                    disabled={page === totalPages - 1}
                    onClick={() => setPage(page + 1)}
                >
                    Next →
                </button>

            </div>

        </div>
    );

}

export default JobList;