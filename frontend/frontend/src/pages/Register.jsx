import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register(
        formData.name,
        formData.email,
        formData.password
      );

      navigate("/login");
    } catch (error) {
      const validationErrors =
        error.response?.data?.errors;

      if (validationErrors?.length) {
        setError(validationErrors.join(", "));
      } else {
        setError(
          error.response?.data?.message ||
            "Registration failed."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">

            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-4 p-md-5">

                {/* Logo */}
                <div className="text-center mb-4">
                  <div
                    className="bg-primary text-white rounded-3 d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "55px",
                      height: "55px",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    ₹
                  </div>

                  <h2 className="fw-bold mb-2">
                    Create Account
                  </h2>

                  <p className="text-muted mb-0">
                    Start managing your money smarter
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="alert alert-danger py-2">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  {/* Name */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      className="form-control form-control-lg"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-lg"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Password
                    </label>

                    <input
                      type="password"
                      name="password"
                      className="form-control form-control-lg"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      minLength="6"
                      required
                    />
                  </div>

                  {/* Button */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                    disabled={loading}
                  >
                    {loading
                      ? "Creating Account..."
                      : "Create Account"}
                  </button>

                </form>

                {/* Login Link */}
                <div className="text-center mt-4">
                  <span className="text-muted">
                    Already have an account?{" "}
                  </span>

                  <Link
                    to="/login"
                    className="text-primary fw-semibold text-decoration-none"
                  >
                    Login
                  </Link>
                </div>

              </div>
            </div>

            <p className="text-center text-muted small mt-4">
              Expense Tracker
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;