import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { privateApi } from "../api/BASApi";
import ProcessingMessage from "./ProcessingMessage";

function BranchInfo({ branch }) {
    return (
        <div>
            <div className="py-2 px-2 border-b-2 border-slate-500 font-bold">
                <div>BRANCH INFO</div>
            </div>
            <div className="flex flex-row gap-8 py-2">
                <div className="flex flex-col gap-2">
                    <div>ID</div>
                    <div>CODE</div>
                    <div>NAME</div>
                    <div>ADDRESS</div>
                </div>
                <div className="flex flex-col gap-2">
                    <div>{branch.id}</div>
                    <div>{branch.code}</div>
                    <div>{branch.name}</div>
                    <div>{branch.address}</div>
                </div>
            </div>
        </div>
    );
}

function EditBranchModal({ id, isVisible, ref, refresh }) {
    const [isProcessing, setIsProcessing] = useState(false);

    const [branch, setBranch] = useState({
        id: "",
        code: "",
        name: "",
        address: "",
        isActive: "",
    });

    const negativeToggle =
        "text-red-900 bg-red-300 hover:bg-red-400 active:bg-red-500 active:text-white cursor-pointer";
    const positiveToggle =
        "text-green-900 bg-green-300 hover:bg-green-400 active:bg-green-500 active:text-white cursor-pointer";

    const handleToggleStatus = (status) => async (e) => {
        e.preventDefault();

        try {
            setIsProcessing(true);
            const response = await privateApi.patch(`/branch/${id}`, {
                name: branch.name,
                address: branch.address,
                isActive: !branch.isActive,
            });

            setBranch((prev) => ({ ...prev, [status]: !branch[status] }));

            refresh();
            setIsProcessing(false);
        } catch (error) {
            setIsProcessing(false);
            console.log("Error updating the branch status: ", error);
        }
    };

    useEffect(() => {
        if (!id) {
            return;
        }

        try {
            const fetchBranch = async () => {
                const response = await privateApi.get(`/branch/${id}`);

                setBranch(response.data);
            };

            fetchBranch();
        } catch (error) {
            console.error("Error fetching job order: ", error);
        }
    }, [id]);

    return (
        <Modal isVisible={isVisible} ref={ref} width={"min-w-lg"}>
            <div>
                <ProcessingMessage state={isProcessing}>
                    Updating Branch...
                </ProcessingMessage>
            </div>
            <div className="flex flex-col gap-4">
                <BranchInfo branch={branch} />
                <div className="flex flex-row gap-4">
                    <button
                        type=""
                        onClick={handleToggleStatus("isActive")}
                        className={`flex-1 p-2 rounded font-bold ${branch.isActive ? negativeToggle : positiveToggle}`}
                    >
                        {branch.isActive ? "Deactivate" : "Reactivate"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default EditBranchModal;
