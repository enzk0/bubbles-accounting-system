import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { privateApi } from "../api/BASApi";

import ProcessingMessage from "./ProcessingMessage";

function ItemsTableRow({ item }) {
    const amount = item.productPrice * item.productQuantity;
    return (
        <tr className="border-y-1 border-y-slate-300 text-center">
            <td className="text-left">{item.productName}</td>
            <td>{item.productQuantity}</td>
            <td>{item.productPrice.toFixed(2)}</td>
            <td>{amount.toFixed(2)}</td>
        </tr>
    );
}

function ItemsTable({ items }) {
    const total = items.reduce(
        (acc, curr) => acc + curr.productPrice * curr.productQuantity,
        0
    );
    return (
        <table className="table-auto">
            <thead>
                <tr className="border-b-2 border-b-slate-500">
                    <th className="text-left">PRODUCT</th>
                    <th>LOADS</th>
                    <th>PRICE</th>
                    <th>AMOUNT</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item) => (
                    <ItemsTableRow item={item} />
                ))}
                <tr>
                    <td className="font-bold">TOTAL</td>
                    <td></td>
                    <td></td>
                    <td className="text-center font-bold">
                        {total.toFixed(2)}
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

function CustomerInfo({ customer }) {
    const fullName = `${customer.firstName} ${customer.lastName}`;
    const address = customer.address ? customer.address : "N/A";
    const phoneNumber = customer.phoneNumber ? customer.phoneNumber : "N/A";

    return (
        <div>
            <div className="py-2 px-2 border-b-2 border-slate-500 font-bold">
                CUSTOMER INFO
            </div>
            <div className="flex flex-row gap-8 py-2">
                <div className="flex flex-col gap-2">
                    <div>NAME</div>
                    <div>ADDRESS</div>
                    <div>PHONE</div>
                </div>
                <div className="flex flex-col gap-2">
                    <div>{fullName}</div>
                    <div>{address}</div>
                    <div>{phoneNumber}</div>
                </div>
            </div>
        </div>
    );
}

function JobOrderInfo({ jobOrder }) {
    const id = `${jobOrder.idCode}${jobOrder.idNumber}`;

    return (
        <div>
            <div className="py-2 px-2 border-b-2 border-slate-500 font-bold">
                <div>JOB ORDER INFO</div>
            </div>
            <div className="flex flex-row gap-8 py-2">
                <div className="flex flex-col gap-2">
                    <div>ID</div>
                </div>
                <div className="flex flex-col gap-2">
                    <div>{id}</div>
                </div>
            </div>
        </div>
    );
}

function EditModal({ idCode, idNumber, isVisible, ref, refresh }) {
    const [isProcessing, setIsProcessing] = useState(false);

    const [jobOrder, setJobOrder] = useState({
        idCode: "",
        idNumber: 0,
        customer: {
            firstName: "",
            lastName: "",
            address: "",
            phoneNumber: "",
        },
        jobOrderItems: [],
    });
    const [disabled, setDisabled] = useState(false);

    const negativeToggle =
        "text-red-900 bg-red-300 hover:bg-red-400 active:bg-red-500 active:text-white cursor-pointer";
    const positiveToggle =
        "text-green-900 bg-green-300 hover:bg-green-400 active:bg-green-500 active:text-white cursor-pointer";
    const disable =
        "text-slate-800 bg-slate-300 hover:bg-slate-300 active:bg-slate-300 active:text-slate-800";

    const applyStyle = (condition) => {
        if (disabled) {
            return disable;
        }

        if (condition) {
            return negativeToggle;
        }

        if (!condition) {
            return positiveToggle;
        }
    };

    const handleToggleStatus = (status) => async (e) => {
        e.preventDefault();

        if (jobOrder.isPaid === true && jobOrder.isClaimed === true) {
            setDisabled(true);
            return;
        }

        try {
            setIsProcessing(true);
            await privateApi.patch(
                `/job-order/status?idCode=${jobOrder.idCode}&idNumber=${jobOrder.idNumber}`,
                {
                    [status]: !jobOrder[status],
                }
            );

            setJobOrder((prev) => ({ ...prev, [status]: !jobOrder[status] }));

            setIsProcessing(false);
            refresh();
        } catch (error) {
            setIsProcessing(false);
            console.log("Error updating the job order status: ", error);
        }
    };

    useEffect(() => {
        if (!idCode || !idNumber) {
            return;
        }

        setDisabled(false);
        setIsProcessing(false);

        try {
            const fetchJobOrder = async () => {
                const response = await privateApi.get(
                    `/job-order?idCode=${idCode}&idNumber=${idNumber}`
                );

                setJobOrder(response.data);
                console.log(response.data);
            };

            fetchJobOrder();
        } catch (error) {
            console.error("Error fetching job order: ", error);
        }
    }, [idCode, idNumber]);

    return (
        <Modal isVisible={isVisible} ref={ref} width={"min-w-lg"}>
            <div>
                <ProcessingMessage state={isProcessing}>
                    Updating Job Order...
                </ProcessingMessage>
            </div>
            <div className="flex flex-col gap-4">
                <JobOrderInfo jobOrder={jobOrder} />
                <CustomerInfo customer={jobOrder.customer} />
                <ItemsTable items={jobOrder.jobOrderItems} />
                <div className="flex flex-row gap-4">
                    <button
                        type=""
                        onClick={handleToggleStatus("isPaid")}
                        className={`flex-1 p-2 rounded font-bold ${applyStyle(jobOrder.isPaid)}`}
                    >
                        {jobOrder.isPaid ? "Set Unpaid" : "Set Paid"}
                    </button>
                    <button
                        type=""
                        onClick={handleToggleStatus("isClaimed")}
                        className={`flex-1 p-2 rounded font-bold ${applyStyle(jobOrder.isClaimed)}`}
                    >
                        {jobOrder.isClaimed ? "Set Unclaimed" : "Set Claimed"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default EditModal;
