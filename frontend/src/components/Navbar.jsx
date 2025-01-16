import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BookOpenIcon } from "@heroicons/react/24/outline";
const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 text-xl font-bold text-blue-600"
            >
              <BookOpenIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Memories</h1>
            </Link>
          </div>

          {/* Conditional Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* User Greeting and Logout */}
                <button
                  onClick={logout}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login and Register Links (Visible when not logged in) */}
                <Link to="/login" className="text-gray-700 hover:text-gray-900">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
