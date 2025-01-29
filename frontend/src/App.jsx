import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import JournalEntryForm from "./pages/JournalEntryForm";
import NotFound from "./pages/NotFound";
import Memory from "./pages/Memory";
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/memory"
              element={
                <PrivateRoute>
                  <Memory />
                </PrivateRoute>
              }
            />
            <Route
              path="/new-memory"
              element={
                <PrivateRoute>
                  <JournalEntryForm />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
