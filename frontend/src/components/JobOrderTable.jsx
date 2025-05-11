import React from "react";

function StatusItem({ status, positive, negative }) {
    return status ? (
        <div className="px-4 py-1 rounded-2xl bg-green-200 text-green-900 font-bold">
            {positive}
        </div>
    ) : (
        <div className="px-4 py-1 rounded-2xl bg-red-200 text-red-900 font-bold">
            {negative}
        </div>
    );
}

