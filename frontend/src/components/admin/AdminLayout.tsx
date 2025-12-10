import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout() {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div className="admin-loading">Loading...</div>;
    }

    if (!isAuthenticated || user?.role !== "Admin") {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
}
