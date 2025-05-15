import React from "react";

function DropdownItem({ title, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="p-2 pr-4 text-left rounded hover:bg-sky-100 active:bg-sky-800 active:text-sky-50"
        >
            {title}
        </button>
    );
}

export default DropdownItem;
