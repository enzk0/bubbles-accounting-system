import React, { useState, useEffect, useRef } from "react";
import { IoAddCircle } from "react-icons/io5";

import CreateModal from "../components/CreateModal";
import JobOrderView from "../components/JobOrderView";

import { mixedJobOrders } from "../data/mockJobOrders.js";
import { privateApi } from "../api/BASApi.js";

function EmployeeOngoingJobOrders() {
    const createModalRef = useRef(null);

    const [refresh, setRefresh] = useState(0);

    const [jobOrders, setJobOrders] = useState([]);

    const [visibility, setVisibility] = useState({
        createModal: false,
    });

    const [pageRows, setPageRows] = useState(10);

    const handleRefresh = () => {
        setRefresh((prev) => prev + 1);
    };

    useEffect(() => {
        const fetchJobOrder = async () => {
            try {
                let response = await privateApi.get("/user/self");

                const user = response.data;

                response = await privateApi.get(
                    `/job-order/assigned?isOngoing=true`
                );
                setJobOrders(response.data);
            } catch (error) {
                if (error.response.status === 404) {
                    setJobOrders([]);
                    return;
                }
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

    return (
        <div className="p-8 pt-8">
            <CreateModal
                ref={createModalRef}
                isVisible={visibility.createModal}
                refresh={handleRefresh}
            />
            <div className="flex flex-row mb-4 items-baseline">
                <p className="text-lg font-bold">Ongoing Job Orders</p>
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
    );
}

export default EmployeeOngoingJobOrders;
