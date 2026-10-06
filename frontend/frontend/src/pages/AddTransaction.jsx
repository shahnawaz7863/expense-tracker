import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AddTransaction = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        amount: "",
        type: "Expense",
        category: "",
        account: "",
        note: "",
        date: "",
        recurring: false,
        recurrence: "",
    });

    const [accounts, setAccounts] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [accountsResponse, categoriesResponse] =
                    await Promise.all([
                        api.get("/accounts"),
                        api.get("/categories"),
                    ]);

                setAccounts(accountsResponse.data.accounts || []);
                setCategories(categoriesResponse.data.categories || []);
            } catch (error) {
                console.error(
                    "FAILED TO LOAD DATA:",
                    error.response?.data || error.message
                );
            }
        };

        fetchData();
    }, []);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await api.post("/transactions", {
                amount: Number(formData.amount),
                type: formData.type,
                category: formData.category,
                account: formData.account,
                note: formData.note,
                date: formData.date || new Date(),
                recurring: formData.recurring,
                recurrence: formData.recurring
                    ? formData.recurrence
                    : null,
            });

            setSuccess("Transaction added successfully!");

            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to add transaction."
            );
        } finally {
            setLoading(false);
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
                        onClick={() => navigate("/dashboard")}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </nav>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4 p-md-5">
                                <h3 className="fw-bold mb-1">
                                    Add Transaction
                                </h3>

                                <p className="text-muted mb-4">
                                    Record your income or expense
                                </p>

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

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            Amount
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

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            Type
                                        </label>

                                        <select
                                            name="type"
                                            className="form-select"
                                            value={formData.type}
                                            onChange={handleChange}
                                        >
                                            <option value="Expense">
                                                Expense
                                            </option>

                                            <option value="Income">
                                                Income
                                            </option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            Category
                                        </label>

                                        <select
                                            name="category"
                                            className="form-select"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Category</option>

                                            {categories
                                                .filter((item) => item.type === formData.type)
                                                .map((item) => (
                                                    <option key={item._id} value={item.name}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            Account
                                        </label>

                                        <select
                                            name="account"
                                            className="form-select"
                                            value={formData.account}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Account</option>

                                            {accounts.map((account) => (
                                                <option key={account._id} value={account._id}>
                                                    {account.name} ({account.type})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            Date
                                        </label>

                                        <input
                                            type="date"
                                            name="date"
                                            className="form-control"
                                            value={formData.date}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            Note
                                        </label>

                                        <textarea
                                            name="note"
                                            className="form-control"
                                            rows="3"
                                            placeholder="Optional note"
                                            value={formData.note}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-check mb-3">
                                        <input
                                            type="checkbox"
                                            name="recurring"
                                            className="form-check-input"
                                            id="recurring"
                                            checked={formData.recurring}
                                            onChange={handleChange}
                                        />

                                        <label
                                            className="form-check-label"
                                            htmlFor="recurring"
                                        >
                                            Recurring Transaction
                                        </label>
                                    </div>

                                    {formData.recurring && (
                                        <div className="mb-4">
                                            <label className="form-label fw-semibold">
                                                Recurrence
                                            </label>

                                            <select
                                                name="recurrence"
                                                className="form-select"
                                                value={formData.recurrence}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">
                                                    Select recurrence
                                                </option>

                                                <option value="Daily">
                                                    Daily
                                                </option>

                                                <option value="Weekly">
                                                    Weekly
                                                </option>

                                                <option value="Monthly">
                                                    Monthly
                                                </option>

                                                <option value="Yearly">
                                                    Yearly
                                                </option>
                                            </select>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Adding Transaction..."
                                            : "Add Transaction"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTransaction;