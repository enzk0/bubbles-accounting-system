import React, { useEffect, useState, useRef } from "react";
import { IoAddCircle } from "react-icons/io5";
import ProductView from "../components/ProductView";
import { privateApi } from "../api/BASApi";
import CreateProductModal from "../components/CreateProductModal";

function AdminProducts() {
    const createProductModalRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [pageRows] = useState(14);

    const [refresh, setRefresh] = useState(0);

    const [visibility, setVisibility] = useState({
        createProductModal: false,
    });

    const handleRefresh = () => {
        setRefresh((prev) => prev + 1);
    };

    const handleOpenCreateProductModal = (e) => {
        setVisibility((prev) => ({
            ...prev,
            createProductModal: true,
        }));
    };

    const handleCloseCreateProductModal = (e) => {
        setVisibility((prev) => ({
            ...prev,
            createProductModal: false,
        }));
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await privateApi.get("/product/all");
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, [refresh]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const clickedOutside = {
                createProductModal:
                    createProductModalRef.current &&
                    !createProductModalRef.current.contains(e.target),
            };

            if (clickedOutside.createProductModal) {
                setVisibility((prev) => ({
                    ...prev,
                    createProductModal: false,
                }));
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setVisibility((prev) => ({
                    ...prev,
                    createProductModal: false,
                }));
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className="p-8 pt-2 mt-4">
            <CreateProductModal
                ref={createProductModalRef}
                isVisible={visibility.createProductModal}
                refresh={handleRefresh}
                close={handleCloseCreateProductModal}
            />
            <div className="flex flex-row mb-2">
                <p className="text-lg font-bold">Products</p>
                <div className="grow"></div>
                <div>
                    <button
                        onClick={handleOpenCreateProductModal}
                        className="flex flex-row grow items-center gap-2 p-1.5 px-3 rounded-md text-sky-50 font-bold cursor-pointer bg-sky-800 hover:bg-sky-700 active:bg-sky-900"
                    >
                        <IoAddCircle className="text-lg" />
                        <div>New</div>
                    </button>
                </div>
            </div>
            <ProductView
                pageRows={pageRows}
                products={products}
                refresh={handleRefresh}
            />
        </div>
    );
}

export default AdminProducts;
