import React from "react";

function NumberField({ value, decrement, increment }) {
    return (
        <div className="flex flex-row gap-2">
            <button
                type="button"
                onClick={decrement}
                className="px-3 py-1 rounded bg-slate-200"
            >
                -
            </button>
            <input
                type="number"
                value={value}
                className="appearance-none text-center w-16"
            />
            <button
                type="button"
                className="px-3 py-1 rounded bg-slate-200"
                onClick={increment}
            >
                +
            </button>
        </div>
    );
}

export default NumberField;
