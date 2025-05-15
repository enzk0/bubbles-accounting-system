import React, { useState, useEffect, useRef } from "react";
import { IoAddCircle } from "react-icons/io5";

import JobOrderView from "../components/JobOrderView";

import { completedJobOrders } from "../data/mockJobOrders.js";

function EmployeeCompletedJobOrders() {
    const jobOrders = completedJobOrders;

    const [pageRows, setPageRows] = useState(13);

    return (
        <div className="p-8 pt-10">
            <div className="flex flex-row mb-4 items-baseline">
                <p className="text-lg font-bold">Completed Job Orders</p>
            </div>
            <JobOrderView pageRows={pageRows} jobOrders={jobOrders} />
        </div>
    );
}

export default EmployeeCompletedJobOrders;
