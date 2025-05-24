import React from "react";
import TextField from "../components/TextField";

function AdminLogin() {
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            navigate("/admin/");
        }
    }, []);

    return (
        <div className="w-screen h-screen flex flex-row justify-center items-center">
            <div className="flex flex-col gap-6 p-6 rounded-xl border-1 border-slate-300 bg-white">
                <p className="text-center text-lg font-bold">Admin Login</p>
                <TextField
                    label={"Username"}
                    placeholder={"Enter username..."}
                    type={"text"}
                    name={"login-username"}
                />
                <TextField
                    label={"Password"}
                    placeholder={"Enter password..."}
                    type={"password"}
                    name={"login-password"}
                />
                <input
                    type="submit"
                    value={"Login"}
                    className="p-3 mt-6 rounded-lg bg-sky-800 text-white font-bold cursor-pointer"
                />
                <a
                    href="/employee/login"
                    className="text-center underline hover:font-bold"
                >
                    Are you Employee?
                </a>
            </div>
        </div>
    );
}

export default AdminLogin;
