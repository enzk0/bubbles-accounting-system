import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { privateApi } from "../api/BASApi";
import ProcessingMessage from "./ProcessingMessage";

function ProductInfo({ product }) {
    return (
        <div>
            <div className="py-2 px-2 border-b-2 border-slate-500 font-bold">
                <div>PRODUCT INFO</div>
            </div>
            <div className="flex flex-row gap-8 py-2">
                <div className="flex flex-col gap-2">
                    <div>ID</div>
                    <div>NAME</div>
                    <div>PRICE</div>
                </div>
                <div className="flex flex-col gap-2">
                    <div>{product.id}</div>
                    <div>{product.name}</div>
                    <div>{product.price ? product.price.toFixed(2) : ""}</div>
                </div>
            </div>
        </div>
    );
}

function EditProductModal({ id, isVisible, ref, refresh }) {
    const [isProcessing, setIsProcessing] = useState(false);

    const [product, setProduct] = useState({
        id: "",
        name: "",
        price: "",
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
            const response = await privateApi.patch(`/product/${id}`, {
                name: product.name,
                price: product.price,
                isActive: !product.isActive,
            });

            setProduct((prev) => ({ ...prev, [status]: !product[status] }));

            setIsProcessing(false);
            refresh();
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
                const response = await privateApi.get(`/product/${id}`);

                setProduct(response.data);
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
                    Updating Product...
                </ProcessingMessage>
            </div>
            <div className="flex flex-col gap-4">
                <ProductInfo product={product} />
                <div className="flex flex-row gap-4">
                    <button
                        type=""
                        onClick={handleToggleStatus("isActive")}
                        className={`flex-1 p-2 rounded font-bold ${product.isActive ? negativeToggle : positiveToggle}`}
                    >
                        {product.isActive ? "Deactivate" : "Reactivate"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default EditProductModal;
