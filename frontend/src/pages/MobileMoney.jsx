import React from "react";
import Navbar from "../components/Navbar";
import "../styles/MobileMoney.css";

const MobileMoney = () => {
  return (
    <div className="mobile-money-container">
      <Navbar />
      <div className="mobile-money-content">
        <div className="info-box">
          <h2>How to use Mobile Money?</h2>
          <p>
            → Find a Cash Agent. Hand over the cash to the agent, who will
            securely deposit the equivalent amount into your digital wallet.
          </p>
          <p>
            → Request a withdrawal, and the agent will give you cash in exchange
            for the digital balance deducted from your wallet.
          </p>
        </div>
        <div className="locator-section">
          <label className="locator-label">Cash Agent Locator</label>
          <input
            type="text"
            placeholder="🔍 Enter your location"
            className="location-input"
          />
        </div>
        <div className="map-container">
          <label className="map-label">Cash Agent Location</label>
          <iframe
            title="Cash Agent Location"
            className="map-frame"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.2799191407!2d-74.25986441834118!3d40.69767006853367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDI3JzUzLjQiTiA3NMKwMTUnMjguOCJX!5e0!3m2!1sen!2sus!4v1620983324620!5m2!1sen!2sus"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
        <div className="buttons">
          <button className="call-agent-btn">📞 Call Agent</button>
          <button className="get-directions-btn">📍 Get Directions</button>
        </div>
      </div>
    </div>
  );
};

export default MobileMoney;
