import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";

import axios from "axios";

import { AuthContext } from "../context/AuthContext";
import TextField from "../components/TextField";
import { publicApi } from "../api/BASApi";
import { useEffect } from "react";

function EmployeeLogin() {
    const navigate = useNavigate();
    const [token, setToken] = useAuth(AuthContext);
    const [errors, setErrors] = useState({
        incorrectCredentials: false,
        noCredentials: false,
        invalidUser: false,
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
        }));

        if (!form.username || !form.password) {
            setErrors((prev) => ({ ...prev, noCredentials: true }));
            return;
        }

        try {
            const response = await publicApi.post("/auth/login/employee", {
                username: form.username,
                password: form.password,
            });

            setToken(response.data.accessToken);

            navigate("/employee");
        } catch (error) {
            console.error("Error submitting form:", error);
            if (error.response?.status === 401) {
                setErrors((prev) => ({ ...prev, incorrectCredentials: true }));
            }
            if (error.response?.status === 404) {
                setErrors((prev) => ({ ...prev, invalidUser: true }));
            }
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            navigate("/employee/");
        }
    }, []);

    return (
        <div className="w-screen h-screen flex flex-row justify-center items-center">
            <form
                onSubmit={handleSubmit}
                method="POST"
                className="flex flex-col gap-6 p-6 rounded-xl border-1 border-slate-300 bg-white"
            >
                <p className="text-center text-lg font-bold">Employee Login</p>
                <div
                    className={`p-2 rounded text-center text-red-600 font-bold bg-red-200 ${errors.incorrectCredentials ? "" : "hidden"}`}
                >
                    Incorrect Credentials!
                </div>
                <div
                    className={`p-2 rounded text-center text-red-600 font-bold bg-red-200 ${errors.invalidUser ? "" : "hidden"}`}
                >
                    Not a User!
                </div>
                <div
                    className={`p-2 rounded text-center text-red-600 font-bold bg-red-200 ${errors.noCredentials ? "" : "hidden"}`}
                >
                    No Credentials Entered!
                </div>
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
