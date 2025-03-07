import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignupPage.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Signup Submission
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // ✅ Save new user in Local Storage
        localStorage.setItem("loggedInUser", JSON.stringify(result.user));
        
        alert(`Signup successful! Your Wallet ID: ${result.user.walletId}`);
        
        // ✅ Redirect to Dashboard
        navigate("/dashboard");
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create Account</h2>
        <p>Join us and start managing your finances!</p>

        <form className="signup-form" onSubmit={handleSignup}>
          <div className="input-group">
            <span className="icon">👤</span>
            <input type="text" name="fullName" placeholder="Enter your full name" required onChange={handleChange} />
          </div>

          <div className="input-group">
            <span className="icon">📧</span>
            <input type="email" name="email" placeholder="Your email address" required onChange={handleChange} />
          </div>

          <div className="input-group">
            <span className="icon">📞</span>
            <input type="tel" name="phone" placeholder="Your phone number" required onChange={handleChange} />
          </div>

          <div className="input-group">
            <span className="icon">🔒</span>
            <input type="password" name="password" placeholder="Create a password" required onChange={handleChange} />
          </div>

          <div className="terms">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">I agree with Terms & Conditions</label>
          </div>

          <button type="submit" className="primary-btn">Sign Up</button>
        </form>

        <p className="login-link">
          Already registered? <a href="/login">Log In</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
