import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import Navbar from "../components/Navbar.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [totalIncome, setTotalIncome] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      navigate("/");
    } else {
      setUser(loggedInUser);
      fetchUserIncome(loggedInUser.email);
    }
  }, [navigate]);

  const fetchUserIncome = async (email) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/income", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const incomeData = await response.json();
      const userIncomeEntry = incomeData.find(entry => entry.email === email);

      if (userIncomeEntry && typeof userIncomeEntry.income === 'number') {
        setTotalIncome(userIncomeEntry.income);
      } else {
        setTotalIncome(0);
        setError("No income data found. Please set up your income.");
      }
    } catch (error) {
      setError("Error loading income data. Please try again.");
      setTotalIncome(0);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">

        {/* Left Side - Welcome Section */}
        <div className="welcome-section">
          <h1>Welcome, {user?.name || 'User'}!</h1>
          {loading ? (
            <p>Loading income data...</p>
          ) : error ? (
            <div className="error-message">
              {error}
              <button onClick={() => navigate("/add-income")} className="setup-income-btn">
                Set Up Income
              </button>
            </div>
          ) : (
            <div className="income-display">
              <h2>Total Monthly Income</h2>
              <p className="income-amount">₹ {totalIncome.toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Right Side - Quick Actions */}
        <div className="quick-actions">
          <button onClick={() => navigate("/add-transaction")} className="action-btn transaction">
            <span className="btn-icon">💰</span>
            <span className="btn-text">Add Transaction</span>
          </button>
          <button onClick={() => navigate("/add-income")} className="action-btn income">
            <span className="btn-icon">📈</span>
            <span className="btn-text">Update Income</span>
          </button>
          <button onClick={() => navigate("/WalletOverview")} className="action-btn wallet">
            <span className="btn-icon">👛</span>
            <span className="btn-text">Go to Wallet</span>
          </button>
          <button onClick={() => navigate("/MakePayment")} className="action-btn payment">
            <span className="btn-icon">💳</span>
            <span className="btn-text">Make Payment</span>
          </button>
          <button onClick={() => navigate("/RewardsPage")} className="action-btn rewards">
            <span className="btn-icon">🎁</span>
            <span className="btn-text">Rewards</span>
          </button>
          <button onClick={handleLogout} className="action-btn logout">
            <span className="btn-icon">🚪</span>
            <span className="btn-text">Logout</span>
          </button>

          {/* New "Learn More" Button */}
          <button onClick={() => navigate("/LearningModules")} className="action-btn learn-more">
            <span className="btn-icon">📚</span>
            <span className="btn-text">Learn More</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;