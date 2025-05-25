import React from "react";

import { Outlet, useLocation } from "react-router-dom";
import {
    IoHome,
    IoReceipt,
    IoHourglass,
    IoCheckbox,
    IoPeople,
} from "react-icons/io5";
import { FaShop } from "react-icons/fa6";
import { FiShoppingBag } from "react-icons/fi";

import Sidebar from "./Sidebar";
import SidebarItem from "./SidebarItem";
import Navbar from "./Navbar";

function AdminLayout() {
    const location = useLocation();
    const isDisabled = location.pathname === "/admin/login";

    return (
        <div className="w-screen flex flex-row">
            {isDisabled ? null : (
                <Sidebar>
                    <SidebarItem icon={<IoHome />} text="Home" to="/admin" />
                    <SidebarItem
                        icon={<IoReceipt />}
                        text="Job Orders"
                        to="/admin/job_orders"
                    />
                    <SidebarItem
                        icon={<IoPeople />}
                        text={"Employees"}
                        to="/admin/employees"
                    />
                    <SidebarItem
                        icon={<FaShop />}
                        text={"Branches"}
                        to="/admin/branches"
                    />
                    <SidebarItem
                        icon={<FiShoppingBag />}
                        text={"Products"}
                        to="/admin/products"
                    />
                </Sidebar>
            )}
            <main className="grow">
                {isDisabled ? null : <Navbar />}
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
