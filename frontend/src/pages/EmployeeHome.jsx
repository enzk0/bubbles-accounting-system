import React, { useState, useEffect, useRef } from "react";

import { IoAddCircle } from "react-icons/io5";
import CreateModal from "../components/CreateModal";
import JobOrderView from "../components/JobOrderView";

import mixedJobOrders from "../data/mockJobOrders";

function OverviewItem({ title, value, isLast = false }) {
    return (
        <div
            className={`grow p-1 m-3 ${isLast ? "" : "border-r-1 border-slate-300"}`}
        >
            <p className="text-sm font-bold text-gray-400">Today's</p>
            <p>{title}</p>
            <p className="mt-4 text-lg font-bold ">{value}</p>
        </div>
    );
}

function EmployeeHome() {
    const jobOrders = mixedJobOrders;

    const createModalRef = useRef(null);
    const [overview, setOverview] = useState({
        total: 32,
        ongoing: 8,
        completed: 24,
    });
    const [visibility, setVisibility] = useState({
        createModal: false,
    });
    const [pageRows, setPageRows] = useState(9);

    useEffect(() => {
        const handleClickOutside = (e) => {
            console.log(createModalRef.current);
            if (
                createModalRef.current &&
                !createModalRef.current.contains(e.target)
            ) {
                setVisibility((prev) => ({
                    ...prev,
                    createModal: false,
                }));
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mouseup", handleClickOutside);
        };
    }, []);

    return (
        <div className="p-8 pt-2">
            <CreateModal
                isVisible={visibility.createModal}
                ref={createModalRef}
            />
            <div className="mb-8">
                <p className="text-lg mb-2 font-bold">Overview</p>
                <div className="flex flex-row p-2 rounded-lg border-1 border-slate-300 bg-white">
                    <OverviewItem title="Job Orders" value={overview.total} />
                    <OverviewItem
                        title="Ongoing Job Orders"
                        value={overview.ongoing}
                    />
                    <OverviewItem
                        title="Completed Job Orders"
                        value={overview.completed}
                        isLast={true}
                    />
                </div>
            </div>
            <div>
                <div className="flex flex-row mb-4 items-baseline">
                    <p className="text-lg font-bold">Job Orders</p>
                    <div className="grow"></div>
                    <div>
                        <button
                            onClick={() =>
                                setVisibility((prev) => ({
                                    ...prev,
                                    createModal: !prev.createModal,
                                }))
                            }
                            className="flex flex-row grow items-center gap-2 p-1.5 px-3 rounded-md text-sky-50 font-bold cursor-pointer bg-sky-800 hover:bg-sky-700 active:bg-sky-900"
                        >
                            <IoAddCircle className="text-lg" />
                            <div>New</div>
                        </button>
                    </div>
                </div>
                <JobOrderView pageRows={pageRows} jobOrders={jobOrders} />
            </div>
        </div>
    );
}

export default EmployeeHome;
