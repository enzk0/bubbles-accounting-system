import React, { useRef, useEffect, useState } from "react";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import EditModal from "./EditModal";

import JobOrderTable from "./JobOrderTable";
import ViewModal from "./ViewModal";

function Header({ page, prevPage, nextPage }) {
    const leftSection = (
        <div className="flex flex-row gap-2">
            <button
                type="button"
                onClick={prevPage}
                className=" px-1.5 my-1 rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-400 cursor-pointer"
            >
                <BiSolidLeftArrow />
            </button>
            <div className="p-1.5 min-w-8 text-center">{page}</div>
            <button
                type="button"
                onClick={nextPage}
                className="px-1.5 my-1 rounded bg-slate-200 cursor-pointer"
            >
                <BiSolidRightArrow />
            </button>
        </div>
    );

    const middleSection = <div className="grow"></div>;

    const rightSection = <div></div>;

    return (
        <div className="flex flex-row mb-4 gap-4">
            {leftSection}
            {middleSection}
            {rightSection}
        </div>
    );
}

function Footer() {
    return <div></div>;
}

function JobOrderView({ pageRows, jobOrders, refresh }) {
    const editModalRef = useRef(null);
    const viewModalRef = useRef(null);

    const [editModalData, setEditModalData] = useState({
        idCode: "",
        idNumber: 0,
    });

    const [viewModalData, setViewModalData] = useState({
        idCode: "",
        idNumber: 0,
    });

    const [visibility, setVisibility] = useState({
        editModal: false,
        viewModal: false,
    });

    const [page, setPage] = useState(1);

    const prevPage = () => {
        console.log("Previous Page");
        setPage((prev) => Math.max(prev - 1, 1));
    };

    const nextPage = () => {
        setPage((prev) =>
            Math.min(prev + 1, Math.ceil(jobOrders.length / pageRows))
        );
    };

    const handleOpenEdit = (idCode, idNumber) => {
        setEditModalData({ idCode: idCode, idNumber: idNumber });
    };

    const handleOpenView = (idCode, idNumber) => {
        setViewModalData({ idCode: idCode, idNumber: idNumber });
    };

    useEffect(() => {
        if (editModalData.idCode && editModalData.idNumber) {
            setVisibility((prev) => ({ ...prev, editModal: true }));
        }
    }, [editModalData]);

    useEffect(() => {
        if (viewModalData.idCode && viewModalData.idNumber) {
            setVisibility((prev) => ({ ...prev, viewModal: true }));
        }
    }, [viewModalData]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const clickedOutside = {
                editModal:
                    editModalRef.current &&
                    !editModalRef.current.contains(e.target),
                viewModal:
                    viewModalRef.current &&
                    !viewModalRef.current.contains(e.target),
            };

            if (clickedOutside.editModal) {
                setVisibility((prev) => ({ ...prev, editModal: false }));
            }
            if (clickedOutside.viewModal) {
                setVisibility((prev) => ({ ...prev, viewModal: false }));
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setVisibility((prev) => ({ ...prev, editModal: false }));
                setVisibility((prev) => ({ ...prev, viewModal: false }));
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
        <div className="flex flex-col p-4 rounded-lg border-1 border-slate-300 bg-white">
            <EditModal
                idCode={editModalData.idCode}
                idNumber={editModalData.idNumber}
                isVisible={visibility.editModal}
                ref={editModalRef}
                refresh={refresh}
            />
            <ViewModal
                idCode={viewModalData.idCode}
                idNumber={viewModalData.idNumber}
                isVisible={visibility.viewModal}
                ref={viewModalRef}
            />
            <Header page={page} prevPage={prevPage} nextPage={nextPage} />
            <JobOrderTable
                page={page}
                pageRows={pageRows}
                jobOrders={jobOrders}
                openEditModal={handleOpenEdit}
                openViewModal={handleOpenView}
            />
            {jobOrders.length === 0 ? (
                <div className="text-slate-400 text-center pt-8 pb-4 font-bold">
                    No Completed Job Orders Found
                </div>
            ) : (
                ""
            )}
            <Footer />
        </div>
    );
}

export default JobOrderView;
