import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { privateApi } from "../api/BASApi";
import TextField from "./TextField";

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

function EditUserBranchModal({ id, isVisible, ref, refresh, close }) {
    const [user, setUser] = useState({
        id: "",
        username: "",
        firstName: "",
        lastName: "",
    });

    const [form, setForm] = useState({
        branchId: "",
    });

    const handleFormChange = (field) => (e) => {
        const { value } = e.target;
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!form.branchId) {
            console.error("No Branch ID Provided!");
            return;
        }

        try {
            await privateApi.patch(`/user/${id}`, {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                branchId: parseInt(form.branchId),
            });

            const userResponse = await privateApi.get(`/user/${id}`);

            console.log(userResponse.data);

            console.log("Branch ID Updated!");
            refresh();
            handleReset();
        } catch (error) {
            console.error("Error changing branch ID:", error);
        }
    };

    const handleReset = () => {
        setForm({ branchId: "" });
        close();
    };

    useEffect(() => {
        if (!id) return;

        const fetchUser = async () => {
            try {
                const response = await privateApi.get(`/user/${id}`);
                console.log(response.data);
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user: ", error);
            }
        };

        fetchUser();
    }, [id]);

    return (
        <Modal isVisible={isVisible} ref={ref} width={"min-w-lg"}>
            <div className="flex flex-col gap-4">
                <UserInfo user={user} />

                <TextField
                    label="New Branch ID"
                    placeholder="Enter Branch ID"
                    type="number"
                    name="branchId"
                    value={form.branchId}
                    onChange={handleFormChange("branchId")}
                    className="grow"
                />

                <div className="flex flex-row gap-4">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="p-2 px-4 rounded text-white bg-red-500 font-bold"
                    >
                        Cancel
                    </button>
                    <div className="grow"></div>
                    <button
                        type="button"
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

export default EditUserBranchModal;
