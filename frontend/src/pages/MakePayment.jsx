import React from "react";
import Navbar from "../components/Navbar";
import "../styles/MakePayment.css";

const MakePayment = () => {
  return (
    <div className="make-payment-container">
      <Navbar />
      <div className="content">
        <h2 className="wallet-balance-title">Wallet Balance</h2>
        <p className="wallet-balance">₹ 1,250.75</p>
        <span className="real-time-update">Updated in real-time</span>

        <h3 className="transfer-details-title">Transfer Details</h3>

        <form className="transfer-form">
          <input type="text" placeholder="📥 Recipient’s Wallet ID" required />
          <select required>
            <option value="">📂 Select Category</option>
            <option value="food">Food</option>
            <option value="shopping">Shopping</option>
            <option value="bills">Bills</option>
          </select>
          <input type="number" placeholder="💰 Amount to Transfer" required />
          <input type="password" placeholder="🔒 Enter PIN/OTP" required />
          <button type="submit" className="send-money-btn">
            Send Money
          </button>
        </form>

        <div className="secure-message">
          <h3>Send Money Securely</h3>
          <p>Transfer funds instantly with QuickTransfer. Click 'Send Money' to complete your transaction securely.</p>
        </div>
      </div>
    </div>
  );
};

export default MakePayment;