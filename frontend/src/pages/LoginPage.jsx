import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  // ✅ Prevent Immediate Redirect & Add "Go to Signup" Option
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setTimeout(() => {
        navigate("/dashboard"); // ✅ Redirect to Dashboard if logged in
      }, 2000); // ✅ Wait 2 seconds before redirecting
    }
  }, [navigate]);

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Login Submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/users");
      const users = await response.json();

      // ✅ Check if user exists and password matches
      const user = users.find(
        (u) => u.email.trim() === formData.email.trim() && u.password === formData.password
      );

      if (user) {
        // ✅ Save logged-in user in Local Storage
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        alert("Login successful! Redirecting to Dashboard.");
        navigate("/dashboard"); // ✅ Redirect to Dashboard
      } else {
        setError("Invalid email or password! Try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Error logging in. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Log In</h2>
        <p>Welcome back! Please enter your details to continue.</p>

        {error && <p className="error-msg">{error}</p>}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <span className="icon">📧</span>
            <input type="email" name="email" placeholder="Your email address" required onChange={handleChange} />
          </div>

          <div className="input-group">
            <span className="icon">🔒</span>
            <input type="password" name="password" placeholder="Enter your password" required onChange={handleChange} />
          </div>

          {/* ✅ Button Container to Ensure Same Size */}
          <div className="button-container">
            <button type="submit" className="primary-btn">Log In</button>
            <button className="secondary-btn" onClick={() => navigate("/signup")}>Go to Signup</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
