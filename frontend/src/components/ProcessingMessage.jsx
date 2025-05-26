import React from "react";
import { IoMdCloudUpload } from "react-icons/io";

function ProcessingMessage({ state, children }) {
    return (
        <div
            className={`flex flex-row justify-center items-center gap-2 p-2 rounded text-center text-blue-600 font-bold bg-blue-200 ${state ? "" : "hidden"}`}
        >
            <IoMdCloudUpload className="text-2xl" />
            {children}
        </div>
    );
}

export default ProcessingMessage;
