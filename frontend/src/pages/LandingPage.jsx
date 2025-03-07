import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar.jsx";
import "../styles/LandingPage.css";
import budgetImage from "../assets/59104.jpg";

const LandingPage = () => {
  return (
    <motion.div 
      className="landing-page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Navbar />

      {/* Hero Section */}
      <motion.div 
        className="hero-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <h1>Master Your Finances</h1>
        <p>Take control with SmartBudget’s powerful tools.</p>
        <div className="hero-buttons">
          <motion.button 
            className="primary-btn"
            whileHover={{ scale: 1.05 }}
          >
            Track Budget
          </motion.button>
          <motion.button 
            className="secondary-btn"
            whileHover={{ scale: 1.05 }}
          >
            Join Us Now
          </motion.button>
        </div>
      </motion.div>

      {/* Image Section */}
      <motion.div 
        className="image-section"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <img src={budgetImage} alt="Budget Planning" />
      </motion.div>

      {/* Features Section */}
      <motion.div 
        className="features-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <h2>Features</h2>
        <div className="features-grid">
          {[
            { title: "AI Budgeting", desc: "Personalized budgeting suggestions powered by AI.", icon: "📄" },
            { title: "Add Transaction", desc: "Maintain expenses by adding all transactions.", icon: "🔄" },
            { title: "Personalized Wallet", desc: "Keep track of your wallet for easy future payments.", icon: "💰" },
            { title: "Make Payment", desc: "Make payments through our wallet or UPI.", icon: "💳" }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              className="feature-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <span className="icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.button 
          className="explore-btn"
          whileHover={{ scale: 1.05 }}
        >
          Explore features
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default LandingPage;
