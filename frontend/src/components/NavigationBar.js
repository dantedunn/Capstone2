import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/NavigationBar.css"; // Make sure this file exists!

const NavigationBar = () => {
  const { user, logout } = useAuth();
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar__title">
        <Link to="/">Game Reviewer</Link>
      </div>
      <div className="navbar__links">
        {user ? (
          <>
            <span className="navbar__welcome">Welcome, {user.username}!</span>
            <Link to="/profile" className="navbar__link">
              Profile
            </Link>
            {user.role === "admin" && (
              <Link to="/admin" className="navbar__link">
                Admin
              </Link>
            )}
            <button onClick={handleLogout} className="navbar__button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar__link">
              Login
            </Link>
            <Link to="/signup" className="navbar__link">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
