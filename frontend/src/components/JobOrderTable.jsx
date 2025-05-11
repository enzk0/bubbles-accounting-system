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

function JobOrderTable({ page, pageRows, jobOrders, openEditModal }) {
    const JobOrderRow = (jobOrder) => {
        const fullName = `${jobOrder.customer.firstName} ${jobOrder.customer.lastName}`;
        const id = `${jobOrder.idCode}${jobOrder.idNumber}`;
        return (
            <tr className="text-center border-b-1 border-slate-300">
                <td>{id}</td>
                <td>{fullName}</td>
                <td className="hidden md:table-cell">
                    {jobOrder.customer.phoneNumber}
                </td>
                <td className="hidden lg:table-cell">{jobOrder.createdAt}</td>
                <td className="hidden xl:table-cell">{jobOrder.paidAt}</td>
                <td className="hidden xl:table-cell">{jobOrder.claimedAt}</td>
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
                {jobOrder.isPaid && jobOrder.isClaimed ? null : (
                    <td>
                        <button
                            type="button"
                            onClick={() =>
                                openEditModal(
                                    `${jobOrder.idCode}${jobOrder.idNumber}`
                                )
                            }
                            className="p-2 mx-2 rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-400 cursor-pointer"
                        >
                            <MdEditSquare />
                        </button>
                    </td>
                )}
            </tr>
        );
    };

    return (
        <table className="table-auto">
            <thead className="border-y-1 border-slate-300">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th className="hidden md:table-cell">Phone Number</th>
                    <th className="hidden lg:table-cell">Date</th>
                    <th className="hidden xl:table-cell">Paid Date</th>
                    <th className="hidden xl:table-cell">Claimed Date</th>
                    <th>Total</th>
                    <th className="hidden sm:table-cell">Payment Status</th>
                    <th className="hidden sm:table-cell">Claimed Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {jobOrders
                    .slice(
                        0 + pageRows * (page - 1),
                        Math.min(jobOrders.length, pageRows * page)
                    )
                    .map((jobOrder) => JobOrderRow(jobOrder))}
            </tbody>
        </table>
    );
}

export default JobOrderTable;
