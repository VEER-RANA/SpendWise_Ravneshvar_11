// import React from "react";
// import Dashboard from "./pages/Dashboard.jsx";


// function App() {
//   return (
//     <div className="App">
//       <Dashboard />
//     </div>
//   );
// }

// export default App;


// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Dashboard from "./pages/Dashboard";
// import AddTransaction from "./pages/AddTransaction";
// import AddIncome from "./pages/Addincome";
// import AISuggestion from "./pages/AISuggestion"; // Import AISuggestion Page

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Dashboard />} />
//         <Route path="/add-transaction" element={<AddTransaction />} />
//         <Route path="/add-income" element={<AddIncome />} />
//         <Route path="/ai-suggestion" element={<AISuggestion />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;




// import React from "react";
// import LearningModules from "./pages/LearningModules.jsx";

// function App() {
//   return (
//     <div className="App">
//       <LearningModules />
//     </div>
//   );
// }

// export default App;

// export default App;

// import React from "react";
// import Addincome from "./pages/AddTransaction.jsx";

// function App() {
//   return (
//     <div className="App">
//       <Addincome />
//     </div>
//   );
// }

// export default App;

// import React from "react";
// import Addincome from "./pages/AISuggestion.jsx";

// function App() {
//   return (
//     <div className="App">
//       <Addincome />
//     </div>
//   );
// }

// export default App;



// import React from "react";
// import Addincome from "./pages/LandingPage.jsx";

// function App() {
//   return (
//     <div className="App">
//       <Addincome />
//     </div>
//   );
// }

// export default App;

// import React from "react";
// import Addincome from "./pages/SignupPage.jsx";

// function App() {
//   return (
//     <div className="App">
//       <Addincome />
//     </div>
//   );
// }

// export default App;


// main part

import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import AddIncome from "./pages/Addincome"; // ✅ Fixed Import Case Sensitivity
import AISuggestion from "./pages/AISuggestion"; // ✅ AI Suggestion Page
import AddTransaction from "./pages/AddTransaction"; // ✅ Import AddTransaction Page
import MakePayment from "./pages/MakePayment";
import WalletOverview from "./pages/WalletOverview";
import LearningModules from "./pages/LearningModules.jsx";

import RewardsPage from "./pages/RewardsPage";


const ProtectedRoute = ({ element }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      navigate("/signup"); // ✅ Redirect to Signup if user is not logged in
    }
  }, [navigate]);

  return element;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/add-income" element={<ProtectedRoute element={<AddIncome />} />} />
        <Route path="/ai-suggestion" element={<ProtectedRoute element={<AISuggestion />} />} />
        <Route path="/add-transaction" element={<ProtectedRoute element={<AddTransaction />} />} /> {/* ✅ Added AddTransaction Route */}
        <Route path="/MakePayment" element={<ProtectedRoute element={<MakePayment />} />} />
        <Route path="/WalletOverview" element={<ProtectedRoute element={<WalletOverview />} />} />
        <Route path="/MakePayment" element={<ProtectedRoute element={<MakePayment />} />} />
        <Route path="/RewardsPage" element={<ProtectedRoute element={<RewardsPage />} />} />
        <Route path="/LearningModules" element={<ProtectedRoute element={<LearningModules />} />} />
      </Routes>
    </Router>
  );
};

export default App;

