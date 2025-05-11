import React, { useState, useEffect, useRef } from "react";







function OverviewItem({ title, value, isLast = false }) {
    return (
        <div
            className={`grow p-1 m-3 ${isLast ? "" : "border-r-1 border-slate-300"}`}
        >
            <p className="text-sm font-bold text-gray-400">Today's</p>
            <p>{title}</p>
            <p className="mt-4 text-lg font-bold ">{value}</p>
        </div>
    );
}

