import React, { useRef, useState, useEffect } from "react";

import { FaCircleUser } from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";
import Dropdown from "./Dropdown";
import DropdownItem from "./DropdownItem";

function Navbar() {
    const dropdownRef = useRef(null);
    const [visisibility, setVisisibility] = useState({
        profileDropdown: false,
    });

    useEffect(() => {
        const handleClickOutside = (e) => {
            console.log(dropdownRef.current);
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setVisisibility((prev) => ({
                    ...prev,
                    profileDropdown: false,
                }));
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mouseup", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-row p-2 px-4">
            <div className="flex flex-row grow items-center font-bold">
                Admin Account
            </div>
            <div className="flex flex-row grow justify-end items-center gap-4">
                <div>
                    <div className="text-md text-right font-bold">Jane Doe</div>
                    <div className="text-sm text-right">jane_doe</div>
                </div>
                <div className="text-4xl">
                    <FaCircleUser />
                </div>
                <div>
                    <button
                        type="button"
                        onClick={() =>
                            setVisisibility((prev) => ({
                                ...prev,
                                profileDropdown: !prev.profileDropdown,
                            }))
                        }
                        className="cursor-pointer p-2 rounded-md hover:bg-sky-200 transition-colors"
                    >
                        <IoMdArrowDropdown />
                    </button>
                    <Dropdown
                        isVisible={visisibility.profileDropdown}
                        ref={dropdownRef}
                    >
                        <DropdownItem title="Log Out" />
                    </Dropdown>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
