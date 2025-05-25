import React, { useState, useEffect } from "react";

import Modal from "../components/Modal";
import TextField from "../components/TextField";
import { privateApi } from "../api/BASApi";

function CreateBranchModal({ isVisible, ref, refresh, close }) {
    const [form, setForm] = useState({
        code: "",
        name: "",
        address: "",
    });

    const [error, setError] = useState(false);

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleReset = () => {
        setForm({ code: "", name: "", address: "" });
        setError(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.code || !form.name || !form.address) {
            setError(true);
            return;
        }

        try {
            const response = await privateApi.post("/branch", form);
            handleReset();
            refresh();
            close();
        } catch (err) {
            console.error("Error creating branch:", err);
        }
    };

    return (
        <Modal isVisible={isVisible} ref={ref}>
            <div className="flex flex-col gap-4">
                {error && (
                    <div className="p-2 rounded font-bold text-red-600 bg-red-200 text-center">
                        All fields are required!
                    </div>
                )}

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
