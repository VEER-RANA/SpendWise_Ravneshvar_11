const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const axios = require("axios"); // ✅ Added axios for ML API calls

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// File Paths
const DATA_DIR = "./data";
const USERS_FILE = path.join(DATA_DIR, "users.json");
const INCOME_FILE = path.join(DATA_DIR, "incomeData.json");
const TRANSACTION_FILE = path.join(DATA_DIR, "transactions.json");
const BUDGET_FILE = path.join(DATA_DIR, "budgetPlans.json");

// Initialize data directory and files
const initializeDataFiles = () => {
  // Create data directory if it doesn't exist
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
    console.log("✅ Created data directory");
  }

  // Initialize JSON files if they don't exist
  const files = [USERS_FILE, INCOME_FILE, TRANSACTION_FILE, BUDGET_FILE];
  files.forEach(file => {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, '[]', 'utf8');
      console.log(`✅ Initialized ${path.basename(file)}`);
    }
  });
};

// ✅ Helper Function: Read JSON File
const readJSONFile = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '[]', 'utf8');
      return [];
    }
    const data = fs.readFileSync(filePath, "utf8");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

// ✅ Helper Function: Write JSON File
const writeJSONFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// Initialize data files before starting server
initializeDataFiles();

// Add a health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ✅ Route 1: Get All Users (For Login & Debugging)
app.get("/users", (req, res) => {
  res.json(readJSONFile(USERS_FILE));
});

// ✅ Route 2: Signup (Register New User)
app.post("/signup", (req, res) => {
  const newUser = req.body;
  let users = readJSONFile(USERS_FILE);

  if (users.some(user => user.email === newUser.email)) {
    return res.status(400).json({ error: "User already exists!" });
  }

  newUser.walletId = "WALLET-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  users.push(newUser);

  writeJSONFile(USERS_FILE, users);
  res.status(201).json({ message: "Signup successful!", user: newUser });
});

// ✅ Route 3: Store or Update Income and Categories (Fixes Duplication)
app.post("/add-income", (req, res) => {
  const { email, income, categories } = req.body;
  if (!email || !income || !categories || categories.length === 0) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  let incomeData = readJSONFile(INCOME_FILE);
  let userIndex = incomeData.findIndex(entry => entry.email === email);

  if (userIndex !== -1) {
    // ✅ Update existing user's income entry
    incomeData[userIndex].income = income;
    incomeData[userIndex].categories = [...new Set([...incomeData[userIndex].categories, ...categories])];
    incomeData[userIndex].date = new Date().toISOString();
  } else {
    // ✅ If user does not exist, create a new entry
    incomeData.push({ email, income, categories, date: new Date().toISOString() });
  }

  writeJSONFile(INCOME_FILE, incomeData);
  res.status(200).json({ message: "Income updated successfully!" });
});

// ✅ Route 4: Get User Income Data
app.get("/income", (req, res) => {
  try {
    const incomeData = readJSONFile(INCOME_FILE);
    console.log("Sending income data:", incomeData); // Debug log
    res.json(incomeData);
  } catch (error) {
    console.error("Error reading income data:", error);
    res.status(500).json({ error: "Failed to fetch income data" });
  }
});

// ✅ Route 5: Store Transactions in `transactions.json`
app.post("/add-transaction", (req, res) => {
  const { email, amount, category, description, date } = req.body;

  if (!email || !amount || !category) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  let transactionData = readJSONFile(TRANSACTION_FILE);
  let userIndex = transactionData.findIndex(entry => entry.email === email);

  if (userIndex !== -1) {
    // ✅ Append new transaction to user's existing data
    transactionData[userIndex].transactions.push({ amount, category, description, date });
  } else {
    // ✅ If user does not exist, create a new entry
    transactionData.push({ email, transactions: [{ amount, category, description, date }] });
  }

  writeJSONFile(TRANSACTION_FILE, transactionData);
  res.status(201).json({ message: "Transaction added successfully!" });
});

// ✅ Route 6: Get Transactions for a User
app.get("/transactions/:email", (req, res) => {
  const userEmail = req.params.email;
  let transactionData = readJSONFile(TRANSACTION_FILE);

  const userTransactions = transactionData.find(entry => entry.email === userEmail);
  if (userTransactions) {
    res.status(200).json(userTransactions.transactions);
  } else {
    res.status(200).json([]); // ✅ Return empty array if no transactions found
  }
});

// ✅ Route 7: Get User Categories
app.get("/user-categories/:email", (req, res) => {
  try {
    const userEmail = req.params.email;
    const incomeData = readJSONFile(INCOME_FILE);
    const userEntry = incomeData.find(entry => entry.email === userEmail);

    if (userEntry && userEntry.categories) {
      res.json({ categories: userEntry.categories });
    } else {
      res.status(404).json({ error: "No categories found for this user" });
    }
  } catch (error) {
    console.error("Error fetching user categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Route 8: Update User Categories
app.post("/update-categories", (req, res) => {
  const { email, newCategories } = req.body;

  if (!email || !newCategories) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  let incomeData = readJSONFile(INCOME_FILE);
  let userIndex = incomeData.findIndex(entry => entry.email === email);

  if (userIndex !== -1) {
    // Add new categories to existing ones, removing duplicates
    incomeData[userIndex].categories = [...new Set([...incomeData[userIndex].categories, ...newCategories])];
  } else {
    // If user doesn't exist, create new entry
    incomeData.push({
      email,
      income: 0,
      categories: newCategories,
      date: new Date().toISOString()
    });
  }

  writeJSONFile(INCOME_FILE, incomeData);
  res.status(200).json({ message: "Categories updated successfully!" });
});

// ✅ Route 9: Generate AI Suggested Budget & Savings Plan
app.post("/generate-budget", (req, res) => {
  try {
    const { email, income, categories } = req.body;
    
    if (!email || !income || !categories) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Simple budget allocation logic
    const categoryBudget = {};
    const totalCategories = categories.length;
    const baseAllocation = 0.7 * income / totalCategories; // 70% for expenses
    
    categories.forEach(category => {
      categoryBudget[category] = Math.round(baseAllocation);
    });

    const recommendedSavings = Math.round(0.3 * income); // 30% for savings

    const budgetPlan = {
      email,
      income,
      recommended_savings: recommendedSavings,
      category_budget: categoryBudget,
      generated_date: new Date().toISOString(),
      budget_tips: [
        "Try to save at least 30% of your income",
        "Track your expenses regularly",
        "Prioritize essential expenses",
        "Build an emergency fund",
        `Your recommended monthly savings: $${recommendedSavings}`
      ]
    };

    // Save to budgetPlans.json
    let budgetData = readJSONFile(BUDGET_FILE);
    let userIndex = budgetData.findIndex(entry => entry.email === email);

    if (userIndex !== -1) {
      budgetData[userIndex] = budgetPlan;
    } else {
      budgetData.push(budgetPlan);
    }

    writeJSONFile(BUDGET_FILE, budgetData);
    res.json(budgetPlan);
  } catch (error) {
    console.error("Error generating budget:", error);
    res.status(500).json({ error: "Failed to generate budget plan" });
  }
});

// ✅ Route 10: Save AI Suggested Budget & Saving Plan
app.post("/save-budget-plan", async (req, res) => {
    try {
        const { email, income, recommended_savings, category_budget, budget_tips } = req.body;

        if (!email || !category_budget) {
            return res.json({ success: false, message: "Missing required fields." });
        }

        let budgetData = readJSONFile(BUDGET_FILE);
        let userIndex = budgetData.findIndex(entry => entry.email === email);

        const updatedBudget = {
            email,
            income,
            recommended_savings,
            category_budget,
            budget_tips,
            date: new Date().toISOString()
        };

        if (userIndex !== -1) {
            budgetData[userIndex] = updatedBudget;
        } else {
            budgetData.push(updatedBudget);
        }

        const saved = writeJSONFile(BUDGET_FILE, budgetData);
        
        if (saved) {
            res.json({ success: true, message: "Budget plan saved successfully!" });
        } else {
            res.json({ success: false, message: "Failed to save budget plan" });
        }
    } catch (error) {
        console.error("Error saving budget plan:", error);
        res.json({ success: false, message: "An error occurred while saving the budget plan" });
    }
});

// // ✅ Route 11: Get AI Suggested Budget & Saving Plan
// // const BUDGET_FILE = "./data/budgetPlans.json";

// app.get("/budget-plan/:email", (req, res) => {
//     const userEmail = req.params.email;
//     let budgetData = readJSONFile(BUDGET_FILE);
//     const userBudget = budgetData.find(entry => entry.email === userEmail);

//     if (userBudget) {
//         res.status(200).json(userBudget);
//     } else {
//         console.log(`No budget plan found for ${userEmail}`);  // 🔍 Debug log
//         res.status(404).json({ error: "No budget plan found for this user." });
//     }
// });


// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Data directory: ${path.resolve(DATA_DIR)}`);
});

