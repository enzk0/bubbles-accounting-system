import React from "react";

function TextField({
    label,
    placeholder,
    type,
    name,
    value,
    onChange,
    className,
}) {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <label htmlFor={name} className="text-md font-bold">
                {label}
            </label>
            <input
                id={name}
                type={type}
                name={name}
                onChange={onChange}
                value={value}
                placeholder={placeholder}
                className="p-1 px-3 rounded-md border-2 border-slate-300 focus:border-2 focus:border-sky-400 outline-none placeholder:text-sm placeholder:italic"
            />
        </div>
    );
}

export default TextField;
