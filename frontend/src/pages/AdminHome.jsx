import React from "react";
import DropdownSelect from "../components/DropdownSelect";

import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { useState } from "react";

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

function AdminHome() {
    return (
        <div className="p-8 pt-2">
            <BranchSelection />
        </div>
    );
}

export default AdminHome;
