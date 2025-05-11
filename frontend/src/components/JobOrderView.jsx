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

