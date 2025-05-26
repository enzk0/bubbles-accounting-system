import React, { useState, useEffect } from "react";

import Modal from "../components/Modal";
import TextField from "../components/TextField";
import { privateApi } from "../api/BASApi";
import ErrorMessage from "./ErrorMessage";
import ProcessingMessage from "./ProcessingMessage";

function CreateBranchModal({ isVisible, ref, refresh, close }) {
    const [isProcessing, setIsProcessing] = useState(false);

    const [form, setForm] = useState({
        code: "",
        name: "",
        address: "",
    });

    const [errors, setErrors] = useState({
        incompleteFields: false,
        notUniqueCode: false,
        generalError: false,
    });

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleReset = () => {
        setForm({ code: "", name: "", address: "" });
        setIsProcessing(false);
        handleErrorReset();
    };

    const handleErrorReset = () => {
        setErrors({ incompleteFields: false });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        handleErrorReset();

        if (!form.code || !form.name || !form.address) {
            setErrors((prev) => ({ ...prev, incompleteFields: true }));
            return;
        }

        try {
            setIsProcessing(true);
            const response = await privateApi.post("/branch", form);
            handleReset();
            refresh();
            close();
        } catch (error) {
            setIsProcessing(false);
            console.error("Error creating branch:", error);
            if (error.response?.status == 500) {
                const errorCode = error.response?.data.error.code;
                if (errorCode === "P2002") {
                    setErrors((prev) => ({ ...prev, notUniqueCode: true }));
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
                <ErrorMessage error={errors.notUniqueCode}>
                    Branch Code is NOT Unique!
                </ErrorMessage>
                <ErrorMessage error={errors.generalError}>
                    Error Creating Branch!
                </ErrorMessage>
                <ProcessingMessage state={isProcessing}>
                    Creating Branch...
                </ProcessingMessage>

                <TextField
                    label="Branch Code"
                    placeholder="Enter Branch Code"
                    value={form.code}
                    onChange={handleChange("code")}
                />

                <TextField
                    label="Branch Name"
                    placeholder="Enter Branch Name"
                    value={form.name}
                    onChange={handleChange("name")}
                />

                <TextField
                    label="Branch Address"
                    placeholder="Enter Branch Address"
                    value={form.address}
                    onChange={handleChange("address")}
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

export default CreateBranchModal;
