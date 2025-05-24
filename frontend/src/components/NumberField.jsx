import React from "react";

function NumberField({ value, decrement, increment, readOnly }) {
    return (
        <div className="flex flex-row gap-2">
            <button
                type="button"
                onClick={decrement}
                className="px-2.5 py-0.5 rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-500 active:text-white"
            >
                -
            </button>
            <input
                type="number"
                value={value}
                className="appearance-none text-center w-16"
                readOnly={readOnly}
            />
            <button
                type="button"
                className="px-2.5 py-0.5 rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-500 active:text-white"
                onClick={increment}
            >
                +
            </button>
        </div>
    );
}

export default NumberField;
