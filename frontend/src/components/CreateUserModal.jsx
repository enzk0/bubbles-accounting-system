import React, { useEffect, useState } from "react";

import Modal from "../components/Modal";
import TextField from "../components/TextField";
import { privateApi } from "../api/BASApi";
import { useAuth } from "../hooks/UseAuth";
import ErrorMessage from "./ErrorMessage";
import ProcessingMessage from "./ProcessingMessage";

function CreateUserModal({ isVisible, ref, refresh, close }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [token, setToken] = useAuth();

    const [form, setForm] = useState({
        username: "",
        firstName: "",
        lastName: "",
        password: "",
        branchId: "",
        roleId: "",
    });

    const [errors, setErrors] = useState({
        incompleteFields: false,
        noUniqueUsername: false,
        invalidBranchRole: false,
        generalError: false,
    });

    const handleChange = (field) => (e) => {
        setForm((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
        handleErrorReset();
    };

    const handleErrorReset = () => {
        setErrors({
            incompleteFields: false,
            noUniqueUsername: false,
            invalidBranchRole: false,
            generalError: false,
        });
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
        setIsProcessing(false);
        handleErrorReset();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        handleErrorReset();

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
            setErrors((prev) => ({ ...prev, incompleteFields: true }));
            return;
        }

        try {
            setIsProcessing(true);
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
        } catch (error) {
            setIsProcessing(false);
            console.error("Error creating employee:", error);
            if (error.response?.status == 500) {
                const errorCode = error.response?.data.error.code;
                if (errorCode === "P2002") {
                    setErrors((prev) => ({ ...prev, noUniqueUsername: true }));
                    return;
                }
                if (errorCode === "P2003") {
                    setErrors((prev) => ({ ...prev, invalidBranchRole: true }));
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
            <div>
                <ErrorMessage error={errors.incompleteFields}>
                    All Fields are Required!
                </ErrorMessage>
                <ErrorMessage error={errors.noUniqueUsername}>
                    Username is not Unique!
                </ErrorMessage>
                <ErrorMessage error={errors.invalidBranchRole}>
                    Branch or Role is Invalid!
                </ErrorMessage>
                <ErrorMessage error={errors.generalError}>
                    Error Creating User!
                </ErrorMessage>
                <ProcessingMessage state={isProcessing}>
                    Creating User...
                </ProcessingMessage>
            </div>
            <div className="flex flex-col gap-4">
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
