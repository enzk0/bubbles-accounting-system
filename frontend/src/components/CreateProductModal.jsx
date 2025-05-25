import React, { useState } from "react";

import Modal from "../components/Modal";
import TextField from "../components/TextField";
import { privateApi } from "../api/BASApi";

function CreateProductModal({ isVisible, ref, refresh, close }) {
    const [form, setForm] = useState({
        name: "",
        price: "",
    });

    const [error, setError] = useState(false);

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        setError(false);
    };

    const handleReset = () => {
        setForm({ name: "", price: "" });
        setError(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, price } = form;

        if (!name || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
            setError(true);
            return;
        }

        try {
            await privateApi.post("/product", {
                name: name.trim(),
                price: parseFloat(price),
            });

            console.log("Product created successfully");
            handleReset();
            refresh();
            close();
        } catch (err) {
            console.error("Error creating product:", err);
        }
    };

    return (
        <Modal isVisible={isVisible} ref={ref}>
            <div className="flex flex-col gap-4">
                {error && (
                    <div className="p-2 rounded font-bold text-red-600 bg-red-200 text-center">
                        All fields are required and price must be a valid
                        number!
                    </div>
                )}

                <TextField
                    label="Product Name"
                    placeholder="Enter Product Name"
                    value={form.name}
                    onChange={handleChange("name")}
                />

                <TextField
                    label="Product Price"
                    placeholder="Enter Product Price"
                    type="number"
                    value={form.price}
                    onChange={handleChange("price")}
                />

                <div className="flex flex-row">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="p-2 px-4 rounded text-white bg-red-500 font-bold"
                    >
                        Clear
                    </button>
                    <div className="grow"></div>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="p-2 px-4 rounded text-white bg-sky-800 font-bold"
                    >
                        Create
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default CreateProductModal;
