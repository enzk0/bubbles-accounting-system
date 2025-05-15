import React, { useState, useEffect, useRef } from "react";

import { IoAddCircle } from "react-icons/io5";
import CreateModal from "../components/CreateModal";
import JobOrderView from "../components/JobOrderView";

import { mixedJobOrders } from "../data/mockJobOrders";

function EmployeeJobOrders() {
    const jobOrders = mixedJobOrders;

    const createModalRef = useRef(null);
    const [visibility, setVisibility] = useState({
        createModal: false,
    });
    const [pageRows, setPageRows] = useState(14);

    useEffect(() => {
        const handleClickOutside = (e) => {
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
        <div className="p-8 pt-8">
            <CreateModal
                ref={createModalRef}
                isVisible={visibility.createModal}
            />
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
    );
}

export default EmployeeJobOrders;
