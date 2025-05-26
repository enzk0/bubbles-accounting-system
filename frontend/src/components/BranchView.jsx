import React, { useRef, useState, useEffect } from "react";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import BranchTable from "./BranchTable";
import EditBranchModal from "./EditBranchModal";

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

function BranchView({ pageRows, branches, refresh }) {
    const editModalRef = useRef(null);
    const [page, setPage] = useState(1);

    const [editModalData, setEditModalData] = useState(0);

    const [visibility, setVisibility] = useState({
        editModal: false,
    });

    const handleOpenEdit = (id) => {
        setEditModalData(null);
        setTimeout(() => {
            setEditModalData(id);
        }, 0);
    };

    const prevPage = () => {
        setPage((prev) => Math.max(prev - 1, 1));
    };

    const nextPage = () => {
        setPage((prev) =>
            Math.min(prev + 1, Math.ceil(branches.length / pageRows))
        );
    };

    useEffect(() => {
        if (editModalData) {
            setVisibility((prev) => ({ ...prev, editModal: true }));
        }
    }, [editModalData]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const clickedOutside = {
                editModal:
                    editModalRef.current &&
                    !editModalRef.current.contains(e.target),
            };

            if (clickedOutside.editModal) {
                setVisibility((prev) => ({ ...prev, editModal: false }));
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setVisibility((prev) => ({ ...prev, editModal: false }));
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
            <EditBranchModal
                id={editModalData}
                isVisible={visibility.editModal}
                ref={editModalRef}
                refresh={refresh}
            />
            <Header page={page} prevPage={prevPage} nextPage={nextPage} />
            <BranchTable
                branches={branches}
                page={page}
                pageRows={pageRows}
                openEditModal={handleOpenEdit}
            />
            {branches.length === 0 && (
                <div className="text-slate-400 text-center pt-8 pb-4 font-bold">
                    No Branches Found
                </div>
            )}
        </div>
    );
}

export default BranchView;
