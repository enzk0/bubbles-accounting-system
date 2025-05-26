import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";

import axios from "axios";

import { AuthContext } from "../context/AuthContext";
import TextField from "../components/TextField";
import { privateApi, publicApi } from "../api/BASApi";
import { useEffect } from "react";
import ErrorMessage from "../components/ErrorMessage";
import ProcessingMessage from "../components/ProcessingMessage";

function EmployeeLogin() {
    const [isProcessing, setIsProcessing] = useState(false);

    const navigate = useNavigate();
    const [token, setToken] = useAuth(AuthContext);
    const [errors, setErrors] = useState({
        incorrectCredentials: false,
        noCredentials: false,
        invalidUser: false,
        notAllowed: false,
    });

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors((prev) => ({
            incorrectCredentials: false,
            invalidUser: false,
            noCredentials: false,
            notAllowed: false,
        }));

        if (!form.username || !form.password) {
            setErrors((prev) => ({ ...prev, noCredentials: true }));
            return;
        }

        try {
            setIsProcessing(true);
            const response = await publicApi.post("/auth/login/employee", {
                username: form.username,
                password: form.password,
            });

            setToken(response.data.accessToken);

            setIsProcessing(false);
            navigate("/employee");
        } catch (error) {
            setIsProcessing(false);
            console.error("Error submitting form:", error);
            if (error.response?.status === 401) {
                setErrors((prev) => ({ ...prev, incorrectCredentials: true }));
            }
            if (error.response?.status === 404) {
                setErrors((prev) => ({ ...prev, invalidUser: true }));
            }
            if (error.response?.status === 403) {
                setErrors((prev) => ({ ...prev, notAllowed: true }));
            }
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await privateApi.get("/user/self");
                const user = response.data;

                if (user.roleId === 1) {
                    navigate("/admin/");
                }
                if (user.roleId === 2) {
                    navigate("/employee/");
                }
            } catch (error) {
                console.error("Error fetching current user:", error);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="w-screen h-screen flex flex-row justify-center items-center">
            <form
                onSubmit={handleSubmit}
                method="POST"
                className="flex flex-col gap-6 p-6 rounded-xl border-1 border-slate-300 bg-white"
            >
                <p className="text-center text-lg font-bold">Employee Login</p>
                <ErrorMessage error={errors.incorrectCredentials}>
                    Incorrect Credentials!
                </ErrorMessage>
                <ErrorMessage error={errors.invalidUser}>
                    Not a User!
                </ErrorMessage>
                <ErrorMessage error={errors.noCredentials}>
                    No Credentials Entered!
                </ErrorMessage>
                <ErrorMessage error={errors.notAllowed}>
                    Logging In with this User is not allowed!
                </ErrorMessage>
                <ProcessingMessage state={isProcessing}>
                    Logging In
                </ProcessingMessage>

                <TextField
                    label={"Username"}
                    placeholder={"Enter username..."}
                    type={"text"}
                    name={"username"}
                    value={form.username}
                    onChange={handleFormChange}
                />
                <TextField
                    label={"Password"}
                    placeholder={"Enter password..."}
                    type={"password"}
                    name={"password"}
                    value={form.password}
                    onChange={handleFormChange}
                />
                <input
                    type="submit"
                    value={"Login"}
                    className="p-3 mt-6 rounded-lg bg-sky-800 text-white font-bold cursor-pointer"
                />
                <a
                    href="/admin/login"
                    className="text-center underline hover:font-bold"
                >
                    Are you Admin?
                </a>
            </form>
        </div>
    );
}

export default EmployeeLogin;
