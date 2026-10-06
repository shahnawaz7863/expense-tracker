import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Accounts = () => {
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    type: "Cash",
    balance: "",
    currency: "INR",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchAccounts = async () => {
    try {
      const response = await api.get("/accounts");

      setAccounts(response.data.accounts || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to load accounts."
      );
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/accounts", {
        name: formData.name,
        type: formData.type,
        balance: Number(formData.balance),
        currency: formData.currency,
      });

      setSuccess("Account created successfully!");

      setFormData({
        name: "",
        type: "Cash",
        balance: "",
        currency: "INR",
      });

      await fetchAccounts();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to create account."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (account) => {
    const name = window.prompt(
      "Enter account name:",
      account.name
    );

    if (name === null) return;

    const type = window.prompt(
      "Enter account type (Cash/Bank/UPI/Wallet/Credit Card/Other):",
      account.type
    );

    if (type === null) return;

    const balance = window.prompt(
      "Enter account balance:",
      account.balance
    );

    if (balance === null) return;

    const currency = window.prompt(
      "Enter currency:",
      account.currency || "INR"
    );

    if (currency === null) return;

    try {
      setError("");
      setSuccess("");

      await api.put(`/accounts/${account._id}`, {
        name,
        type,
        balance: Number(balance),
        currency,
      });

      setSuccess("Account updated successfully!");

      await fetchAccounts();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to update account."
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this account?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.delete(`/accounts/${id}`);

      setSuccess("Account deleted successfully!");

      await fetchAccounts();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to delete account."
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
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row g-4">
          {/* Create Account */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h3 className="fw-bold mb-1">
                  Add Account
                </h3>

                <p className="text-muted mb-4">
                  Add your bank, cash or wallet account
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
                      Account Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="e.g. Cash Wallet"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Account Type
                    </label>

                    <select
                      name="type"
                      className="form-select"
                      value={formData.type}
                      onChange={handleChange}
                    >
                      <option value="Cash">Cash</option>
                      <option value="Bank">Bank</option>
                      <option value="UPI">UPI</option>
                      <option value="Wallet">Wallet</option>
                      <option value="Credit Card">
                        Credit Card
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Opening Balance
                    </label>

                    <input
                      type="number"
                      name="balance"
                      className="form-control"
                      placeholder="Enter balance"
                      step="0.01"
                      value={formData.balance}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Currency
                    </label>

                    <input
                      type="text"
                      name="currency"
                      className="form-control"
                      value={formData.currency}
                      onChange={handleChange}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading
                      ? "Creating..."
                      : "Create Account"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Account List */}
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h3 className="fw-bold mb-4">
                  My Accounts
                </h3>

                {accounts.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    No accounts found.
                  </div>
                ) : (
                  <div className="row g-3">
                    {accounts.map((account) => (
                      <div
                        className="col-12 col-md-6"
                        key={account._id}
                      >
                        <div className="border rounded-4 p-3">
                          <h5 className="fw-bold mb-1">
                            {account.name}
                          </h5>

                          <small className="text-muted">
                            {account.type}
                          </small>

                          <div className="d-flex gap-2 mt-3">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEdit(account)}
                            >
                              Edit
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(account._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;