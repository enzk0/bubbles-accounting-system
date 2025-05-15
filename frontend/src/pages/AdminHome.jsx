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

function Summary() {
    const [tabState, setTabState] = useState({
        daily: false,
        weekly: true,
        monthly: false,
        quarterly: false,
        yearly: false,
    });

    const handleTab = (tab) => {
        setTabState((prev) => ({
            ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])),
            [tab]: true,
        }));
    };

    const activeStyle = "border-1 border-slate-300/100 bg-white shadow-xs";

    const SummaryColumn = ({ title, subtitle, value, isLast = false }) => (
        <div
            className={`grow p-1 m-3 ${
                isLast ? "" : "border-r-1 border-slate-300"
            }`}
        >
            <p>{title}</p>
            <p className="text-sm font-bold text-gray-400">{subtitle}</p>
            <div className="mt-6 flex flex-row items-baseline">
                <p className="text-xl font-bold ">{value.toFixed(2)}</p>
                <p className="text-xs">PHP</p>
            </div>
        </div>
    );

    const SummaryTabs = (
        <div className="flex flex-row p-1 m-2 gap-2 rounded bg-slate-200 inset-shadow-2xs">
            {Object.keys(tabState).map((key) => {
                return (
                    <button
                        type="button"
                        className={`px-2 rounded-sm border-1 border-slate-300/0 cursor-pointer ${
                            tabState[key] ? activeStyle : "hover:bg-slate-300"
                        }`}
                        onClick={() => handleTab(key)}
                    >
                        {key[0].toUpperCase() + key.slice(1)}
                    </button>
                );
            })}
        </div>
    );

    return (
        <div className="mb-4">
            <p className="text-lg mb-2 font-bold">Summary</p>
            <div className="flex flex-col p-2 rounded-lg border-1 border-slate-300 bg-white">
                <div className="flex flex-row">{SummaryTabs}</div>
                <div className="flex flex-row ">
                    <SummaryColumn
                        title={"Total"}
                        subtitle={"Unpaid + Paid"}
                        value={100}
                    />
                    <SummaryColumn
                        title={"Total Unpaid"}
                        subtitle={"Unpaid Job Orders"}
                        value={70}
                    />
                    <SummaryColumn
                        title={"Total Paid"}
                        subtitle={"Paid Job Orders"}
                        value={20}
                        isLast={true}
                    />
                </div>
            </div>
        </div>
    );
}

function Report() {
    const [tabState, setTabState] = useState({
        daily: false,
        weekly: true,
        monthly: false,
        quarterly: false,
        yearly: false,
    });

    const handleTab = (tab) => {
        setTabState((prev) => ({
            ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])),
            [tab]: true,
        }));
    };

    const activeStyle = "border-1 border-slate-300/100 bg-white shadow-xs";

    const ReportTabs = (
        <div className="flex flex-row p-1 m-2 gap-2 rounded bg-slate-200 inset-shadow-2xs">
            {Object.keys(tabState).map((key) => {
                return (
                    <button
                        type="button"
                        className={`px-2 rounded-sm border-1 border-slate-300/0 cursor-pointer ${
                            tabState[key] ? activeStyle : "hover:bg-slate-300"
                        }`}
                        onClick={() => handleTab(key)}
                    >
                        {key[0].toUpperCase() + key.slice(1)}
                    </button>
                );
            })}
        </div>
    );

    const ReportPageButtons = (
        <div className="flex flex-row gap-2 items-center mr-4">
            <button
                type="button"
                className="p-1.5 rounded text-sm bg-slate-200 hover:bg-slate-300 active:bg-slate-400 cursor-pointer"
            >
                <BiSolidLeftArrow />
            </button>
            <div className="p-1.5 min-w-8 text-center">1</div>
            <button
                type="button"
                className="p-1.5 rounded text-sm bg-slate-200 hover:bg-slate-300 active:bg-slate-400 cursor-pointer"
            >
                <BiSolidRightArrow />
            </button>
        </div>
    );

    const ReportTable = (
        <table className="table-auto">
            <thead>
                <tr className="border-b-2 border-b-slate-400">
                    <th>Date</th>
                    <th># Job Orders</th>
                    <th># Unpaid Job Orders</th>
                    <th># Paid Job Orders</th>
                    <th>Total</th>
                    <th>Total Unpaid</th>
                    <th>Total Paid</th>
                </tr>
            </thead>
            <tbody className="text-center">
                <tr className="border-b-1 border-b-slate-300">
                    <td>01/01/2025</td>
                    <td>32</td>
                    <td>8</td>
                    <td>24</td>
                    <td>1800.00</td>
                    <td>320.00</td>
                    <td>1480.00</td>
                </tr>
                <tr className="border-b-1 border-b-slate-300">
                    <td>01/08/2025</td>
                    <td>16</td>
                    <td>2</td>
                    <td>14</td>
                    <td>800.00</td>
                    <td>200.00</td>
                    <td>600.00</td>
                </tr>
                <tr>
                    <td>01/15/2025</td>
                    <td>64</td>
                    <td>12</td>
                    <td>52</td>
                    <td>1920.00</td>
                    <td>240.00</td>
                    <td>1680.00</td>
                </tr>
            </tbody>
        </table>
    );

    return (
        <div className="mb-8">
            <p className="text-lg mb-2 font-bold">Reports</p>
            <div className="flex flex-col p-2 rounded-lg border-1 border-slate-300 bg-white">
                <div className="flex flex-row">
                    {ReportTabs}
                    <div className="grow"></div>
                    {ReportPageButtons}
                </div>
                <div className="flex flex-col">{ReportTable}</div>
            </div>
        </div>
    );
}

function AdminHome() {
    return (
        <div className="p-8 pt-2">
            <BranchSelection />
            <Summary />
        </div>
    );
}

export default AdminHome;
