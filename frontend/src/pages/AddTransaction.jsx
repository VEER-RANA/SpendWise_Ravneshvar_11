import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import "../styles/AddTransaction.css";

const AddTransaction = () => {
  const navigate = useNavigate();
  const [transactionAmount, setTransactionAmount] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserCategories();
  }, []);

  const fetchUserCategories = async () => {
    try {
      const userEmail = JSON.parse(localStorage.getItem("loggedInUser"))?.email;
      if (!userEmail) {
        setError("Please log in to add transactions");
        return;
      }

      const response = await fetch(`http://localhost:5000/user-categories/${userEmail}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("Please set up your income and categories first");
          navigate("/add-income");
          return;
        }
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      if (data.categories && data.categories.length > 0) {
        setCategories(data.categories);
      } else {
        setError("Please set up your income and categories first");
        navigate("/add-income");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Error loading categories. Please try again.");
    }
  };

  const handleAddCategory = async () => {
    if (customCategory.trim() !== "" && !categories.includes(customCategory)) {
      try {
        const userEmail = JSON.parse(localStorage.getItem("loggedInUser"))?.email;
        if (!userEmail) {
          alert("Please log in to add custom categories");
          return;
        }

        const response = await fetch("http://localhost:5000/update-categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email: userEmail, 
            newCategories: [customCategory] 
          }),
        });

        if (response.ok) {
          setCategories(prev => [...prev, customCategory]);
          setCustomCategory("");
        } else {
          throw new Error("Failed to update categories");
        }
      } catch (error) {
        console.error("Error adding category:", error);
        alert("Failed to add custom category. Please try again.");
      }
    }
  };

  const handleSaveTransaction = async () => {
    if (!transactionAmount || !category) {
      alert("Please enter amount and select a category.");
      return;
    }

    try {
      const userEmail = JSON.parse(localStorage.getItem("loggedInUser"))?.email;
      if (!userEmail) {
        alert("Please log in to add transactions");
        return;
      }

      const transactionData = {
        email: userEmail,
        amount: parseFloat(transactionAmount),
        category,
        description,
        date: new Date().toISOString(),
      };

      const response = await fetch("http://localhost:5000/add-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        alert("Transaction saved successfully!");
        navigate("/dashboard");
      } else {
        throw new Error("Failed to save transaction");
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("Failed to save transaction. Please try again.");
    }
  };

  return (
    <div className="addtransaction-container">
      <Navbar />
      <div className="content">
        <h2>Add a Transaction</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form">
          <input
            type="number"
            placeholder="₹ Transaction Amount"
            value={transactionAmount}
            onChange={(e) => setTransactionAmount(e.target.value)}
            required
          />
          <div className="category-section">
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="custom-category-section">
            <input
              type="text"
              placeholder="Enter Custom Category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
            />
            <button type="button" onClick={handleAddCategory}>+ Add Custom Category</button>
          </div>
          <input
            type="text"
            placeholder="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="save-btn" onClick={handleSaveTransaction}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;