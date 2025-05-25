import React, { useState } from "react";
import mixedJobOrders from "../data/mockJobOrders";
import JobOrderView from "../components/JobOrderView";
import { useEffect } from "react";
import { privateApi } from "../api/BASApi";

function BranchSelection({ branches, setActive }) {
    const [selected, setSelected] = useState("All");

    const handleSelect = (e) => {
        setActive(e.target.value);
        setSelected(e.target.value);
    };

    return (
        <div className={`flex flex-col gap-2 mb-4 mt-4`}>
            <label htmlFor={""} className="text-lg font-bold">
                Branch
            </label>
            <select
                value={selected}
                onChange={handleSelect}
                className="rounded-md p-2 border-3 border-slate-300 bg-white focus:border-sky-300 focus:bg-sky-50"
            >
                {Object.entries(branches).map(([key, value]) => {
                    return (
                        <option key={key} value={value}>
                            {key}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}

function AdminJobOrders() {
    const [jobOrders, setJobOrders] = useState([]);
    const [active, setActive] = useState(0);
    const [branches, setBranches] = useState({});

    useEffect(() => {
        const fetchJobOrders = async () => {
            let query = "";

            if (active == 0) {
                query = "";
            }

            if (active != 0) {
                query = `?branchId=${active}`;
            }

            console.log(query);

            try {
                let response = await privateApi.get(`/job-order/all${query}`);

                setJobOrders(response.data);
            } catch (error) {
                if (error.response?.status === 404) {
                    setJobOrders([]);
                }
            }
        };

        fetchJobOrders();
    }, [active]);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                let response = await privateApi.get("/branch/all");

                const branches = response.data;
                let branchSelection = {};

                branches.forEach((branch) => {
                    branchSelection[branch.name] = branch.id;
                });

                console.log(branches);

                setBranches({ All: 0, ...branchSelection });
            } catch (error) {
                console.error("Error fetching job orders:", error);
            }
        };

        fetchBranches();
    }, []);

    const [pageRows, setPageRows] = useState(11);

    return (
        <div className="p-8 pt-2">
            <BranchSelection branches={branches} setActive={setActive} />
            <div className="flex flex-row mb-2">
                <p className="text-lg font-bold">Job Orders</p>
            </div>
            <JobOrderView pageRows={pageRows} jobOrders={jobOrders} />
        </div>
    );
}

export default AdminJobOrders;
