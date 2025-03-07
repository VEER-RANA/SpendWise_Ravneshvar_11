import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import "../styles/AISuggestion.css";

const AISuggestion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [budgetPlan, setBudgetPlan] = useState(null);
  const [adjustedBudget, setAdjustedBudget] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const generateBudget = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get user data from location state or localStorage
        const userEmail = location.state?.userEmail || 
                         JSON.parse(localStorage.getItem("loggedInUser")).email;
        
        const response = await fetch("http://localhost:5000/generate-budget", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            email: userEmail,
            income: location.state?.income,
            categories: location.state?.categories
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBudgetPlan(data);
        setAdjustedBudget(data.category_budget);
      } catch (error) {
        console.error("Error generating budget:", error);
        setError("Failed to generate budget plan. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    generateBudget();
  }, [location.state]);

  const handleSliderChange = (category, value) => {
    setAdjustedBudget(prev => ({
      ...prev,
      [category]: parseFloat(value)
    }));
  };

  const handleSaveBudget = async () => {
    try {
      setIsLoading(true);
      const userEmail = location.state?.userEmail || 
                       JSON.parse(localStorage.getItem("loggedInUser")).email;

      // Check server connectivity first
      try {
        const healthCheck = await fetch("http://localhost:5000/health");
        if (!healthCheck.ok) {
          throw new Error("Server is not responding");
        }
      } catch (error) {
        throw new Error("Cannot connect to server. Please ensure the server is running and try again.");
      }

      // Proceed with saving budget
      const response = await fetch("http://localhost:5000/api/save-budget", {

        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: userEmail,
          income: budgetPlan.income,
          recommended_savings: budgetPlan.recommended_savings,
          category_budget: adjustedBudget,
          budget_tips: budgetPlan.budget_tips
        })
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server is not responding correctly. Please try again.");
      }

      const result = await response.json();
      
      if (result.success) {
        alert(result.message);
        navigate("/dashboard");
      } else {
        throw new Error(result.message || "Failed to save budget plan");
      }
    } catch (error) {
      console.error("Error saving budget:", error);
      alert(error.message || "Failed to save budget plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="ai-suggestion-container">
        <Navbar />
        <div className="content loading">
          <div className="loader"></div>
          <h2>Generating your personalized budget plan...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ai-suggestion-container">
        <Navbar />
        <div className="content error">
          <h2>{error}</h2>
          <button onClick={() => navigate("/add-income")} className="retry-btn">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!budgetPlan) {
    return (
      <div className="ai-suggestion-container">
        <Navbar />
        <div className="content">
          <h2>No budget plan available</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-suggestion-container">
      <Navbar />
      <div className="content">
        <h2>AI-Generated Budget Plan</h2>
        
        <div className="budget-overview">
          <div className="overview-card">
            <h3>Monthly Income</h3>
            <p>₹{budgetPlan.income.toLocaleString()}</p>
          </div>
          <div className="overview-card">
            <h3>Recommended Savings</h3>
            <p>₹{budgetPlan.recommended_savings.toLocaleString()}</p>
          </div>
        </div>

        <h2>Budget Categories</h2>
        <div className="budget-categories">
          {Object.entries(adjustedBudget).map(([category, amount]) => (
            <div key={category} className="category-card">
              <h3>{category}</h3>
              <p>AI Suggestion: ₹{amount.toLocaleString()}</p>
              <input
                type="range"
                min="0"
                max={budgetPlan.income}
                value={amount}
                onChange={(e) => handleSliderChange(category, e.target.value)}
                className="budget-slider"
              />
              <span>Adjusted: ₹{adjustedBudget[category].toLocaleString()}</span>
            </div>
          ))}
        </div>

        <h2>AI Budget Tips</h2>
        <div className="ai-suggestions">
          {budgetPlan.budget_tips.map((tip, index) => (
            <div key={index} className="suggestion-card">
              <p>{tip}</p>
            </div>
          ))}
        </div>

        <div className="ai-banner">
          <div className="ai-banner-text">
            <h2>Save Your Budget And Monthly Saving Goal</h2>
            <p>Secure your financial future by saving your customized budget adjustments today!</p>
            <button 
              className="save-btn" 
              onClick={handleSaveBudget}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Budget Plan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISuggestion;