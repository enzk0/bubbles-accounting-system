import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import AdminRoute from "./components/AdminRoute";
import EmployeeRoute from "./components/EmployeeRoute";
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
                                <EmployeeRoute defaultRoute="/employee/login">
                                    <EmployeeHome />
                                </EmployeeRoute>
                            }
                        />
                        <Route path="login" element={<EmployeeLogin />} />
                        <Route path="job_orders">
                            <Route
                                index
                                element={
                                    <EmployeeRoute defaultRoute="/employee/login">
                                        <EmployeeJobOrders />
                                    </EmployeeRoute>
                                }
                            />
                            <Route
                                path="ongoing"
                                element={
                                    <EmployeeRoute defaultRoute="/employee/login">
                                        <EmployeeOngoingJobOrders />
                                    </EmployeeRoute>
                                }
                            />
                            <Route
                                path="completed"
                                element={
                                    <EmployeeRoute defaultRoute="/employee/login">
                                        <EmployeeCompletedJobOrders />
                                    </EmployeeRoute>
                                }
                            />
                        </Route>
                    </Route>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route
                            index
                            element={
                                <AdminRoute defaultRoute="/admin/login">
                                    <AdminHome />
                                </AdminRoute>
                            }
                        />
                        <Route path="login" element={<AdminLogin />} />
                        <Route
                            path="job_orders"
                            element={
                                <AdminRoute defaultRoute="/admin/login">
                                    <AdminJobOrders />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="employees"
                            element={
                                <AdminRoute defaultRoute="/admin/login">
                                    <AdminEmployees />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="branches"
                            element={
                                <AdminRoute defaultRoute="/admin/login">
                                    <AdminBranches />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="products"
                            element={
                                <AdminRoute defaultRoute="/admin/login">
                                    <AdminProducts />
                                </AdminRoute>
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
