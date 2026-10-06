import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const EditTransaction = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [accountsResponse, categoriesResponse, transactionsResponse] =
          await Promise.all([
            api.get("/accounts"),
            api.get("/categories"),
            api.get(`/transactions?limit=100`),
          ]);

        const accountsData = accountsResponse.data.accounts || [];
        const categoriesData = categoriesResponse.data.categories || [];
        const transactionsData = transactionsResponse.data.data || [];

        const transaction = transactionsData.find(
          (item) => item._id === id
        );

        if (!transaction) {
          setError("Transaction not found.");
          return;
        }

        setAccounts(accountsData);
        setCategories(categoriesData);

        setFormData({
          amount: transaction.amount || "",
          type: transaction.type || "Expense",
          category: transaction.category || "",
          account: transaction.account?._id || transaction.account || "",
          note: transaction.note || "",
          date: transaction.date
            ? new Date(transaction.date).toISOString().split("T")[0]
            : "",
          recurring: transaction.recurring || false,
          recurrence: transaction.recurrence || "",
        });
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load transaction."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.put(`/transactions/${id}`, {
        amount: Number(formData.amount),
        type: formData.type,
        category: formData.category,
        account: formData.account,
        note: formData.note,
        date: formData.date,
        recurring: formData.recurring,
        recurrence: formData.recurring
          ? formData.recurrence
          : null,
      });

      setSuccess("Transaction updated successfully!");

      setTimeout(() => {
        navigate("/transactions");
      }, 1000);
    } catch (error) {
      setError(
        error.response?.data?.errors?.join(", ") ||
          error.response?.data?.message ||
          "Failed to update transaction."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-3">Loading transaction...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-dark bg-primary shadow-sm">
        <div className="container-fluid px-4">
          <span className="navbar-brand fw-bold">
            ₹ Expense Tracker
          </span>

          <button
            className="btn btn-light btn-sm"
            onClick={() => navigate("/transactions")}
          >
            Back to Transactions
          </button>
        </div>
      </nav>

      <div className="container py-5">
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <h3 className="fw-bold mb-1">Edit Transaction</h3>

            <p className="text-muted mb-4">
              Update your transaction details
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
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    Amount
                  </label>

                  <input
                    type="number"
                    name="amount"
                    className="form-control"
                    min="0.01"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    Transaction Type
                  </label>

                  <select
                    name="type"
                    className="form-select"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                  </select>
                </div>

                <div className="col-12 col-md-6">
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
                      .filter(
                        (item) => item.type === formData.type
                      )
                      .map((item) => (
                        <option
                          key={item._id}
                          value={item.name}
                        >
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="col-12 col-md-6">
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

                    {accounts.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    Date
                  </label>

                  <input
                    type="date"
                    name="date"
                    className="form-control"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Note
                  </label>

                  <textarea
                    name="note"
                    className="form-control"
                    rows="3"
                    placeholder="Enter transaction note"
                    value={formData.note}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <div className="form-check">
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
                </div>

                {formData.recurring && (
                  <div className="col-12 col-md-6">
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
                        Select Recurrence
                      </option>
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  </div>
                )}

                <div className="col-12 d-flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? "Updating..." : "Update Transaction"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/transactions")}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTransaction;