import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
);

function StatusChart({ jobs }) {

    const applied =
        jobs.filter(j => j.status === "Applied").length;

    const interview =
        jobs.filter(j => j.status === "Interview").length;

    const offer =
        jobs.filter(j => j.status === "Offer").length;

    const rejected =
        jobs.filter(j => j.status === "Rejected").length;

    const data = {

        labels: [
            "Applied",
            "Interview",
            "Offer",
            "Rejected"
        ],

        datasets: [

            {

                data: [
                    applied,
                    interview,
                    offer,
                    rejected
                ],

                backgroundColor: [
                    "#198754",
                    "#ffc107",
                    "#0d6efd",
                    "#dc3545"
                ]

            }

        ]

    };

    return (

        <div className="row mb-4">

            <div className="col-md-6">

                <div className="card shadow">

                    <div className="card-body">

                        <h5 className="text-center">
                            Job Status Distribution
                        </h5>

                        <Pie data={data} />

                    </div>

                </div>

            </div>

            <div className="col-md-6">

                <div className="card shadow">

                    <div className="card-body">

                        <h5 className="text-center">
                            Applications Overview
                        </h5>

                        <Bar data={data} />

                    </div>

                </div>

            </div>

        </div>

    );

}

export default StatusChart;