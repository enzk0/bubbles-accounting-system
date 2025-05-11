import React, { useEffect, useState } from "react";

import Modal from "../components/Modal";
import TextField from "../components/TextField";
import NumberField from "../components/NumberField";

function Table({ products, entries, total, increment, decrement }) {
    const ProductRow = ({ product, entry, increment, decrement }) => (
        <tr className="border-y-1 border-y-slate-300">
            <td>{entry.name}</td>
            <td className="flex flex-row justify-center">
                <NumberField
                    increment={increment}
                    decrement={decrement}
                    value={entries[product.name].load}
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

function CreateModal({ isVisible, ref }) {
    const products = [
        { id: 1, name: "Wash", price: 60.0 },
        { id: 2, name: "Dry", price: 70.0 },
        { id: 3, name: "Detergent", price: 15.0 },
        { id: 4, name: "Fabcon", price: 15.0 },
        { id: 5, name: "Load", price: 20.0 },
        { id: 6, name: "Dropoff", price: 180.0 },
    ];

    const [entries, setEntries] = useState(
        products.reduce((acc, product) => {
            acc[product.name] = {
                id: product.id,
                name: product.name,
                load: 0,
                price: product.price,
                amount: 0.0,
            };
            return acc;
        }, {})
    );
    const [total, setTotal] = useState(0.0);

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
    };

    useEffect(() => {
        setTotal(
            Object.values(entries).reduce((acc, entry) => acc + entry.amount, 0)
        );

        console.log("Entries", entries);
        console.log("Total", total);
    }, [entries]);

    return (
        <Modal isVisible={isVisible} ref={ref}>
            <div></div>
            <div className="flex flex-col gap-4">
                <div>
                    <TextField
                        label="Tag Number"
                        placeholder="Enter Tag Number"
                        type="text"
                        name="job-order-tag-number"
                        className="grow"
                    />
                </div>
                <div className="flex flex-row gap-2">
                    <TextField
                        label="Customer First Name"
                        placeholder="Enter Customer First Name"
                        type="text"
                        name="customer-first-name"
                        className="grow"
                    />
                    <TextField
                        label="Customer Last Name"
                        placeholder="Enter Customer First Name"
                        type="text"
                        name="customer-last-name"
                        className="grow"
                    />
                </div>
                <div>
                    <TextField
                        label="Customer Address"
                        placeholder="Enter Customer Address"
                        type="text"
                        name="customer-address"
                        className="grow"
                    />
                </div>
                <div>
                    <TextField
                        label="Customer Phone Number"
                        placeholder="Enter Customer Phone Number"
                        type="text"
                        name="customer-phone-number"
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
                    >
                        Create
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default CreateModal;
