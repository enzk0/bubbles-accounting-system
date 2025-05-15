import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import AdminBranches from "./pages/AdminBranches";
import AdminEmployees from "./pages/AdminEmployees";
import AdminJobOrders from "./pages/AdminJobOrders";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import AdminHome from "./pages/AdminHome";
import EmployeeLogin from "./pages/EmployeeLogin";
import EmployeeHome from "./pages/EmployeeHome";
import EmployeeJobOrders from "./pages/EmployeeJobOrders";
import EmployeeOngoingJobOrders from "./pages/EmployeeOngoingJobOrders";
import EmployeeCompletedJobOrders from "./pages/EmployeeCompletedJobOrders";
import EmployeeLayout from "./components/EmployeeLayout";
import PageNotFound from "./pages/PageNotFound";

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="flex flex-row">
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/employee/login" replace />}
                />
                <Route path="/employee" element={<EmployeeLayout />}>
                    <Route index element={<EmployeeHome />} />
                    <Route path="login" element={<EmployeeLogin />} />
                    <Route path="job_orders">
                        <Route index element={<EmployeeJobOrders />} />
                        <Route
                            path="ongoing"
                            element={<EmployeeOngoingJobOrders />}
                        />
                        <Route
                            path="completed"
                            element={<EmployeeCompletedJobOrders />}
                        />
                    </Route>
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminHome />} />
                    <Route path="login" element={<AdminLogin />} />
                    <Route path="job_orders" element={<AdminJobOrders />} />
                    <Route path="employees" element={<AdminEmployees />} />
                    <Route path="employees" element={<AdminBranches />} />
                </Route>
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </div>
    );
}

export default App;
