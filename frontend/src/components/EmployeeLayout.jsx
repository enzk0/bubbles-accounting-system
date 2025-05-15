import React from "react";

import { Outlet, useLocation } from "react-router-dom";
import { IoHome, IoReceipt, IoHourglass, IoCheckbox } from "react-icons/io5";

import Sidebar from "./Sidebar";
import SidebarItem from "./SidebarItem";
import Navbar from "./Navbar";

function EmployeeLayout() {
    const location = useLocation();
    const isDisabled = location.pathname === "/employee/login";

    return (
        <div className="w-screen flex flex-row">
            {isDisabled ? null : (
                <Sidebar>
                    <SidebarItem icon={<IoHome />} text="Home" to="/employee" />
                    <SidebarItem
                        icon={<IoReceipt />}
                        text="Job Orders"
                        to="/employee/job_orders"
                    />
                    <SidebarItem
                        icon={<IoHourglass />}
                        text={"Ongoing Job Orders"}
                        to="/employee/job_orders/ongoing"
                    />
                    <SidebarItem
                        icon={<IoCheckbox />}
                        text={"Completed Job Orders"}
                        to="/employee/job_orders/completed"
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

export default EmployeeLayout;
