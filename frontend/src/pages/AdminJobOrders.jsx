import React, { useState } from "react";
import mixedJobOrders from "../data/mockJobOrders";
import JobOrderView from "../components/JobOrderView";

function BranchSelection() {
    const options = [
        "All",
        "Gran Europa",
        "Bloomingdale",
        "Malanang",
        "Southview",
        "Regency",
    ];

    const [selected, setSelected] = useState("All");

    return (
        <div className={`flex flex-col gap-2 mb-4`}>
            <label htmlFor={""} className="font-bold">
                Branch
            </label>
            <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="rounded-md p-2 border-3 border-slate-300 bg-white focus:border-sky-300 focus:bg-sky-50"
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

function AdminJobOrders() {
    return (
        <div>
            <h1>Hello</h1>
        </div>
    );
}

export default AdminJobOrders;
