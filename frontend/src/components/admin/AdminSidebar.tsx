import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Tag,
    Building,
} from "lucide-react";

const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
    { path: "/admin/products", icon: Package, label: "Products" },
    { path: "/admin/orders", icon: ShoppingCart, label: "Orders" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/categories", icon: Tag, label: "Categories" },
    { path: "/admin/brands", icon: Building, label: "Brands" },
];

export function AdminSidebar() {
    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar__header">
                <h2>🛒 Fitstore</h2>
                <span>Admin Panel</span>
            </div>

            <nav className="admin-sidebar__nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) =>
                            `admin-sidebar__link ${
                                isActive ? "admin-sidebar__link--active" : ""
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
