// utils/userUtils.js

// ✅ Generate a Unique Wallet ID
export const generateWalletId = () => {
    return "WALLET-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  };
  