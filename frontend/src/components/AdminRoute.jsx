import React from "react";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth.jsx";
import { privateApi } from "../api/BASApi.js";

function AdminRoute({ children, defaultRoute, ...rest }) {
    const [token, setToken] = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const validateUser = async () => {
            try {
                const response = await privateApi.get("/user/self");
                const user = response.data;

                if (user.roleId != 1) {
                    navigate("/employee/");
                }
            } catch (error) {
                console.error(
                    "An error occurred when fetching the user's information",
                    error
                );
            }
        };

        validateUser();
    }, []);

    return token ? children : <Navigate to={defaultRoute} replace />;
}

export default AdminRoute;
