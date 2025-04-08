import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Registration from "./components/Registration";
import MainApp from "./components/MainApp";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={() => {}} onRegister={() => {}} />}
        />
        <Route path="/reg" element={<Registration onLogin={() => {}} />} />
        <Route path="/main" element={<MainApp />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
