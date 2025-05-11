import React, { useEffect, useState } from "react";

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

