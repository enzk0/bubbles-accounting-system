import React, { useState } from "react";
import { FaCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { useLocation } from "react-router-dom";

function Sidebar({ children }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const location = useLocation;

    return (
        <aside className="h-screen flex-col p-4 gap-4 border-r-1 border-r-slate-300 bg-white top-0 hidden sm:flex sticky">
            <div
                className={`flex flex-row items-center gap-4 ${isExpanded ? "align-middle items-center" : ""}`}
            >
                {isExpanded ? (
                    <div className="flex flex-row items-center gap-4">
                        <div className="text-4xl">
                            <FaCircle />
                        </div>
                        <div>
                            <p className="text-xl font-bold">Bubbles Launrdy</p>
                            <p>Accounting System</p>
                        </div>
                    </div>
                ) : null}
                <div className={`${isExpanded ? "ml-2" : ""}`}>
                    <button
                        type="button"
                        className="cursor-pointer p-2 rounded-md hover:bg-sky-100 transition-colors"
                        onClick={() => setIsExpanded((prev) => !prev)}
                    >
                        <GiHamburgerMenu />
                    </button>
                </div>
            </div>
            <div></div>
            <div className="flex flex-col gap-2">
                {React.Children.map(children, (child) =>
                    React.cloneElement(child, { isExpanded: isExpanded })
                )}
            </div>
        </aside>
    );
}

export default Sidebar;
