import React from "react";

function TextField({ label, placeholder, type, name, className }) {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <label htmlFor={name}>{label}</label>
            <input
                id={name}
                type={type}
                name={name}
                placeholder={placeholder}
                className="p-2 rounded-md border-2 border-slate-300 focus:border-2 focus:border-sky-400 outline-none"
            />
        </div>
    );
}

export default TextField;
