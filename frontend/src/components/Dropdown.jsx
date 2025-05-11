import React from "react";

function Dropdown({ isVisible, ref, children }) {
    return (
        <div
            ref={ref}
            className={`absolute top-16 right-4 p-4 rounded border-1 border-slate-300 bg-white shadow-lg ${isVisible ? "visisble" : "invisible"}`}
        >
            {children}
        </div>
    );
}

export default Dropdown;
