import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/UseAuth";

import { FaCircleUser } from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";
import Dropdown from "./Dropdown";
import DropdownItem from "./DropdownItem";
import { privateApi } from "../api/BASApi";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const [token, setToken] = useAuth();

    const [user, setUser] = useState({});

    const dropdownRef = useRef(null);

    const [visisibility, setVisisibility] = useState({
        profileDropdown: false,
    });

    const handleProfileClick = (e) => {
        console.log("Clieck");
        setVisisibility((prev) => ({
            ...prev,
            profileDropdown: !prev.profileDropdown,
        }));
    };

    const handleLogout = (e) => {
        localStorage.removeItem("token");
        navigate("/employee/login");
    };

    useEffect(() => {
        const fetchSelf = async () => {
            try {
                const response = await privateApi.get("/user/self");
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching current user:", error);
            }
        };

        fetchSelf();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            console.log(dropdownRef.current);
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target) &&
                visisibility.profileDropdown
            ) {
                setVisisibility((prev) => ({
                    ...prev,
                    profileDropdown: false,
                }));
            }
        };

        document.addEventListener("mouseup", handleClickOutside);

        return () => {
            document.removeEventListener("mouseup", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-row p-2 px-4">
            <div className="flex flex-row grow items-center font-bold">
                {`${user.roleId === 1 ? "Admin Account" : "Employee Account"}`}
            </div>
            <div className="flex flex-row grow justify-end items-center gap-4">
                <div>
                    <div className="text-md text-right font-bold">
                        {`${user.firstName ? user.firstName : ""} ${user.lastName ? user.lastName : ""}`}
                    </div>
                    <div className="text-sm text-right">
                        {user.username ? user.username : "username"}
                    </div>
                </div>
                <div className="text-4xl">
                    <FaCircleUser />
                </div>
                <div>
                    <button
                        type="button"
                        onClick={handleProfileClick}
                        className="cursor-pointer p-2 rounded-md hover:bg-sky-200 transition-colors"
                    >
                        <IoMdArrowDropdown />
                    </button>
                    <Dropdown
                        isVisible={visisibility.profileDropdown}
                        ref={dropdownRef}
                    >
                        <DropdownItem title="Log Out" onClick={handleLogout} />
                    </Dropdown>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
