import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // console.log("Auth provider reinitialized");
    if (token) {
      // Verify token and set user
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    // console.log("calling verify");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log("verification done");

      setUser(response.data);
    } catch (error) {
      // console.log("Something went wrong executing catch block :", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (token) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/auth/verify-email?token=${token}`
      );
      return response.data;
    } catch (error) {
      // console.log("contenxtt", error.response?.data?.message);
      throw new Error(error.response?.data?.message || "Verification failed");
    }
  };
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        { email, password }
      );
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setUser(user);
      return true;
    } catch (error) {
      // console.log("contenxr", error);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        userData
      );
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setUser(user);
      return response.data.message;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, verifyEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
