import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

const Navbar = ({ loggedIn, setLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // remove token
    setLoggedIn(false); // update state
    navigate("/login"); // redirect without page reload
  };

  return (
    <nav
      className="navbar"
      style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}
    >
      <h2 style={{ display: "inline", marginRight: "2rem" }}>
        Healthcare System
      </h2>
      <div style={{ display: "inline" }}>
        {loggedIn ? (
          <>
            <Link to="/patients" style={{ marginRight: "1rem" }}>
              Patients
            </Link>
            <Link to="/doctors" style={{ marginRight: "1rem" }}>
              Doctors
            </Link>
            <Link to="/mappings" style={{ marginRight: "1rem" }}>
              Mappings
            </Link>
            <button onClick={handleLogout} style={{ marginLeft: "2rem" }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/register" style={{ marginRight: "1rem" }}>
              Register
            </Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
