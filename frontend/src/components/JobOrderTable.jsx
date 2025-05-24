import React from "react";
import { MdEditSquare } from "react-icons/md";
import { IoMdEye } from "react-icons/io";

import { formatDate } from "../utils/date";

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

function JobOrderRow({ jobOrder, openEditModal, openViewModal }) {
    const customer = jobOrder.customer;
    const fullName = `${customer.firstName} ${customer.lastName}`;
    const id = `${jobOrder.idCode}${jobOrder.idNumber}`;

    const createdAt = formatDate(jobOrder.createdAt);
    const paidAt = formatDate(jobOrder.paidAt);
    const claimedAt = formatDate(jobOrder.claimedAt);

    return (
        <tr className="text-center border-b-1 border-slate-300">
            <td>{id}</td>
            <td>{fullName}</td>
            <td className="hidden md:table-cell">{customer.phoneNumber}</td>
            <td className="hidden lg:table-cell">{createdAt}</td>
            <td className="hidden xl:table-cell">{paidAt}</td>
            <td className="hidden xl:table-cell">{claimedAt}</td>
            <td>{jobOrder.total}</td>
            <td className="hidden sm:table-cell">
                <StatusItem
                    status={jobOrder.isPaid}
                    positive={"Paid"}
                    negative={"Unpaid"}
                />
            </td>
            <td className="hidden sm:table-cell">
                <StatusItem
                    status={jobOrder.isClaimed}
                    positive={"Claimed"}
                    negative={"Unclaimed"}
                />
            </td>
            {jobOrder.isPaid && jobOrder.isClaimed ? (
                <td>
                    <button
                        type="button"
                        onClick={() =>
                            openViewModal(jobOrder.idCode, jobOrder.idNumber)
                        }
                        className="p-2 mx-2 rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-400 cursor-pointer"
                    >
                        <IoMdEye />
                    </button>
                </td>
            ) : (
                <td>
                    <button
                        type="button"
                        onClick={() =>
                            openEditModal(jobOrder.idCode, jobOrder.idNumber)
                        }
                        className="p-2 mx-2 rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-400 cursor-pointer"
                    >
                        <MdEditSquare />
                    </button>
                </td>
            )}
        </tr>
    );
}

function JobOrderRows({
    jobOrders,
    page,
    pageRows,
    openEditModal,
    openViewModal,
}) {
    jobOrders = jobOrders.slice(
        0 + pageRows * (page - 1),
        Math.min(jobOrders.length, pageRows * page)
    );

    return jobOrders.map((jobOrder) => (
        <JobOrderRow
            key={`${jobOrder.idCode}${jobOrder.idNumber}`}
            jobOrder={jobOrder}
            openEditModal={openEditModal}
            openViewModal={openViewModal}
        />
    ));
}

function JobOrderTable({
    page,
    pageRows,
    jobOrders,
    openEditModal,
    openViewModal,
}) {
    return (
        <table className="table-auto">
            <thead className="border-y-1 border-slate-300">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th className="hidden md:table-cell">Phone</th>
                    <th className="hidden lg:table-cell">Date</th>
                    <th className="hidden xl:table-cell">Pay Date</th>
                    <th className="hidden xl:table-cell">Claim Date</th>
                    <th>Total</th>
                    <th className="hidden sm:table-cell">Pay Status</th>
                    <th className="hidden sm:table-cell">Claim Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <JobOrderRows
                    jobOrders={jobOrders}
                    page={page}
                    pageRows={pageRows}
                    openEditModal={openEditModal}
                    openViewModal={openViewModal}
                />
            </tbody>
        </table>
    );
}

export default JobOrderTable;
