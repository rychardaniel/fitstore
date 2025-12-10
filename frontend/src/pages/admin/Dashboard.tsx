import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    DollarSign,
    ShoppingCart,
    Package,
    Users,
    AlertCircle,
    TrendingUp,
} from "lucide-react";
import { AdminService, type AdminStats } from "../../services/AdminService";

export default function Dashboard() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await AdminService.getStats();
                setStats(data);
            } catch (err) {
                setError("Failed to load dashboard statistics");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) {
        return <div className="admin-page__loading">Loading dashboard...</div>;
    }

    if (error || !stats) {
        return (
            <div className="admin-page__error">
                {error || "An error occurred"}
            </div>
        );
    }

    return (
        <div className="admin-page">
            <h1>Dashboard</h1>

            <div className="stats-grid">
                <div className="stat-card stat-card--revenue">
                    <div className="stat-card__icon">
                        <DollarSign size={24} />
                    </div>
                    <div className="stat-card__info">
                        <span className="stat-card__label">Total Revenue</span>
                        <span className="stat-card__value">
                            R$ {stats.totalRevenue.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="stat-card stat-card--orders">
                    <div className="stat-card__icon">
                        <ShoppingCart size={24} />
                    </div>
                    <div className="stat-card__info">
                        <span className="stat-card__label">Total Orders</span>
                        <span className="stat-card__value">
                            {stats.totalOrders}
                        </span>
                    </div>
                </div>

                <div className="stat-card stat-card--products">
                    <div className="stat-card__icon">
                        <Package size={24} />
                    </div>
                    <div className="stat-card__info">
                        <span className="stat-card__label">Total Products</span>
                        <span className="stat-card__value">
                            {stats.totalProducts}
                        </span>
                    </div>
                </div>

                <div className="stat-card stat-card--users">
                    <div className="stat-card__icon">
                        <Users size={24} />
                    </div>
                    <div className="stat-card__info">
                        <span className="stat-card__label">Total Users</span>
                        <span className="stat-card__value">
                            {stats.totalUsers}
                        </span>
                    </div>
                </div>
            </div>

            <div className="alerts-grid">
                {stats.pendingOrders > 0 && (
                    <div className="alert-card alert-card--warning">
                        <AlertCircle size={20} />
                        <span>
                            {stats.pendingOrders} orders pending processing
                        </span>
                        <Link to="/admin/orders?status=Open">View</Link>
                    </div>
                )}
                {stats.lowStockProducts > 0 && (
                    <div className="alert-card alert-card--danger">
                        <AlertCircle size={20} />
                        <span>
                            {stats.lowStockProducts} products with low stock
                        </span>
                        <Link to="/admin/products?lowStock=true">View</Link>
                    </div>
                )}
            </div>

            <div className="dashboard-sections">
                <section className="dashboard-section">
                    <div className="dashboard-section__header">
                        <h2>Recent Orders</h2>
                        <Link to="/admin/orders">View All</Link>
                    </div>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentOrders.map((order) => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>
                                        {order.customerName ||
                                            order.customerEmail ||
                                            "Guest"}
                                    </td>
                                    <td>R$ {order.total.toFixed(2)}</td>
                                    <td>
                                        <span
                                            className={`status-badge status-badge--${order.status.toLowerCase()}`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString("pt-BR")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section className="dashboard-section">
                    <div className="dashboard-section__header">
                        <h2>
                            <TrendingUp size={20} />
                            Top Selling Products
                        </h2>
                        <Link to="/admin/products">View All</Link>
                    </div>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Sold</th>
                                <th>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.topProducts.map((product) => (
                                <tr key={product.id}>
                                    <td className="product-cell">
                                        {product.image && (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="product-thumb"
                                            />
                                        )}
                                        <span>{product.name}</span>
                                    </td>
                                    <td>{product.totalSold} units</td>
                                    <td>R$ {product.revenue.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    );
}
