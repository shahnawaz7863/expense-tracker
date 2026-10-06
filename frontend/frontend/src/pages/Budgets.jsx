import { useEffect, useState } from "react";
import api from "../services/api";

const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        category: "",
        amount: "",
        period: "Monthly",
        startDate: "",
        endDate: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [budgetResponse, categoryResponse] = await Promise.all([
                api.get("/budgets"),
                api.get("/categories"),
            ]);

            setBudgets(budgetResponse.data.budgets || []);

            const expenseCategories = (categoryResponse.data.categories || []).filter(
                (category) => category.type === "Expense"
            );

            setCategories(expenseCategories);
        } catch (error) {
            setError(
                error.response?.data?.message || "Unable to load budget data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            await api.post("/budgets", {
                category: formData.category,
                amount: Number(formData.amount),
                period: formData.period,
                startDate: formData.startDate,
                endDate: formData.endDate,
            });

            setSuccess("Budget created successfully.");

            setFormData({
                category: "",
                amount: "",
                period: "Monthly",
                startDate: "",
                endDate: "",
            });

            fetchData();
        } catch (error) {
            setError(
                error.response?.data?.message || "Unable to create budget."
            );
        } finally {
            setSaving(false);
        }
    };


    const handleEdit = async (budget) => {
        const amount = window.prompt(
            "Enter budget amount:",
            budget.amount
        );

        if (amount === null) return;

        const period = window.prompt(
            "Enter period (Monthly/Yearly):",
            budget.period
        );

        if (period === null) return;

        const startDate = window.prompt(
            "Enter start date (YYYY-MM-DD):",
            budget.startDate
                ? new Date(budget.startDate).toISOString().split("T")[0]
                : ""
        );

        if (startDate === null) return;

        const endDate = window.prompt(
            "Enter end date (YYYY-MM-DD):",
            budget.endDate
                ? new Date(budget.endDate).toISOString().split("T")[0]
                : ""
        );

        if (endDate === null) return;

        try {
            setError("");
            setSuccess("");

            await api.put(`/budgets/${budget._id}`, {
                category: budget.category._id,
                amount: Number(amount),
                period,
                startDate,
                endDate,
                isActive: true,
            });

            setSuccess("Budget updated successfully!");

            await fetchData();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to update budget."
            );
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this budget?"
        );

        if (!confirmed) return;

        try {
            setError("");
            setSuccess("");

            await api.delete(`/budgets/${id}`);

            setSuccess("Budget deleted successfully.");

            fetchData();
        } catch (error) {
            setError(
                error.response?.data?.message || "Unable to delete budget."
            );
        }
    };

    return (
        <div className="min-vh-100 bg-light">
            {/* Navbar */}
            <nav className="navbar navbar-dark bg-primary shadow-sm">
                <div className="container-fluid px-4">
                    <span className="navbar-brand fw-bold">
                        ₹ Expense Tracker
                    </span>

                    <button
                        className="btn btn-light btn-sm"
                        onClick={() => window.history.back()}
                    >
                        Back
                    </button>
                </div>
            </nav>

            <div className="container py-4">
                {/* Header */}
                <div className="mb-4">
                    <h2 className="fw-bold mb-1">Budgets</h2>
                    <p className="text-muted mb-0">
                        Manage your spending limits and budgets
                    </p>
                </div>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        {success}
                    </div>
                )}

                {/* Add Budget */}
                <div className="card border-0 shadow-sm rounded-4 mb-4">
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-4">Add Budget</h5>

                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                {/* Category */}
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-semibold">
                                        Expense Category
                                    </label>

                                    <select
                                        name="category"
                                        className="form-select"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">
                                            Select Category
                                        </option>

                                        {categories.map((category) => (
                                            <option
                                                key={category._id}
                                                value={category._id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Amount */}
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-semibold">
                                        Budget Amount
                                    </label>

                                    <input
                                        type="number"
                                        name="amount"
                                        className="form-control"
                                        placeholder="Enter amount"
                                        min="0.01"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Period */}
                                <div className="col-12 col-md-4">
                                    <label className="form-label fw-semibold">
                                        Period
                                    </label>

                                    <select
                                        name="period"
                                        className="form-select"
                                        value={formData.period}
                                        onChange={handleChange}
                                    >
                                        <option value="Monthly">Monthly</option>
                                        <option value="Yearly">Yearly</option>
                                    </select>
                                </div>

                                {/* Start Date */}
                                <div className="col-12 col-md-4">
                                    <label className="form-label fw-semibold">
                                        Start Date
                                    </label>

                                    <input
                                        type="date"
                                        name="startDate"
                                        className="form-control"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* End Date */}
                                <div className="col-12 col-md-4">
                                    <label className="form-label fw-semibold">
                                        End Date
                                    </label>

                                    <input
                                        type="date"
                                        name="endDate"
                                        className="form-control"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-12">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={saving}
                                    >
                                        {saving ? "Creating..." : "Create Budget"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Budget List */}
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-4">My Budgets</h5>

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary"></div>
                                <p className="text-muted mt-3 mb-0">
                                    Loading budgets...
                                </p>
                            </div>
                        ) : budgets.length === 0 ? (
                            <div className="text-center text-muted py-5">
                                No budgets available.
                            </div>
                        ) : (
                            <div className="row g-4">
                                {budgets.map((budget) => {
                                    const amount = Number(budget.amount || 0);
                                    const spent = Number(budget.spent || 0);

                                    const percentage =
                                        amount > 0
                                            ? Math.min((spent / amount) * 100, 100)
                                            : 0;

                                    return (
                                        <div
                                            className="col-12 col-md-6 col-lg-4"
                                            key={budget._id}
                                        >
                                            <div className="border rounded-4 p-4 h-100">
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <div>
                                                        <h6 className="fw-bold mb-1">
                                                            {budget.category?.name ||
                                                                "Unknown Category"}
                                                        </h6>

                                                        <small className="text-muted">
                                                            {budget.period}
                                                        </small>
                                                    </div>

                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => handleEdit(budget)}
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDelete(budget._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mb-2">
                                                    <strong>
                                                        ₹{spent.toLocaleString("en-IN")}
                                                    </strong>{" "}
                                                    <span className="text-muted">
                                                        / ₹{amount.toLocaleString("en-IN")}
                                                    </span>
                                                </div>

                                                <div className="progress mb-2">
                                                    <div
                                                        className="progress-bar"
                                                        role="progressbar"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>

                                                <small className="text-muted">
                                                    {percentage.toFixed(0)}% used
                                                </small>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Budgets;