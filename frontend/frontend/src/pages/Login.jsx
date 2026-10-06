import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
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
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
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
                    Welcome Back
                  </h2>

                  <p className="text-muted mb-0">
                    Login to manage your expenses
                  </p>
                </div>

                {error && (
                  <div className="alert alert-danger py-2">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>

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
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>

                </form>

                <div className="text-center mt-4">
                  <span className="text-muted">
                    Don't have an account?{" "}
                  </span>

                  <Link
                    to="/register"
                    className="text-primary fw-semibold text-decoration-none"
                  >
                    Create Account
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

export default Login;