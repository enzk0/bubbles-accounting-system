import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { privateApi } from "../api/BASApi";
import TextField from "./TextField";
import ErrorMessage from "./ErrorMessage";
import ProcessingMessage from "./ProcessingMessage";

function UserInfo({ user }) {
    return (
        <div>
            <div className="py-2 px-2 border-b-2 border-slate-500 font-bold">
                <div>USER INFO</div>
            </div>
            <div className="flex flex-row gap-8 py-2">
                <div className="flex flex-col gap-2">
                    <div>ID</div>
                    <div>USERNAME</div>
                    <div>NAME</div>
                </div>
                <div className="flex flex-col gap-2">
                    <div>{user.id}</div>
                    <div>{user.username}</div>
                    <div>{`${user.firstName} ${user.lastName}`}</div>
                </div>
            </div>
        </div>
    );
}

function EditPasswordModal({ id, isVisible, ref, refresh, close }) {
    const [isProcessing, setIsProcessing] = useState(false);

    const [user, setUser] = useState({
        id: "",
        username: "",
        firstName: "",
        lastName: "",
    });

    const [form, setForm] = useState({
        password: "",
        confirm: "",
    });

    const [errors, setErrors] = useState({
        noInputError: false,
        confirmError: false,
    });

    const handleResetErrors = () => {
        setErrors({ noInputError: false, confirmError: false });
    };

    const handleSubmit = async () => {
        handleResetErrors();

        if (!form.password || !form.confirm) {
            console.error("No Password or Confirm Provided!");
            setErrors((prev) => ({ ...prev, noInputError: true }));
            return;
        }

        if (form.password != form.confirm) {
            console.error("Entered password does not match confirm password!");
            setErrors((prev) => ({ ...prev, confirmError: true }));
            return;
        }

        try {
            setIsProcessing(true);
            const response = await privateApi.patch(`/user/password/${id}`, {
                password: form.password,
            });

            console.log("Password Changed!");
            refresh();
            handleReset();
        } catch (error) {
            console.error("Error changing password:", error);
            setIsProcessing(false);
        }
    };

    const handleReset = () => {
        setForm({ password: "", confirm: "" });
        setIsProcessing(false);
        handleResetErrors();
        close();
    };

    const handleFormChange = (field) => (e) => {
        const { value } = e.target;
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    useEffect(() => {
        if (!id) {
            return;
        }

        try {
            const fetchUser = async () => {
                const response = await privateApi.get(`/user/${id}`);

                setUser(response.data);
            };

            fetchUser();
        } catch (error) {
            console.error("Error fetching user information: ", error);
        }

        handleReset();
    }, [id]);

    return (
        <Modal isVisible={isVisible} ref={ref} width={"min-w-lg"}>
            <div>
                <ErrorMessage error={errors.noInputError}>
                    No Password Entered!
                </ErrorMessage>
                <ErrorMessage error={errors.confirmError}>
                    Password does not match Confirm Password!
                </ErrorMessage>

                <ProcessingMessage state={isProcessing}>
                    Updating User Password...
                </ProcessingMessage>
            </div>
            <div className="flex flex-col gap-4">
                <UserInfo user={user} />
                <TextField
                    label="New Password"
                    placeholder="Enter New Password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleFormChange("password")}
                    className="grow"
                />
                <TextField
                    label="Confirm Password"
                    placeholder="Enter Confirmed Password"
                    type="password"
                    name="confim"
                    value={form.confirm}
                    onChange={handleFormChange("confirm")}
                    className="grow"
                />
                <div className="flex flex-row gap-4">
                    <button
                        type=""
                        onClick={handleReset}
                        className="p-2 px-4 rounded text-white bg-red-500 font-bold"
                    >
                        Cancel
                    </button>
                    <div className="grow"></div>
                    <button
                        type=""
                        onClick={handleSubmit}
                        className="p-2 px-4 rounded text-white bg-sky-800 font-bold"
                    >
                        Change
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default EditPasswordModal;
