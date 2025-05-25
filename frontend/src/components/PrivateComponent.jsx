import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth.jsx";

import React from "react";

function PrivateComponent({ children, defaultRoute, ...rest }) {
    const [token, setToken] = useAuth();

    return token ? children : <Navigate to={defaultRoute} replace />;
}

export default PrivateComponent;
