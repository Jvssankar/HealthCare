import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Mappings from "./pages/Mappings";
import Navbar from "./components/NavBar.js";
import ProtectedRoute from "./components/ProtectedRoute";
import { getToken } from "./utils/auth";
import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(!!getToken()); // track login state

  return (
    <BrowserRouter>
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={<Login onLogin={() => setLoggedIn(true)} />}
        />
        <Route
          path="/patients"
          element={<ProtectedRoute Component={Patients} />}
        />
        <Route
          path="/doctors"
          element={<ProtectedRoute Component={Doctors} />}
        />
        <Route
          path="/mappings"
          element={<ProtectedRoute Component={Mappings} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
