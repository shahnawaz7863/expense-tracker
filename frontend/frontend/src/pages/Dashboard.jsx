import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, } from "recharts";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [summary, setSummary] = useState({
        totalBalance: 0,
        totalIncome: 0,
        totalExpense: 0,
    });

    const [chartData, setChartData] = useState([
        {
            name: "Finance",
            Income: 0,
            Expense: 0,
        },
    ]);
    const [categoryData, setCategoryData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchSummary = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/dashboard/summary");
            const categoryResponse = await api.get(
                "/dashboard/expenses-by-category"
            );
            const monthlyResponse = await api.get(
                "/dashboard/monthly"
            );

            setSummary({
                totalBalance: response.data.data.totalBalance || 0,
                totalIncome: response.data.data.totalIncome || 0,
                totalExpense: response.data.data.totalExpense || 0,
            });

            setChartData([
                {
                    name: "Finance",
                    Income: response.data.data.totalIncome || 0,
                    Expense: response.data.data.totalExpense || 0,
                },
            ]);
            setCategoryData(categoryResponse.data.data || []);
            setMonthlyData(monthlyResponse.data.data || []);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load dashboard data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, []);

    return (
        <div className="min-vh-100 bg-light">

            {/* Navbar */}
            <nav className="navbar navbar-dark bg-primary shadow-sm">
                <div className="container-fluid px-4">

                    <span className="navbar-brand fw-bold">
                        ₹ Expense Tracker
                    </span>

                    <div className="d-flex align-items-center gap-3">
                        <span className="text-white d-none d-sm-block">
                            Hi, {user?.name || "User"}
                        </span>

                        <button
                            className="btn btn-light btn-sm"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </div>

                </div>
            </nav>

            {/* Main Content */}
            <div className="container-fluid p-4">

                <div className="mb-4">
                    <h2 className="fw-bold mb-1">
                        Dashboard
                    </h2>

                    <p className="text-muted mb-0">
                        Here's an overview of your finances
                    </p>
                </div>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {/* Summary Cards */}
                <div className="row g-4 mb-4">

                    {/* Balance */}
                    <div className="col-12 col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4">

                                <p className="text-muted mb-2">
                                    Total Balance
                                </p>

                                <h3 className="fw-bold mb-0">
                                    ₹
                                    {loading
                                        ? "..."
                                        : summary.totalBalance.toLocaleString("en-IN")}
                                </h3>

                                <small className="text-muted">
                                    Across all accounts
                                </small>

                            </div>
                        </div>
                    </div>

                    {/* Income */}
                    <div className="col-12 col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4">

                                <p className="text-muted mb-2">
                                    Total Income
                                </p>

                                <h3 className="fw-bold text-success mb-0">
                                    ₹
                                    {loading
                                        ? "..."
                                        : summary.totalIncome.toLocaleString("en-IN")}
                                </h3>

                                <small className="text-muted">
                                    Total recorded income
                                </small>

                            </div>
                        </div>
                    </div>

                    {/* Expense */}
                    <div className="col-12 col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4">

                                <p className="text-muted mb-2">
                                    Total Expense
                                </p>

                                <h3 className="fw-bold text-danger mb-0">
                                    ₹
                                    {loading
                                        ? "..."
                                        : summary.totalExpense.toLocaleString("en-IN")}
                                </h3>

                                <small className="text-muted">
                                    Total recorded expenses
                                </small>

                            </div>
                        </div>
                    </div>

                </div>

                {/* Lower Sections */}
                <div className="row g-4">

                    {/* Chart Placeholder */}
                    <div className="col-12 col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">

                                <h5 className="fw-bold mb-4">
                                    Income vs Expenses
                                </h5>

                                <div style={{ width: "100%", height: "300px" }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />

                                            <Bar dataKey="Income" fill="#198754" />
                                            <Bar dataKey="Expense" fill="#dc3545" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-4">
                                    Expenses by Category
                                </h5>

                                {categoryData.length === 0 ? (
                                    <div className="text-center text-muted py-5">
                                        No expense data available
                                    </div>
                                ) : (
                                    <div style={{ width: "100%", height: "300px" }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={categoryData}
                                                    dataKey="total"
                                                    nameKey="_id"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={100}
                                                    label
                                                >
                                                    {categoryData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} />
                                                    ))}
                                                </Pie>

                                                <Tooltip
                                                    formatter={(value) =>
                                                        `₹${Number(value).toLocaleString("en-IN")}`
                                                    }
                                                />

                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-4">
                                    Monthly Income vs Expenses
                                </h5>

                                {monthlyData.length === 0 ? (
                                    <div className="text-center text-muted py-5">
                                        No monthly data available
                                    </div>
                                ) : (
                                    <div style={{ width: "100%", height: "300px" }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={monthlyData}>
                                                <CartesianGrid strokeDasharray="3 3" />

                                                <XAxis dataKey="month" />

                                                <YAxis />

                                                <Tooltip
                                                    formatter={(value) =>
                                                        `₹${Number(value).toLocaleString("en-IN")}`
                                                    }
                                                />

                                                <Legend />

                                                <Bar
                                                    dataKey="income"
                                                    name="Income"
                                                    fill="#198754"
                                                />

                                                <Bar
                                                    dataKey="expense"
                                                    name="Expense"
                                                    fill="#dc3545"
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Quick Actions */}
                    <div className="col-12 col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">

                                <h5 className="fw-bold mb-4">
                                    Quick Actions
                                </h5>

                                <div className="d-grid gap-3">

                                    <button
                                        className="btn btn-primary"
                                        onClick={() => navigate("/add-transaction")}
                                    >
                                        + Add Transaction
                                    </button>

                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() => navigate("/accounts")}
                                    >
                                        Manage Accounts
                                    </button>

                                    <button
                                        className="btn btn-outline-dark"
                                        onClick={() => navigate("/categories")}
                                    >
                                        Manage Categories
                                    </button>

                                    <button
                                        className="btn btn-outline-success"
                                        onClick={() => navigate("/budgets")}
                                    >
                                        Manage Budgets
                                    </button>

                                    <button
                                        className="btn btn-outline-danger"
                                        onClick={() => navigate("/savings-goals")}
                                    >
                                        Savings Goals
                                    </button>

                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => navigate("/transactions")}
                                    >
                                        View Transactions
                                    </button>

                                </div>

                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Dashboard;