import React from "react";

import { Link, useLocation } from "react-router-dom";

function SidebarItem({ icon, text, to, isExpanded }) {
    const location = useLocation();
    const style =
        to === location.pathname || `${to}/` === location.pathname
            ? "bg-sky-800 text-sky-50 hover:bg-sky-900"
            : "text-sky-950 hover:bg-sky-100";

    return (
        <Link
            to={to}
            className={`flex flex-row items-center p-2 ${isExpanded ? "pl-4" : ""} gap-2 rounded-lg ${style} active:bg-sky-700 active:text-sky-50 transition-colors`}
        >
            <div className="text-xl">{icon}</div>
            {isExpanded ? <div>{text ? text : "SidebarItem"}</div> : null}
        </Link>
    );
}

export default SidebarItem;
