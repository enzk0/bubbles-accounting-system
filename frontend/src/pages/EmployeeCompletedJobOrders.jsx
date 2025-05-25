import React, { useState, useEffect, useRef } from "react";

import JobOrderView from "../components/JobOrderView";

import { privateApi } from "../api/BASApi.js";

function EmployeeCompletedJobOrders() {
    const [refresh, setRefresh] = useState(0);

    const [jobOrders, setJobOrders] = useState([]);

    const [pageRows, setPageRows] = useState(13);

    const handleRefresh = () => {
        setRefresh((prev) => prev + 1);
    };

    useEffect(() => {
        const fetchJobOrder = async () => {
            try {
                let response = await privateApi.get("/user/self");
                const { id: userId, branchId } = response.data;

                response = await privateApi.get(
                    `/job-order/assigned?isOngoing=false`
                );

                setJobOrders(response.data);
            } catch (error) {
                console.error("Error fetching job orders:", error);
            }
        };

        fetchJobOrder();
    }, [refresh]);

    return (
        <div className="p-8 pt-10">
            <div className="flex flex-row mb-4 items-baseline">
                <p className="text-lg font-bold">Completed Job Orders</p>
            </div>
            <JobOrderView
                pageRows={pageRows}
                jobOrders={jobOrders}
                refresh={handleRefresh}
            />
        </div>
    );
}

export default EmployeeCompletedJobOrders;
