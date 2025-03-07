import React from "react";
import Navbar from "../components/Navbar";
import "../styles/WalletOverview.css";

const WalletOverview = () => {
  return (
    <div className="wallet-container">
      <Navbar />
      <div className="wallet-content">
        {/* Wallet Balance Section */}
        <div className="wallet-balance">
          <h2>Wallet Balance</h2>
          <p className="balance-amount">💰 ₹1,250.00</p>
        </div>

        {/* Manage Funds Section */}
        <div className="manage-funds">
          <h2>Manage Your Funds</h2>
          <p>
            Easily add or withdraw funds using UPI or Mobile Money. Select your preferred method.
          </p>
          <div className="fund-buttons">
            <button className="secondary-btn">UPI</button>
            <button className="secondary-btn">Mobile Money</button>
          </div>
        </div>

        {/* Recent Transactions Section */}
        <h2 className="section-heading">Recent Transactions</h2>
        <div className="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Transaction Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2023-10-01</td>
                <td>₹50.00</td>
                <td>Deposit</td>
                <td>✔</td>
                <td><button className="primary-btn">View Details</button></td>
              </tr>
              <tr>
                <td>2023-09-28</td>
                <td>₹20.00</td>
                <td>Withdrawal</td>
                <td>✔</td>
                <td><button className="primary-btn">View Details</button></td>
              </tr>
              <tr>
                <td>2023-09-25</td>
                <td>₹100.00</td>
                <td>Purchase</td>
                <td>✔</td>
                <td><button className="primary-btn">View Details</button></td>
              </tr>
              <tr>
                <td>2023-09-20</td>
                <td>₹15.00</td>
                <td>Transfer</td>
                <td>✔</td>
                <td><button className="primary-btn">View Details</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WalletOverview;
