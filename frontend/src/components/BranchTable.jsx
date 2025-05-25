import React from "react";

import { MdEditSquare } from "react-icons/md";

function StatusItem({ status, positive, negative }) {
    return status ? (
        <div className="px-4 py-1 rounded-2xl bg-green-200 text-green-900 font-bold">
            {positive}
        </div>
    ) : (
        <div className="px-4 py-1 rounded-2xl bg-red-200 text-red-900 font-bold">
            {negative}
        </div>
    );
}

function BranchRow({ branch, openEditModal }) {
    return (
        <tr className="text-center border-b-1 border-slate-300">
            <td>{branch.id}</td>
            <td>{branch.code}</td>
            <td>{branch.name}</td>
            <td className="hidden sm:table-cell">{branch.address}</td>
            <td className="hidden sm:table-cell">
                <StatusItem
                    status={branch.isActive}
                    positive={"Active"}
                    negative={"Inactive"}
                />
            </td>
            <td>
                <button
                    type="button"
                    onClick={() => openEditModal(branch.id)}
                    className="p-2 mx-2 rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-400 cursor-pointer"
                >
                    <MdEditSquare />
                </button>
            </td>
        </tr>
    );
}

function BranchRows({ branches, page, pageRows, openEditModal }) {
    const startIndex = pageRows * (page - 1);
    const paginated = branches.slice(startIndex, startIndex + pageRows);

    return paginated.map((branch) => (
        <BranchRow
            key={branch.id}
            branch={branch}
            openEditModal={openEditModal}
        />
    ));
}

function BranchTable({ branches, page, pageRows, openEditModal }) {
    return (
        <table className="table-auto w-full">
            <thead className="border-y-1 border-slate-300">
                <tr>
                    <th>ID</th>
                    <th>Code</th>
                    <th>Name</th>
                    <th className="hidden sm:table-cell">Address</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <BranchRows
                    branches={branches}
                    page={page}
                    pageRows={pageRows}
                    openEditModal={openEditModal}
                />
            </tbody>
        </table>
    );
}

export default BranchTable;
