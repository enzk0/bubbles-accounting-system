import React from "react";

function ErrorMessage({ error, children }) {
    return (
        <div
            className={`p-2 rounded text-center text-red-600 font-bold bg-red-200 ${error ? "" : "hidden"}`}
        >
            {children}
        </div>
    );
}

export default ErrorMessage;
