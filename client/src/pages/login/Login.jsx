import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/Authcontext";
import "./login.scss";
import { request } from "../../lib/req";

export const Login = () => {
  const [inputs, setInputs] = useState({
    access: "", // This will handle both email and phone number
    password: "",
  });
  const [err, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const access = formData.get("access");
    const password = formData.get("password");

    console.log("Form Data:", { access, password });

    try {
      const res = await request.post("/auth/login", {
        access,
        password,
      });

      console.log("Login response:", res.data);

      updateUser(res.data);

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          "An unexpected error occurred. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="loginapp">
      <div className="container">
        <div className="auth">
          <h1>Welcome Back ☺️! Login</h1>
          <form onSubmit={handleSubmit}>
            <input
              required
              type="text"
              placeholder="Email or Phone Number"
              name="access"
              onChange={handleChange}
              value={inputs.access}
            />
            <input
              required
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={inputs.password}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
            {err && <p>{err}</p>}
            <span>
              Don't you have an account? <Link to="/register">Register</Link>
            </span>
            <span>
              <Link to="/forgetPassword"> Forget Password?</Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};
