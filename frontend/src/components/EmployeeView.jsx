import React, { useState, useRef, useEffect } from "react";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import EmployeeTable from "./EmployeeTable";
import EditPasswordModal from "./EditUserPassword";
import EditUserStatusModal from "./EditUserStatusModal";
import EditUserBranchModal from "./EditUserBranchModal";

function Header({ page, prevPage, nextPage }) {
    return (
        <div className="flex flex-row mb-4 gap-4">
            <div className="flex flex-row gap-2">
                <button
                    onClick={prevPage}
                    className="p-1.5 rounded bg-slate-200 hover:bg-slate-300"
                >
                    <BiSolidLeftArrow />
                </button>
                <div className=" min-w-8 text-center">{page}</div>
                <button
                    onClick={nextPage}
                    className="p-1.5 rounded bg-slate-200 hover:bg-slate-300"
                >
                    <BiSolidRightArrow />
                </button>
            </div>
            <div className="grow"></div>
        </div>
    );
}

function EmployeeView({ pageRows, employees, refresh }) {
    const editModalRef = useRef(null);
    const editStatusModalRef = useRef(null);
    const editBranchModalRef = useRef(null);

    const [page, setPage] = useState(1);

    const [editModalData, setEditModalData] = useState(0);
    const [editStatusModalData, setEditStatusModalData] = useState(0);
    const [editBranchModalData, setEditBranchModalData] = useState(0);

    const [visibility, setVisibility] = useState({
        editModal: false,
        editStatusModal: false,
        editBranchModal: false,
    });

    const handleOpenEdit = (id) => {
        setEditModalData(id);
    };

    const handleOpenEditStatus = (id) => {
        setEditStatusModalData(id);
    };

    const handleOpenEditBranch = (id) => {
        setEditBranchModalData(id);
    };

    const handleCloseChangePassword = () => {
        setVisibility((prev) => ({ ...prev, editModal: false }));
    };

    const handleCloseChangeBranch = () => {
        setVisibility((prev) => ({ ...prev, editBranchModal: false }));
    };

    const prevPage = () => {
        setPage((prev) => Math.max(prev - 1, 1));
    };

    const nextPage = () => {
        setPage((prev) =>
            Math.min(prev + 1, Math.ceil(products.length / pageRows))
        );
    };

    useEffect(() => {
        if (editModalData) {
            setVisibility((prev) => ({ ...prev, editModal: true }));
        }
    }, [editModalData]);

    useEffect(() => {
        if (editStatusModalData) {
            setVisibility((prev) => ({ ...prev, editStatusModal: true }));
        }
    }, [editStatusModalData]);

    useEffect(() => {
        if (editBranchModalData) {
            setVisibility((prev) => ({ ...prev, editBranchModal: true }));
        }
    }, [editBranchModalData]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const clickedOutside = {
                editModal:
                    editModalRef.current &&
                    !editModalRef.current.contains(e.target),
                editStatusModal:
                    editStatusModalRef.current &&
                    !editStatusModalRef.current.contains(e.target),
                editBranchModal:
                    editBranchModalRef.current &&
                    !editBranchModalRef.current.contains(e.target),
            };

            if (clickedOutside.editModal) {
                setVisibility((prev) => ({ ...prev, editModal: false }));
            }
            if (clickedOutside.editStatusModal) {
                setVisibility((prev) => ({ ...prev, editStatusModal: false }));
            }
            if (clickedOutside.editBranchModal) {
                setVisibility((prev) => ({ ...prev, editBranchModal: false }));
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setVisibility((prev) => ({ ...prev, editModal: false }));
                setVisibility((prev) => ({ ...prev, editStatusModal: false }));
                setVisibility((prev) => ({ ...prev, editBranchModal: false }));
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mouseup", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className="flex flex-col p-4 rounded-lg border border-slate-300 bg-white">
            <EditPasswordModal
                id={editModalData}
                isVisible={visibility.editModal}
                ref={editModalRef}
                refresh={refresh}
                close={handleCloseChangePassword}
            />
            <EditUserStatusModal
                id={editStatusModalData}
                isVisible={visibility.editStatusModal}
                ref={editStatusModalRef}
                refresh={refresh}
            />
            <EditUserBranchModal
                id={editBranchModalData}
                isVisible={visibility.editBranchModal}
                ref={editBranchModalRef}
                refresh={refresh}
                close={handleCloseChangeBranch}
            />
            <Header page={page} prevPage={prevPage} nextPage={nextPage} />
            <EmployeeTable
                employees={employees}
                page={page}
                pageRows={pageRows}
                openEditModal={handleOpenEdit}
                openEditStatusModal={handleOpenEditStatus}
                openEditBranchModal={handleOpenEditBranch}
            />
            {employees.length === 0 && (
                <div className="text-slate-400 text-center pt-8 pb-4 font-bold">
                    No Employees Found
                </div>
            )}
        </div>
    );
}

export default EmployeeView;
