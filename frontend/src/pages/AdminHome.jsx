import React, { useEffect } from "react";
import DropdownSelect from "../components/DropdownSelect";

import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { useState } from "react";
import { privateApi } from "../api/BASApi";
import { formatDate } from "../utils/date";

function BranchSelection({ branches, setActive }) {
    const [selected, setSelected] = useState(0);

    const handleSelect = (e) => {
        setActive(e.target.value);
        setSelected(e.target.value);
    };

    return (
        <div className={`flex flex-col gap-2 mb-4`}>
            <label htmlFor={""} className="font-bold">
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

function Summary({ active }) {
    const [tabState, setTabState] = useState({
        day: true,
        week: false,
        month: false,
        quarter: false,
        year: false,
    });
    const [interval, setInterval] = useState("day");
    const [summary, setSummary] = useState({
        total: 0,
        total_paid: 0,
        total_unpaid: 0,
    });

    const handleTab = (tab) => {
        setTabState((prev) => ({
            ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])),
            [tab]: true,
        }));
        setInterval(tab);
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

    useEffect(() => {
        const fetchSummaries = async () => {
            let query = "";

            if (active == 0) {
                query = "";
            }

            if (active != 0) {
                query = `&branchId=${active}`;
            }

            try {
                let response = await privateApi.get(
                    `/job-order/count?interval=${interval}${query}`
                );

                setSummary(response.data[0]);
            } catch (error) {
                console.error("Error fetching job orders:", error);
                if (error.response?.status === 404) {
                    setSummary({ total: 0, total_unpaid: 0, total_paid: 0 });
                }
            }
        };
        fetchSummaries();
    }, [active, interval]);

    return (
        <div className="mb-4">
            <div className="flex flex-row items-baseline gap-2 text-lg mb-2 font-bold">
                <p>Summary</p>
                <p className="text-sm italic text-slate-500">
                    *(Most Recent Day, Week, ...)
                </p>
            </div>
            <div className="flex flex-col p-2 rounded-lg border-1 border-slate-300 bg-white">
                <div className="flex flex-row">{SummaryTabs}</div>
                <div className="flex flex-row ">
                    <SummaryColumn
                        title={"Total"}
                        subtitle={"Unpaid + Paid"}
                        value={summary.total}
                    />
                    <SummaryColumn
                        title={"Total Unpaid"}
                        subtitle={"Unpaid Job Orders"}
                        value={summary.total_unpaid}
                    />
                    <SummaryColumn
                        title={"Total Paid"}
                        subtitle={"Paid Job Orders"}
                        value={summary.total_paid}
                        isLast={true}
                    />
                </div>
            </div>
        </div>
    );
}

function Report({ active }) {
    const [tabState, setTabState] = useState({
        day: false,
        week: true,
        month: false,
        quarter: false,
        year: false,
    });

    const [interval, setInterval] = useState("day");
    const [reports, setReports] = useState([]);

    const handleTab = (tab) => {
        setTabState((prev) => ({
            ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])),
            [tab]: true,
        }));
        setInterval(tab);
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
                {reports.map((report) => {
                    return (
                        <tr>
                            <td>{formatDate(report.interval_start)}</td>
                            <td>{report.no_of_job_orders}</td>
                            <td>{report.no_of_unpaid}</td>
                            <td>{report.no_of_paid}</td>
                            <td>{report.total.toFixed(2)}</td>
                            <td>{report.total_unpaid.toFixed(2)}</td>
                            <td>{report.total_paid.toFixed(2)}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );

    useEffect(() => {
        const fetchReports = async () => {
            let query = "";

            if (active == 0) {
                query = "";
            }

            if (active != 0) {
                query = `&branchId=${active}`;
            }

            try {
                let response = await privateApi.get(
                    `/job-order/count?interval=${interval}${query}`
                );

                setReports(response.data);
            } catch (error) {
                console.error("Error fetching job orders:", error);
                if (error.response?.status === 404) {
                    setReports([]);
                }
            }
        };
        fetchReports();
    }, [active, interval]);

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
                {reports.length === 0 ? (
                    <div className="text-slate-400 text-center pt-8 pb-4 font-bold">
                        No Reports Could Be Found
                    </div>
                ) : (
                    ""
                )}
            </div>
        </div>
    );
}

function AdminHome() {
    const [active, setActive] = useState(0);
    const [branches, setBranches] = useState({});

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                let response = await privateApi.get("/branch/all");

                const branches = response.data;
                let branchSelection = {};

                branches.forEach((branch) => {
                    branchSelection[branch.name] = branch.id;
                });

                setBranches({ All: 0, ...branchSelection });
            } catch (error) {
                console.error("Error fetching job orders:", error);
            }
        };

        fetchBranches();
    }, []);

    return (
        <div className="p-8 pt-2">
            <BranchSelection branches={branches} setActive={setActive} />
            <Summary active={active} />
            <Report active={active} />
        </div>
    );
}

export default AdminHome;
