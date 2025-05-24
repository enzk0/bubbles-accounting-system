import React, { useEffect, useState } from "react";

import Modal from "../components/Modal";
import TextField from "../components/TextField";
import NumberField from "../components/NumberField";
import { useAuth } from "../hooks/UseAuth";
import axios from "axios";
import { privateApi } from "../api/BASApi";

function Table({ products, entries, total, increment, decrement }) {
    const ProductRow = ({ product, entry, increment, decrement }) => (
        <tr className="border-y-1 border-y-slate-300">
            <td>{entry.name}</td>
            <td className="flex flex-row justify-center">
                <NumberField
                    increment={increment}
                    decrement={decrement}
                    value={entries[product.name].load}
                    readOnly={true}
                />
            </td>
            <td>{entry.price.toFixed(2)}</td>
            <td colSpan={2}>{entry.amount.toFixed(2)}</td>
        </tr>
    );

    return (
        <table className="table-auto w-full">
            <thead>
                <tr>
                    <th className="text-left">Product</th>
                    <th>Load</th>
                    <th className="text-left">Price</th>
                    <th colSpan={2} className="text-left min-w-24">
                        Amount
                    </th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => {
                    const entry = entries[product.name];
                    return (
                        <ProductRow
                            product={product}
                            entry={entry}
                            increment={() => increment(product.name)}
                            decrement={() => decrement(product.name)}
                            key={product.name}
                        />
                    );
                })}
                <tr className="font-bold">
                    <td>Total</td>
                    <td colSpan={2}></td>
                    <td colSpan={2}>{total.toFixed(2)}</td>
                </tr>
            </tbody>
        </table>
    );
}

function CreateModal({ isVisible, ref, refresh, close }) {
    const [token, setToken] = useAuth();

    const [errors, setErrors] = useState({
        tagError: false,
        customerError: false,
    });

    const [products, setProducts] = useState([]);
    const [entries, setEntries] = useState([]);
    const [total, setTotal] = useState(0.0);

    const [form, setForm] = useState({
        jobOrder: {
            tagNo: "",
        },
        customer: {
            firstName: "",
            lastName: "",
            address: "",
            phoneNumber: "",
        },
    });

    const handleErrorReset = () => {
        setErrors((prev) => ({ tagError: false, customerError: false }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.jobOrder.tagNo || Number(form.jobOrder.tagNo) === NaN) {
            setErrors((prev) => ({ ...prev, tagError: true }));
            return;
        }

        if (!form.customer.firstName || !form.customer.lastName) {
            setErrors((prev) => ({ ...prev, customerError: true }));
            return;
        }

        try {
            let response = await privateApi.get("/user/self");

            const user = response.data;

            let jobOrderData = {
                branch: {
                    id: user.branchId,
                },
                customer: form.customer,
                jobOrder: {
                    items: [],
                },
            };

            jobOrderData.jobOrder.items = Object.values(entries).map(
                (entry) => {
                    return {
                        productId: entry.id,
                        productName: entry.name,
                        productPrice: entry.price,
                        productQuantity: entry.load,
                    };
                }
            );

            response = await privateApi.post("/job-order", jobOrderData);
            console.log("Successfully created job order");
            handleReset();
            refresh();
            close();
        } catch (error) {
            console.error("Error submitting job order:", error);
        }
    };

    const handleFormChange = (section, field) => (e) => {
        const { value } = e.target;
        setForm((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
        console.log(form);
    };

    const handleIncrement = (name) => {
        setEntries((prev) => {
            const current = prev[name];
            const load = Math.min(current.load + 1, Infinity);
            const amount = current.price * load;

            return {
                ...prev,
                [name]: { ...current, load: load, amount: amount },
            };
        });
    };

    const handleDecrement = (name) => {
        setEntries((prev) => {
            const current = prev[name];
            const load = Math.max(current.load - 1, 0);
            const amount = current.price * load;

            return {
                ...prev,
                [name]: { ...current, load: load, amount: amount },
            };
        });
    };
    const handleReset = () => {
        const reset = Object.fromEntries(
            Object.entries(entries).map(([key, value]) => [
                key,
                { ...value, load: 0, amount: 0 },
            ])
        );
        setEntries(reset);
        setForm({
            jobOrder: {
                tagNo: "",
            },
            customer: {
                firstName: "",
                lastName: "",
                address: "",
                phoneNumber: "",
            },
        });
        handleErrorReset();
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await privateApi.get(
                    "/product/all?isActive=true"
                );

                setProducts(response.data);

                const entries = response.data.reduce((acc, product) => {
                    acc[product.name] = {
                        id: product.id,
                        name: product.name,
                        load: 0,
                        price: product.price,
                        amount: 0.0,
                    };
                    return acc;
                }, {});

                setEntries(entries);
            } catch (error) {
                console.error("Error fetching job orders:", error);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        setTotal(
            Object.values(entries).reduce((acc, entry) => acc + entry.amount, 0)
        );
    }, [entries]);

    return (
        <Modal isVisible={isVisible} ref={ref}>
            <div></div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 text-center">
                    <div
                        className={`p-2 rounded font-bold text-red-600 bg-red-200 ${errors.tagError ? "" : "hidden"}`}
                    >
                        Invalid Tag Number!
                    </div>
                    <div
                        className={`p-2 rounded font-bold text-red-600 bg-red-200 ${errors.customerError ? "" : "hidden"}`}
                    >
                        Customer Name is Empty!
                    </div>
                </div>
                <div>
                    <TextField
                        label="Tag Number"
                        placeholder="Enter Tag Number"
                        type="number"
                        name="job-order-tag-number"
                        className="grow"
                        value={form.jobOrder.tagNo}
                        onChange={handleFormChange("jobOrder", "tagNo")}
                    />
                </div>
                <div className="flex flex-row gap-8">
                    <TextField
                        label="Customer First Name"
                        placeholder="Enter Customer First Name"
                        type="text"
                        name="customer-first-name"
                        value={form.customer.firstName}
                        onChange={handleFormChange("customer", "firstName")}
                        className="grow"
                    />
                    <TextField
                        label="Customer Last Name"
                        placeholder="Enter Customer Last Name"
                        type="text"
                        name="customer-last-name"
                        value={form.customer.lastName}
                        onChange={handleFormChange("customer", "lastName")}
                        className="grow"
                    />
                </div>
                <div className="flex flex-row gap-8">
                    <TextField
                        label="Customer Address"
                        placeholder="Enter Customer Address"
                        type="text"
                        name="customer-address"
                        value={form.customer.address}
                        onChange={handleFormChange("customer", "address")}
                        className="grow"
                    />
                    <TextField
                        label="Customer Phone Number"
                        placeholder="Enter Customer Phone Number"
                        type="text"
                        name="customer-phone-number"
                        value={form.customer.phoneNumber}
                        onChange={handleFormChange("customer", "phoneNumber")}
                        className="grow"
                    />
                </div>
                <div>
                    <Table
                        products={products}
                        entries={entries}
                        total={total}
                        increment={handleIncrement}
                        decrement={handleDecrement}
                    />
                </div>
                <div className="flex flex-row">
                    <button
                        type="button"
                        onClick={() => handleReset()}
                        className="p-2 px-4 rounded text-white bg-red-500 font-bold"
                    >
                        Clear
                    </button>
                    <div className="grow"></div>
                    <button
                        type="button"
                        className="p-2 px-4 rounded text-white bg-sky-800 font-bold"
                        onClick={handleSubmit}
                    >
                        Create
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default CreateModal;
