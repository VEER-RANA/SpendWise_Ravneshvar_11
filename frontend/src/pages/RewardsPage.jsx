import React from "react";
import Navbar from "../components/Navbar";
import "../styles/RewardsPage.css";

const RewardsPage = () => {
  return (
    <div className="rewards-container">
      <Navbar />
      <div className="rewards-content">
        <h2 className="section-heading">Earned Badges</h2>
        <div className="badges-section">
          <div className="badge">
            <span className="badge-icon">👤</span>
            <div className="badge-text">
              <h3>Budget Master</h3>
              <p>Awarded for exceptional budgeting skills.</p>
            </div>
          </div>
          <div className="badge">
            <span className="badge-icon">👤</span>
            <div className="badge-text">
              <h3>Debt Destroyer</h3>
              <p>Acknowledged for eliminating debt effectively.</p>
            </div>
          </div>
          <div className="badge">
            <span className="badge-icon">👤</span>
            <div className="badge-text">
              <h3>Frugal Finder</h3>
              <p>Celebrated for finding great deals and savings.</p>
            </div>
          </div>
        </div>

        <div className="progress-section">
          <h3>Congratulations on Completing Your Savings Challenge!</h3>
          <p>Enjoy zero fees on your next 3 wallet transactions.</p>
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <p>Keep up the great work and continue building your savings!</p>
        </div>

        <div className="claim-rewards">
          <h2>Claim Your Rewards</h2>
          <p>
            Unlock exclusive benefits and maximize your savings by redeeming your rewards now.
          </p>
          <button className="redeem-button">Redeem Rewards</button>
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;
