import React, { useEffect, useState } from "react";

import Modal from "../components/Modal";
import TextField from "../components/TextField";
import { privateApi } from "../api/BASApi";
import ErrorMessage from "./ErrorMessage";
import ProcessingMessage from "./ProcessingMessage";

function CreateProductModal({ isVisible, ref, refresh, close }) {
    const [isProcessing, setIsProcessing] = useState(false);

    const [form, setForm] = useState({
        name: "",
        price: "",
    });

    const [errors, setErrors] = useState({
        incompleteFields: false,
        notUniqueName: false,
        generalError: false,
    });

    const handleChange = (field) => (e) => {
        const { value } = e.target;

        if (!/^\d*$/.test(value) && field === "price") {
            return;
        }

        let final = value;

        if (field === "name") {
            final = final.toUpperCase();
        }

        setForm((prev) => ({ ...prev, [field]: final }));
        setErrors(false);
    };

    const handleReset = () => {
        setForm({ name: "", price: "" });
        setIsProcessing(false);
        setErrors(false);
    };

    const handleErrorReset = () => {
        setErrors({
            incompleteFields: false,
            notUniqueName: false,
            generalError: false,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        handleErrorReset();

        const { name, price } = form;

        if (!name || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
            setErrors((prev) => ({ ...prev, incompleteFields: true }));
            return;
        }

        try {
            setIsProcessing(true);
            await privateApi.post("/product", {
                name: name.trim(),
                price: parseFloat(price),
            });

            console.log("Product created successfully");
            handleReset();
            refresh();
            close();
        } catch (err) {
            setIsProcessing(false);
            console.error("Error creating product:", err);
            if (errors.response?.status == 500) {
                const errorCode = errors.response?.data.error.code;
                if (errorCode === "P2002") {
                    setErrors((prev) => ({ ...prev, notUniqueName: true }));
                    return;
                }
                setErrors((prev) => ({ ...prev, generalError: true }));
            }
        }
    };

    useEffect(() => {
        handleReset();
    }, [isVisible]);

    return (
        <Modal isVisible={isVisible} ref={ref}>
            <div className="flex flex-col gap-4">
                <ErrorMessage error={errors.incompleteFields}>
                    All Fields are Required!
                </ErrorMessage>
                <ErrorMessage error={errors.notUniqueName}>
                    Product Name is NOT Unique!
                </ErrorMessage>
                <ErrorMessage error={errors.generalError}>
                    Error Creating Product!
                </ErrorMessage>
                <ProcessingMessage state={isProcessing}>
                    Creating Product...
                </ProcessingMessage>

                <TextField
                    label="Product Name"
                    placeholder="Enter Product Name"
                    value={form.name}
                    onChange={handleChange("name")}
                />

                <TextField
                    label="Product Price"
                    placeholder="Enter Product Price"
                    type="text"
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
