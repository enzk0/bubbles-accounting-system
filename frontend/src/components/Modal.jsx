import React from "react";

function Modal({ isVisible, ref, width, children }) {
    return (
        <div
            className={`fixed top-0 left-0 right-0 bottom-0 w-sreen h-screen bg-black/50 z-50 flex flex-row justify-center items-center ${isVisible ? "visible" : "invisible"}`}
        >
            <div
                ref={ref}
                className={`p-4 ${width ? width : "min-w-2xl"} rounded-lg bg-white`}
            >
                {children}
            </div>
        </div>
    );
}

export default Modal;
