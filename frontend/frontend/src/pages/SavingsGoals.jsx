import { useEffect, useState } from "react";
import api from "../services/api";

const SavingsGoals = () => {
    const [goals, setGoals] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        targetAmount: "",
        currentAmount: "",
        targetDate: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchGoals = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/savings-goals");

            setGoals(response.data.goals || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load savings goals."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
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

            await api.post("/savings-goals", {
                name: formData.name,
                targetAmount: Number(formData.targetAmount),
                currentAmount: Number(formData.currentAmount || 0),
                targetDate: formData.targetDate,
            });

            setSuccess("Savings goal created successfully.");

            setFormData({
                name: "",
                targetAmount: "",
                currentAmount: "",
                targetDate: "",
            });

            fetchGoals();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to create savings goal."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = async (goal) => {
        const name = window.prompt("Enter goal name:", goal.name);

        if (name === null) return;

        const targetAmount = window.prompt(
            "Enter target amount:",
            goal.targetAmount
        );

        if (targetAmount === null) return;

        const currentAmount = window.prompt(
            "Enter current amount:",
            goal.currentAmount
        );

        if (currentAmount === null) return;

        const targetDate = window.prompt(
            "Enter target date (YYYY-MM-DD):",
            goal.targetDate
                ? new Date(goal.targetDate).toISOString().split("T")[0]
                : ""
        );

        if (targetDate === null) return;

        try {
            setError("");
            setSuccess("");

            await api.put(`/savings-goals/${goal._id}`, {
                name,
                targetAmount: Number(targetAmount),
                currentAmount: Number(currentAmount),
                targetDate,
            });

            setSuccess("Savings goal updated successfully.");

            fetchGoals();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to update savings goal."
            );
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this savings goal?"
        );

        if (!confirmed) return;

        try {
            setError("");
            setSuccess("");

            await api.delete(`/savings-goals/${id}`);

            setSuccess("Savings goal deleted successfully.");

            fetchGoals();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to delete savings goal."
            );
        }
    };

    return (
        <div className="min-vh-100 bg-light">
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
                <div className="mb-4">
                    <h2 className="fw-bold mb-1">Savings Goals</h2>

                    <p className="text-muted mb-0">
                        Track your savings targets and progress
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

                {/* Add Goal */}
                <div className="card border-0 shadow-sm rounded-4 mb-4">
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-4">
                            Create Savings Goal
                        </h5>

                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-semibold">
                                        Goal Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        placeholder="e.g. New Laptop"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-semibold">
                                        Target Amount
                                    </label>

                                    <input
                                        type="number"
                                        name="targetAmount"
                                        className="form-control"
                                        placeholder="Enter target amount"
                                        min="0.01"
                                        step="0.01"
                                        value={formData.targetAmount}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-semibold">
                                        Current Amount
                                    </label>

                                    <input
                                        type="number"
                                        name="currentAmount"
                                        className="form-control"
                                        placeholder="Enter current savings"
                                        min="0"
                                        step="0.01"
                                        value={formData.currentAmount}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-semibold">
                                        Target Date
                                    </label>

                                    <input
                                        type="date"
                                        name="targetDate"
                                        className="form-control"
                                        value={formData.targetDate}
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
                                        {saving
                                            ? "Creating..."
                                            : "Create Goal"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Goals */}
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-4">
                            My Savings Goals
                        </h5>

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary"></div>

                                <p className="text-muted mt-3 mb-0">
                                    Loading savings goals...
                                </p>
                            </div>
                        ) : goals.length === 0 ? (
                            <div className="text-center text-muted py-5">
                                No savings goals available.
                            </div>
                        ) : (
                            <div className="row g-4">
                                {goals.map((goal) => {
                                    const target = Number(
                                        goal.targetAmount || 0
                                    );

                                    const current = Number(
                                        goal.currentAmount || 0
                                    );

                                    const percentage =
                                        target > 0
                                            ? Math.min(
                                                (current / target) * 100,
                                                100
                                            )
                                            : 0;

                                    return (
                                        <div
                                            className="col-12 col-md-6 col-lg-4"
                                            key={goal._id}
                                        >
                                            <div className="border rounded-4 p-4 h-100">
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <div>
                                                        <h6 className="fw-bold mb-1">
                                                            {goal.name}
                                                        </h6>

                                                        <small className="text-muted">
                                                            Target:{" "}
                                                            {goal.targetDate
                                                                ? new Date(
                                                                    goal.targetDate
                                                                ).toLocaleDateString(
                                                                    "en-IN"
                                                                )
                                                                : "N/A"}
                                                        </small>
                                                    </div>

                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => handleEdit(goal)}
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDelete(goal._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mb-2">
                                                    <strong>
                                                        ₹
                                                        {current.toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </strong>{" "}
                                                    <span className="text-muted">
                                                        / ₹
                                                        {target.toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="progress mb-2">
                                                    <div
                                                        className="progress-bar"
                                                        role="progressbar"
                                                        style={{
                                                            width: `${percentage}%`,
                                                        }}
                                                    ></div>
                                                </div>

                                                <small className="text-muted">
                                                    {percentage.toFixed(0)}% saved
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

export default SavingsGoals;