import React, { useEffect, useRef, useState } from "react";
import BranchView from "../components/BranchView";

import { IoAddCircle } from "react-icons/io5";
import { privateApi } from "../api/BASApi";
import CreateBranchModal from "../components/CreateBranchModal";

function AdminBranches() {
    const createBranchModalRef = useRef(null);

    const [refresh, setRefresh] = useState(0);

    const [branches, setBranches] = useState([]);

    const [visibility, setVisibility] = useState({
        createBranchModal: false,
    });

    const [pageRows] = useState(10);

    const handleRefresh = () => {
        setRefresh((prev) => prev + 1);
    };

    const handleCloseCreateBranch = () => {
        setVisibility((prev) => ({ ...prev, createBranchModal: false }));
    };

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await privateApi.get("/branch/all");
                setBranches(response.data);
            } catch (err) {
                console.error("Error fetching branches:", err);
            }
        };

        fetchBranches();
    }, [refresh]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const clickedOutside = {
                createBranchModalRef:
                    createBranchModalRef.current &&
                    !createBranchModalRef.current.contains(e.target),
            };

            if (clickedOutside.createBranchModalRef) {
                setVisibility((prev) => ({
                    ...prev,
                    createBranchModal: false,
                }));
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setVisibility((prev) => ({
                    ...prev,
                    createBranchModal: false,
                }));
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
        <div className="p-8 pt-2 mt-4">
            <CreateBranchModal
                ref={createBranchModalRef}
                isVisible={visibility.createBranchModal}
                refresh={handleRefresh}
                close={handleCloseCreateBranch}
            />
            <div className="flex flex-row mb-2">
                <p className="text-lg font-bold">Branches</p>
                <div className="grow"></div>
                <div>
                    <button
                        onClick={() =>
                            setVisibility((prev) => ({
                                ...prev,
                                createBranchModal: !prev.createBranchModal,
                            }))
                        }
                        className="flex flex-row grow items-center gap-2 p-1.5 px-3 rounded-md text-sky-50 font-bold cursor-pointer bg-sky-800 hover:bg-sky-700 active:bg-sky-900"
                    >
                        <IoAddCircle className="text-lg" />
                        <div>New</div>
                    </button>
                </div>
            </div>
            <BranchView
                pageRows={pageRows}
                branches={branches}
                refresh={handleRefresh}
            />
        </div>
    );
}

export default AdminBranches;
