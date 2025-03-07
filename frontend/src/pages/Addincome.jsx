import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddIncome.css";
import Navbar from "../components/Navbar.jsx";

const AddIncome = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    income: "",
    customCategory: "",
  });
  const [categories, setCategories] = useState([
    "Housing",
    "Food",
    "Transport",
    "Utilities",
    "Healthcare",
    "Entertainment",
    "Shopping",
    "Education",
    "Savings",
    "Investments"
  ]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Check if server is running and user is logged in
  useEffect(() => {
    const checkServerAndAuth = async () => {
      try {
        // Check server status
        const response = await fetch("http://localhost:5000/health");
        if (response.ok) {
          setServerStatus(true);
          setError(null);
        }
      } catch (error) {
        console.error("Server connection error:", error);
        setServerStatus(false);
        setError("Cannot connect to server. Please ensure the server is running.");
      }

      // Check authentication
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!user) {
        navigate("/");
      }
    };

    checkServerAndAuth();
  }, [navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  // Handle category addition
  const handleAddCategory = () => {
    const newCategory = formData.customCategory.trim();
    if (newCategory && !categories.includes(newCategory)) {
      setCategories(prev => [...prev, newCategory]);
      setFormData(prev => ({ ...prev, customCategory: "" }));
      setSuccessMessage("Category added successfully!");
      setTimeout(() => setSuccessMessage(""), 2000);
    } else if (categories.includes(newCategory)) {
      setError("This category already exists!");
    }
  };

  // Handle category selection
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedCategories(prev =>
      checked ? [...prev, name] : prev.filter(cat => cat !== name)
    );
    setError(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    if (!serverStatus) {
      setError("Server is not running. Please try again later.");
      return;
    }

    if (!formData.income || selectedCategories.length === 0) {
      setError("Please enter income and select at least one category.");
      return;
    }

    setIsLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!user?.email) {
        throw new Error("Please login again.");
      }

      const incomeData = {
        email: user.email,
        income: parseFloat(formData.income),
        categories: selectedCategories
      };

      // Save income
      const saveResponse = await fetch("http://localhost:5000/add-income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incomeData)
      });

      if (!saveResponse.ok) {
        throw new Error("Failed to save income. Please try again.");
      }

      await saveResponse.json();
      setSuccessMessage("Income saved successfully!");

      // Generate budget
      const generateResponse = await fetch("http://localhost:5000/generate-budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incomeData)
      });

      if (!generateResponse.ok) {
        throw new Error("Failed to generate budget. Please try again.");
      }

      const budgetPlan = await generateResponse.json();

      // Navigate to AI suggestion page
      navigate("/ai-suggestion", {
        state: {
          budgetPlan,
          userEmail: user.email,
          income: parseFloat(formData.income),
          categories: selectedCategories
        }
      });

    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="addincome-container">
      <Navbar />
      <div className="addincome-content">
        <div className="addincome-header">
          <h2>Set Up Your Monthly Income</h2>
          <p>Enter your monthly income and select expense categories to generate a personalized budget plan.</p>
        </div>

        {!serverStatus && (
          <div className="server-status-warning">
            <span className="warning-icon">⚠️</span>
            <span>Server is not running. Please start the server and refresh the page.</span>
          </div>
        )}

        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="success-message">
            <span className="success-icon">✅</span>
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="income-form">
          <div className="income-input-section">
            <label htmlFor="income">Monthly Income</label>
            <div className="income-input-wrapper">
              <span className="currency-symbol">₹</span>
              <input
                id="income"
                type="number"
                name="income"
                placeholder="Enter your monthly income"
                value={formData.income}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="income-input"
              />
            </div>
          </div>

          <div className="categories-section">
            <h3>Expense Categories</h3>
            <p>Select categories to track your expenses</p>
            
            <div className="categories-grid">
              {categories.map((category, index) => (
                <label key={index} className="category-checkbox">
                  <input
                    type="checkbox"
                    name={category}
                    onChange={handleCheckboxChange}
                    checked={selectedCategories.includes(category)}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="category-name">{category}</span>
                </label>
              ))}
            </div>

            <div className="custom-category-section">
              <input
                type="text"
                name="customCategory"
                placeholder="Add a custom category"
                value={formData.customCategory}
                onChange={handleInputChange}
                className="custom-category-input"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                disabled={!formData.customCategory.trim()}
                className="add-category-btn"
              >
                <span className="btn-icon">+</span>
                Add Category
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={isLoading || !formData.income || selectedCategories.length === 0 || !serverStatus}
            >
              {isLoading ? (
                <>
                  <span className="loader"></span>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span className="btn-icon">💰</span>
                  <span>Save & Generate Budget</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIncome;