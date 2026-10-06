import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Transactions = () => {
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [type, setType] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [account, setAccount] = useState("");
    const [accounts, setAccounts] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");

    const fetchCategories = async () => {
        try {
            const response = await api.get("/categories");
            console.log("CATEGORIES RESPONSE:", response.data);
            setCategories(response.data.categories || []);
        } catch (error) {
            console.error(
                "FAILED TO LOAD CATEGORIES:",
                error.response?.data || error.message
            );
        }
    };

    const fetchAccounts = async () => {
        try {
            const response = await api.get("/accounts");

            setAccounts(response.data.accounts || []);
        } catch (error) {
            console.error(
                "FAILED TO LOAD ACCOUNTS:",
                error.response?.data || error.message
            );
        }
    };

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/transactions?page=${page}&limit=10&search=${encodeURIComponent(
                    search
                )}&type=${type}&category=${encodeURIComponent(
                    category
                )}&account=${account}&startDate=${startDate}&endDate=${endDate}&minAmount=${minAmount}&maxAmount=${maxAmount}`
            );

            console.log("TRANSACTIONS RESPONSE:", response.data);

            setTransactions(response.data.data || []);

            setPagination({
                total: response.data.pagination?.totalTransactions || 0,
                totalPages: response.data.pagination?.totalPages || 1,
            });
        } catch (error) {
            setError(
                error.response?.data?.errors?.join(", ") ||
                error.response?.data?.message ||
                "Failed to load transactions."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this transaction?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/transactions/${id}`);

            setTransactions((prev) =>
                prev.filter((transaction) => transaction._id !== id)
            );

            setPagination((prev) => ({
                ...prev,
                total: Math.max(prev.total - 1, 0),
            }));
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete transaction."
            );
        }
    };

    const handleExportCSV = async () => {
        try {
            const response = await api.get("/transactions/export/csv", {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(
                new Blob([response.data], { type: "text/csv" })
            );

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "transactions.csv");

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to export transactions."
            );
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchAccounts();
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [page, search, type, category, account, startDate, endDate, minAmount, maxAmount]);

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
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h3 className="fw-bold mb-1">
                                    Transactions
                                </h3>

                                <p className="text-muted mb-0">
                                    View your transaction history
                                </p>
                            </div>

                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-outline-success"
                                    onClick={handleExportCSV}
                                >
                                    Export CSV
                                </button>

                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate("/add-transaction")}
                                >
                                    + Add Transaction
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="text-center py-5">
                                <div
                                    className="spinner-border text-primary"
                                    role="status"
                                ></div>

                                <p className="text-muted mt-3 mb-0">
                                    Loading transactions...
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">
                                        Search Transactions
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by category or note..."
                                        value={search}
                                        onChange={(e) => {
                                            setPage(1);
                                            setSearch(e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">
                                        Transaction Type
                                    </label>

                                    <select
                                        className="form-select"
                                        value={type}
                                        onChange={(e) => {
                                            setPage(1);
                                            setType(e.target.value);
                                        }}
                                    >
                                        <option value="">All Types</option>
                                        <option value="Income">Income</option>
                                        <option value="Expense">Expense</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">
                                        Category
                                    </label>

                                    <select
                                        className="form-select"
                                        value={category}
                                        onChange={(e) => {
                                            setPage(1);
                                            setCategory(e.target.value);
                                        }}
                                    >
                                        <option value="">All Categories</option>

                                        {categories.map((item) => (
                                            <option key={item._id} value={item.name}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-12 col-md-4">
                                    <label className="form-label fw-semibold">
                                        Account
                                    </label>

                                    <select
                                        className="form-select"
                                        value={account}
                                        onChange={(e) => {
                                            setPage(1);
                                            setAccount(e.target.value);
                                        }}
                                    >
                                        <option value="">All Accounts</option>

                                        {accounts.map((item) => (
                                            <option key={item._id} value={item._id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-12 col-md-4">
                                    <label className="form-label fw-semibold">
                                        From Date
                                    </label>

                                    <input
                                        type="date"
                                        className="form-control"
                                        value={startDate}
                                        onChange={(e) => {
                                            setPage(1);
                                            setStartDate(e.target.value);
                                        }}
                                    />
                                </div>

                                <div className="col-12 col-md-4">
                                    <label className="form-label fw-semibold">
                                        To Date
                                    </label>

                                    <input
                                        type="date"
                                        className="form-control"
                                        value={endDate}
                                        onChange={(e) => {
                                            setPage(1);
                                            setEndDate(e.target.value);
                                        }}
                                    />
                                </div>

                                <div className="col-12 col-md-4">
                                    <label className="form-label fw-semibold">
                                        Min Amount
                                    </label>

                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Minimum amount"
                                        min="0"
                                        step="0.01"
                                        value={minAmount}
                                        onChange={(e) => {
                                            setPage(1);
                                            setMinAmount(e.target.value);
                                        }}
                                    />
                                </div>

                                <div className="col-12 col-md-4">
                                    <label className="form-label fw-semibold">
                                        Max Amount
                                    </label>

                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Maximum amount"
                                        min="0"
                                        step="0.01"
                                        value={maxAmount}
                                        onChange={(e) => {
                                            setPage(1);
                                            setMaxAmount(e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="table-responsive">
                                    <table className="table align-middle">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Category</th>
                                                <th>Account</th>
                                                <th>Type</th>
                                                <th>Note</th>
                                                <th className="text-end">
                                                    Amount
                                                </th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {transactions.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan="7"
                                                        className="text-center text-muted py-5"
                                                    >
                                                        No transactions found.
                                                    </td>
                                                </tr>
                                            ) : (
                                                transactions.map((transaction) => (
                                                    <tr key={transaction._id}>
                                                        <td>
                                                            {new Date(
                                                                transaction.date
                                                            ).toLocaleDateString("en-IN")}
                                                        </td>

                                                        <td>
                                                            {transaction.category}
                                                        </td>

                                                        <td>
                                                            {transaction.account?.name ||
                                                                "N/A"}
                                                        </td>

                                                        <td>
                                                            <span
                                                                className={`badge ${transaction.type ===
                                                                    "Income"
                                                                    ? "bg-success"
                                                                    : "bg-danger"
                                                                    }`}
                                                            >
                                                                {transaction.type}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            {transaction.note || "-"}
                                                        </td>

                                                        <td
                                                            className={`text-end fw-semibold ${transaction.type ===
                                                                "Income"
                                                                ? "text-success"
                                                                : "text-danger"
                                                                }`}
                                                        >
                                                            {transaction.type === "Income"
                                                                ? "+"
                                                                : "-"}
                                                            ₹
                                                            {transaction.amount.toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </td>
                                                        <td className="text-end">
                                                            <button
                                                                className="btn btn-sm btn-outline-primary me-2"
                                                                onClick={() => navigate(`/edit-transaction/${transaction._id}`)}
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDelete(transaction._id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mt-4">
                                    <small className="text-muted">
                                        Total Transactions:{" "}
                                        {pagination.total}
                                    </small>

                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            disabled={page === 1}
                                            onClick={() =>
                                                setPage((prev) => prev - 1)
                                            }
                                        >
                                            Previous
                                        </button>

                                        <span className="btn btn-light btn-sm">
                                            Page {page} of{" "}
                                            {pagination.totalPages}
                                        </span>

                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            disabled={
                                                page >= pagination.totalPages
                                            }
                                            onClick={() =>
                                                setPage((prev) => prev + 1)
                                            }
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transactions;