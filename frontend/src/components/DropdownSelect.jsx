import React from "react";

function DropdownSelect({ children }) {
    return (
        <div className={`flex flex-col gap-2 mb-4`}>
            <label htmlFor={""}>Branch</label>
            <select className="rounded-md  bg-white p-2">{children}</select>
        </div>
    );
}

export default DropdownSelect;
