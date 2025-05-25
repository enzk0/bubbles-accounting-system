import React, { useState, useEffect, useRef } from "react";

import { IoAddCircle } from "react-icons/io5";
import CreateModal from "../components/CreateModal";
import JobOrderView from "../components/JobOrderView";

import mixedJobOrders from "../data/mockJobOrders";
import { privateApi } from "../api/BASApi";

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
    const createModalRef = useRef(null);

    const [refresh, setRefresh] = useState(0);

    const [jobOrders, setJobOrders] = useState([]);

    const [overview, setOverview] = useState({});

    const [visibility, setVisibility] = useState({
        createModal: false,
    });

    const [pageRows, setPageRows] = useState(9);

    const handleRefresh = () => {
        setRefresh((prev) => prev + 1);
    };

    const handleCloseCreate = () => {
        setVisibility((prev) => ({ ...prev, createModal: false }));
    };

    useEffect(() => {
        const fetchJobOrder = async () => {
            try {
                let jobOrdeResponse = await privateApi.get(
                    "/job-order/assigned"
                );
                setJobOrders(jobOrdeResponse.data);

                let overviewResponse = await privateApi.get(
                    "/job-order/count/assigned?interval=day"
                );
                setOverview(overviewResponse.data);
            } catch (error) {
                console.error("Error fetching job orders:", error);
            }
        };

        fetchJobOrder();
    }, [refresh]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const clickedOutside = {
                createModal:
                    createModalRef.current &&
                    !createModalRef.current.contains(e.target),
            };

            if (clickedOutside.createModal) {
                setVisibility((prev) => ({ ...prev, createModal: false }));
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setVisibility((prev) => ({ ...prev, createModal: false }));
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    console.log(jobOrders);

    return (
        <div className="p-8 pt-2">
            <CreateModal
                isVisible={visibility.createModal}
                ref={createModalRef}
                refresh={handleRefresh}
                close={handleCloseCreate}
            />
            <div className="mb-8">
                <p className="text-lg mb-2 font-bold">Overview</p>
                <div className="flex flex-row p-2 rounded-lg border-1 border-slate-300 bg-white">
                    <OverviewItem
                        title="Job Orders"
                        value={overview.no_of_job_orders}
                    />
                    <OverviewItem
                        title="Ongoing Job Orders"
                        value={overview.no_of_ongoing}
                    />
                    <OverviewItem
                        title="Completed Job Orders"
                        value={overview.no_of_completed}
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
                <JobOrderView
                    pageRows={pageRows}
                    jobOrders={jobOrders}
                    refresh={handleRefresh}
                />
            </div>
        </div>
    );
}

export default EmployeeHome;
