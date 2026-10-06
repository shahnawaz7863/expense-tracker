import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Categories = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    type: "Expense",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");

      setCategories(response.data.categories || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load categories."
      );
    }
  };

  useEffect(() => {
    fetchCategories();
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
      await api.post("/categories", {
        name: formData.name,
        type: formData.type,
        isActive: true,
      });

      setSuccess("Category created successfully!");

      setFormData({
        name: "",
        type: "Expense",
      });

      await fetchCategories();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create category."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (category) => {
    const name = window.prompt(
      "Enter category name:",
      category.name
    );

    if (name === null) return;

    const type = window.prompt(
      "Enter category type (Income/Expense):",
      category.type
    );

    if (type === null) return;

    try {
      setError("");
      setSuccess("");

      await api.put(`/categories/${category._id}`, {
        name,
        type,
        isActive: true,
      });

      setSuccess("Category updated successfully!");

      await fetchCategories();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update category."
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.delete(`/categories/${id}`);

      setSuccess("Category deleted successfully!");

      await fetchCategories();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete category."
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
          {/* Add Category */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h3 className="fw-bold mb-1">
                  Add Category
                </h3>

                <p className="text-muted mb-4">
                  Create income or expense categories
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
                      Category Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="e.g. Food"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Category Type
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

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading
                      ? "Creating..."
                      : "Create Category"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Category List */}
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h3 className="fw-bold mb-4">
                  My Categories
                </h3>

                {categories.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    No categories found.
                  </div>
                ) : (
                  <div className="row g-3">
                    {categories.map((category) => (
                      <div
                        className="col-12 col-md-6"
                        key={category._id}
                      >
                        <div className="border rounded-4 p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h5 className="fw-bold mb-1">
                                {category.name}
                              </h5>

                              <small className="text-muted">
                                {category.type}
                              </small>
                            </div>

                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() =>
                                  handleEdit(category)
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  handleDelete(category._id)
                                }
                              >
                                Delete
                              </button>
                            </div>
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

export default Categories;