import React from "react";

import { MdEditSquare } from "react-icons/md";
import { PiPasswordFill } from "react-icons/pi";
import { FaShop } from "react-icons/fa6";

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

function EmployeeRow({
    employee,
    openEditModal,
    openEditStatusModal,
    openEditBranchModal,
}) {
    return (
        <tr className="text-center border-b border-slate-300">
            <td>{employee.id}</td>
            <td>{employee.username}</td>
            <td>{employee.firstName}</td>
            <td>{employee.lastName}</td>
            <td>{employee.branchId ? employee.branch.name : ""}</td>
            <td>{employee.roleId ? employee.role.name : ""}</td>
            <td className="hidden sm:table-cell">
                <StatusItem
                    status={employee.isActive}
                    positive={"Active"}
                    negative={"Inactive"}
                />
            </td>
            <td>
                <button
                    type="button"
                    onClick={() => openEditModal(employee.id)}
                    className="p-2 mx-2 rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-400 cursor-pointer"
                >
                    <PiPasswordFill />
                </button>
                <button
                    type="button"
                    onClick={() => openEditStatusModal(employee.id)}
                    className="p-2 mx-2 rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-400 cursor-pointer"
                >
                    <MdEditSquare />
                </button>
                <button
                    type="button"
                    onClick={() => openEditBranchModal(employee.id)}
                    className="p-2 mx-2 rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-400 cursor-pointer"
                >
                    <FaShop />
                </button>
            </td>
        </tr>
    );
}

function EmployeeRows({
    employees,
    page,
    pageRows,
    openEditModal,
    openEditStatusModal,
    openEditBranchModal,
}) {
    const start = (page - 1) * pageRows;
    const paginated = employees.slice(start, start + pageRows);

    return paginated.map((employee) => (
        <EmployeeRow
            key={employee.id}
            employee={employee}
            openEditModal={openEditModal}
            openEditStatusModal={openEditStatusModal}
            openEditBranchModal={openEditBranchModal}
        />
    ));
}

function EmployeeTable({
    employees,
    page,
    pageRows,
    openEditModal,
    openEditStatusModal,
    openEditBranchModal,
}) {
    return (
        <table className="table-auto w-full">
            <thead className="border-y border-slate-300">
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Branch</th>
                    <th>Role</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <EmployeeRows
                    employees={employees}
                    page={page}
                    pageRows={pageRows}
                    openEditModal={openEditModal}
                    openEditStatusModal={openEditStatusModal}
                    openEditBranchModal={openEditBranchModal}
                />
            </tbody>
        </table>
    );
}

export default EmployeeTable;
