import React, { useEffect, useState } from "react";

import Modal from "../components/Modal";
import TextField from "../components/TextField";
import { privateApi } from "../api/BASApi";
import { useAuth } from "../hooks/UseAuth";

function CreateUserModal({ isVisible, ref, refresh, close }) {
    const [token, setToken] = useAuth();

    const [form, setForm] = useState({
        username: "",
        firstName: "",
        lastName: "",
        password: "",
        branchId: "",
        roleId: "",
    });

    const [error, setError] = useState(false);

    const handleChange = (field) => (e) => {
        setForm((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
        setError(false);
    };

    const handleReset = () => {
        setForm({
            username: "",
            firstName: "",
            lastName: "",
            password: "",
            branchId: "",
            roleId: "",
        });
        setError(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { username, firstName, lastName, password, branchId, roleId } =
            form;

        if (
            !username ||
            !firstName ||
            !lastName ||
            !password ||
            !branchId ||
            !roleId
        ) {
            setError(true);
            return;
        }

        try {
            await privateApi.post("/user", {
                user: {
                    username: username.trim(),
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    password: password,
                    branchId: parseInt(branchId),
                    roleId: parseInt(roleId),
                },
            });

            console.log("Employee created successfully");
            handleReset();
            refresh();
            close();
        } catch (err) {
            console.error("Error creating employee:", err);
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
                    label="Username"
                    placeholder="Enter Username"
                    value={form.username}
                    onChange={handleChange("username")}
                />

                <div className="flex flex-row gap-4">
                    <TextField
                        label="First Name"
                        placeholder="Enter First Name"
                        value={form.firstName}
                        onChange={handleChange("firstName")}
                        className="grow"
                    />
                    <TextField
                        label="Last Name"
                        placeholder="Enter Last Name"
                        value={form.lastName}
                        onChange={handleChange("lastName")}
                        className="grow"
                    />
                </div>

                <TextField
                    label="Password"
                    placeholder="Enter Password"
                    type="password"
                    value={form.password}
                    onChange={handleChange("password")}
                />

                <div className="flex flex-row gap-4">
                    <TextField
                        label="Branch ID"
                        placeholder="Enter Branch ID"
                        type="number"
                        value={form.branchId}
                        onChange={handleChange("branchId")}
                        className="grow"
                    />
                    <TextField
                        label="Role ID"
                        placeholder="Enter Role ID"
                        type="number"
                        value={form.roleId}
                        onChange={handleChange("roleId")}
                        className="grow"
                    />
                </div>

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

export default CreateUserModal;
