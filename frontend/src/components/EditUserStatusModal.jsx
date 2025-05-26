import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { privateApi } from "../api/BASApi";
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

function EditUserStatusModal({ id, isVisible, ref, refresh }) {
    const [isProcessing, setIsProcessing] = useState(false);

    const [user, setUser] = useState({
        id: "",
        username: "",
        firstName: "",
        lastName: "",
        isActive: false,
    });

    const negativeToggle =
        "text-red-900 bg-red-300 hover:bg-red-400 active:bg-red-500 active:text-white cursor-pointer";
    const positiveToggle =
        "text-green-900 bg-green-300 hover:bg-green-400 active:bg-green-500 active:text-white cursor-pointer";

    const handleToggleStatus = () => async (e) => {
        e.preventDefault();

        try {
            setIsProcessing(true);
            await privateApi.patch(`/user/${id}`, {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                isActive: !user.isActive,
            });

            setUser((prev) => ({ ...prev, isActive: !prev.isActive }));
            setIsProcessing(false);
            refresh();
        } catch (error) {
            setIsProcessing(false);
            console.error("Error updating user status: ", error);
        }
    };

    useEffect(() => {
        if (!id) return;

        const fetchUser = async () => {
            try {
                const response = await privateApi.get(`/user/${id}`);
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        };

        fetchUser();
    }, [id]);

    return (
        <Modal isVisible={isVisible} ref={ref} width={"min-w-lg"}>
            <div>
                <ProcessingMessage state={isProcessing}>
                    Updating User Status...
                </ProcessingMessage>
            </div>
            <div className="flex flex-col gap-4">
                <UserInfo user={user} />
                <div className="flex flex-row gap-4">
                    <button
                        onClick={handleToggleStatus()}
                        className={`flex-1 p-2 rounded font-bold ${
                            user.isActive ? negativeToggle : positiveToggle
                        }`}
                    >
                        {user.isActive ? "Deactivate" : "Reactivate"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default EditUserStatusModal;
