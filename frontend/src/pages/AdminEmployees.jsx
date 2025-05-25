import React, { useEffect, useState, useRef } from "react";
import { IoAddCircle } from "react-icons/io5";
import EmployeeView from "../components/EmployeeView";
import { privateApi } from "../api/BASApi";
import CreateUserModal from "../components/CreateUserModal";

function AdminEmployees() {
    const createUserModalRef = useRef(null);

    const [refresh, setRefresh] = useState(0);

    const [employees, setEmployees] = useState([]);

    const [visibility, setVisibility] = useState({
        createUserModal: false,
    });

    const [pageRows] = useState(14);

    const handleRefresh = () => {
        setRefresh((prev) => prev + 1);
    };

    const handleOpenCreateUserModal = (e) => {
        setVisibility((prev) => ({
            ...prev,
            createUserModal: true,
        }));
    };

    const handleCloseCreateUserModal = (e) => {
        setVisibility((prev) => ({
            ...prev,
            createUserModal: false,
        }));
    };

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await privateApi.get("/user/all");
                setEmployees(response.data);
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };

        fetchEmployees();
    }, [refresh]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const clickedOutside = {
                createUserModal:
                    createUserModalRef.current &&
                    !createUserModalRef.current.contains(e.target),
            };

            if (clickedOutside.createUserModal) {
                setVisibility((prev) => ({
                    ...prev,
                    createUserModal: false,
                }));
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setVisibility((prev) => ({
                    ...prev,
                    createUserModal: false,
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
            <CreateUserModal
                ref={createUserModalRef}
                isVisible={visibility.createUserModal}
                refresh={handleRefresh}
                close={handleCloseCreateUserModal}
            />
            <div className="flex flex-row mb-2">
                <p className="text-lg font-bold">Employees</p>
                <div className="grow"></div>
                <div>
                    <button
                        onClick={handleOpenCreateUserModal}
                        className="flex flex-row grow items-center gap-2 p-1.5 px-3 rounded-md text-sky-50 font-bold cursor-pointer bg-sky-800 hover:bg-sky-700 active:bg-sky-900"
                    >
                        <IoAddCircle className="text-lg" />
                        <div>New</div>
                    </button>
                </div>
            </div>
            <EmployeeView
                pageRows={pageRows}
                employees={employees}
                refresh={handleRefresh}
            />
        </div>
    );
}

export default AdminEmployees;
