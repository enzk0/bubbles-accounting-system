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

function ProductRow({ product, openEditModal }) {
    return (
        <tr className="text-center border-b border-slate-300">
            <td>{product.id}</td>
            <td>{product.name}</td>
            <td>{product.price.toFixed(2)}</td>
            <td className="hidden sm:table-cell">
                <StatusItem
                    status={product.isActive}
                    positive={"Active"}
                    negative={"Inactive"}
                />
            </td>
            <td>
                <button
                    type="button"
                    onClick={() => openEditModal(product.id)}
                    className="p-2 mx-2 rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-400 cursor-pointer"
                >
                    <MdEditSquare />
                </button>
            </td>
        </tr>
    );
}

function ProductRows({ products, page, pageRows, openEditModal }) {
    const start = (page - 1) * pageRows;
    const paginated = products.slice(start, start + pageRows);

    return paginated.map((product) => (
        <ProductRow
            key={product.id}
            product={product}
            openEditModal={openEditModal}
        />
    ));
}

function ProductTable({ products, page, pageRows, openEditModal }) {
    return (
        <table className="table-auto w-full">
            <thead className="border-y border-slate-300">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <ProductRows
                    products={products}
                    page={page}
                    pageRows={pageRows}
                    openEditModal={openEditModal}
                />
            </tbody>
        </table>
    );
}

export default ProductTable;
