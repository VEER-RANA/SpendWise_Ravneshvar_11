import React from "react";
import Navbar from "../components/Navbar";
import "../styles/LearningModules.css";

const LearningModules = () => {
  return (
    <div className="learning-container">
      <Navbar />
      <div className="learning-content">
        {/* Learning Topics Section */}
        <h2 className="section-heading">Learning Topics</h2>
        <div className="topics-section">
          <div className="topic-card">
            <h3>Budgeting Basics</h3>
            <p>Understand the essentials of budgeting to manage your finances effectively.</p>
            <p className="progress">Progress: 45%</p>
            <button className="primary-btn">Start Learning</button>
          </div>
          <div className="topic-card">
            <h3>Smart Saving</h3>
            <p>Learn strategies to save money intelligently and achieve your goals.</p>
            <p className="progress">Progress: 30%</p>
            <button className="primary-btn">Start Learning</button>
          </div>
          <div className="topic-card">
            <h3>Investing 101</h3>
            <p>Discover the basics of investing and how to grow your wealth.</p>
            <p className="progress">Progress: 60%</p>
            <button className="primary-btn">Start Learning</button>
          </div>
          <div className="topic-card">
            <h3>Debt Management</h3>
            <p>Learn to manage and reduce debt effectively for better financial health.</p>
            <p className="progress">Progress: 20%</p>
            <button className="primary-btn">Start Learning</button>
          </div>
        </div>

        <button className="primary-btn large-btn">📘 Start Learning</button>

        {/* Completion Rewards Section */}
        <h2 className="section-heading">Completion Rewards</h2>
        <div className="rewards-section">
          <div className="reward-card">
            <h3>Free Transactions</h3>
            <p>Earn free transactions by completing modules.</p>
            <p>Keep learning to unlock more rewards.</p>
            <button className="secondary-btn">Start Now</button>
          </div>
          <div className="reward-card">
            <h3>Achievement Badge</h3>
            <p>Complete 5 topics to earn a badge.</p>
            <p>Track your progress and earn rewards.</p>
            <button className="secondary-btn">View Topics</button>
          </div>
          <div className="reward-card">
            <h3>Speed Bonus</h3>
            <p>Boost your learning speed and get rewards.</p>
            <p>Progress further to unlock bonuses.</p>
            <button className="secondary-btn">Learn More</button>
          </div>
        </div>

        <div className="progress-section">
          <p>Keep learning to earn more rewards!</p>
          <button className="primary-btn large-btn">🚀 Continue Learning</button>
        </div>
      </div>
    </div>
  );
};

export default LearningModules;