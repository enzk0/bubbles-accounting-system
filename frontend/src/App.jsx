import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import AdminProducts from "./pages/AdminProducts";
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
import AuthProvider from "./context/AuthContext";
import PrivateComponent from "./components/PrivateComponent";

function App() {
    const [count, setCount] = useState(0);

    return (
        <AuthProvider>
            <div className="flex flex-row">
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to="/employee/login" replace />}
                    />
                    <Route path="/employee" element={<EmployeeLayout />}>
                        <Route
                            index
                            element={
                                <PrivateComponent defaultRoute="/employee/login">
                                    <EmployeeHome />
                                </PrivateComponent>
                            }
                        />
                        <Route path="login" element={<EmployeeLogin />} />
                        <Route path="job_orders">
                            <Route
                                index
                                element={
                                    <PrivateComponent defaultRoute="/employee/login">
                                        <EmployeeJobOrders />
                                    </PrivateComponent>
                                }
                            />
                            <Route
                                path="ongoing"
                                element={
                                    <PrivateComponent defaultRoute="/employee/login">
                                        <EmployeeOngoingJobOrders />
                                    </PrivateComponent>
                                }
                            />
                            <Route
                                path="completed"
                                element={
                                    <PrivateComponent defaultRoute="/employee/login">
                                        <EmployeeCompletedJobOrders />
                                    </PrivateComponent>
                                }
                            />
                        </Route>
                    </Route>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route
                            index
                            element={
                                <PrivateComponent defaultRoute="/admin/login">
                                    <AdminHome />
                                </PrivateComponent>
                            }
                        />
                        <Route path="login" element={<AdminLogin />} />
                        <Route
                            path="job_orders"
                            element={
                                <PrivateComponent defaultRoute="/admin/login">
                                    <AdminJobOrders />
                                </PrivateComponent>
                            }
                        />
                        <Route
                            path="employees"
                            element={
                                <PrivateComponent defaultRoute="/admin/login">
                                    <AdminEmployees />
                                </PrivateComponent>
                            }
                        />
                        <Route
                            path="branches"
                            element={
                                <PrivateComponent defaultRoute="/admin/login">
                                    <AdminBranches />
                                </PrivateComponent>
                            }
                        />
                        <Route
                            path="products"
                            element={
                                <PrivateComponent defaultRoute="/admin/login">
                                    <AdminProducts />
                                </PrivateComponent>
                            }
                        />
                    </Route>
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </div>
        </AuthProvider>
    );
}

export default App;
