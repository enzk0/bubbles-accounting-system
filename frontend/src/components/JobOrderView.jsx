import React, { useRef, useEffect, useState } from "react";

import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";

import JobOrderTable from "./JobOrderTable";
import EditModal from "./EditModal";

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

function JobOrderView({ pageRows, jobOrders }) {
    const editModalRef = useRef(null);
    const [page, setPage] = useState(1);
    const [modalJobOrderId, setModalJobOrderId] = useState(null);
    const [visibility, setVisibility] = useState({
        editModal: false,
    });

    const prevPage = () => {
        console.log("Previous Page");
        setPage((prev) => Math.max(prev - 1, 1));
    };

    const nextPage = () => {
        setPage((prev) =>
            Math.min(prev + 1, Math.ceil(jobOrders.length / pageRows))
        );
    };

    const handleOpenModal = (jobOrderId) => {
        console.log("Open Edit Modal");
        setModalJobOrderId(jobOrderId);
        setVisibility((prev) => ({ ...prev, editModal: true }));
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                editModalRef.current &&
                !editModalRef.current.contains(e.target)
            ) {
                setVisibility((prev) => ({
                    ...prev,
                    editModal: false,
                }));
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mouseup", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-col p-4 rounded-lg border-1 border-slate-300 bg-white">
            <EditModal
                jobOrderId={modalJobOrderId}
                isVisible={visibility.editModal}
                ref={editModalRef}
            />
            <Header page={page} prevPage={prevPage} nextPage={nextPage} />
            <JobOrderTable
                page={page}
                pageRows={pageRows}
                jobOrders={jobOrders}
                openEditModal={handleOpenModal}
            />
            <Footer />
        </div>
    );
}

export default JobOrderView;
