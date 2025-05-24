import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { privateApi } from "../api/BASApi";

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

function ViewModal({ idCode, idNumber, isVisible, ref }) {
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

    useEffect(() => {
        if (!idCode || !idNumber) {
            return;
        }

        try {
            const fetchJobOrder = async () => {
                const response = await privateApi.get(
                    `/job-order?idCode=${idCode}&idNumber=${idNumber}`
                );

                setJobOrder(response.data);
            };

            fetchJobOrder();
        } catch (error) {
            console.error("Error fetching job order: ", error);
        }
    }, [idCode, idNumber]);

    return (
        <Modal isVisible={isVisible} ref={ref} width={"min-w-lg"}>
            <div className="flex flex-col gap-4">
                <JobOrderInfo jobOrder={jobOrder} />
                <CustomerInfo customer={jobOrder.customer} />
                <ItemsTable items={jobOrder.jobOrderItems} />
            </div>
        </Modal>
    );
}

export default ViewModal;
