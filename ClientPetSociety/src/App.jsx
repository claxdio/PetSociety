import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import Locate from "./pages/Locate";
import Forum from "./pages/Forum";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/search"
          element={<Search />}
        />
        <Route
          path="/logout"
          element={<Logout />}
        />
        <Route
          path="/register"
          element={<RegisterAndLogout />}
        />
        <Route
          path="/perfil/:username"
          element={<Profile />}
        />
        <Route
          path="/admin"
          element={<AdminLogin />}
        />
        <Route
          path="/admin/panel"
          element={<AdminPanel />}
        />
        <Route
          path="*"
          element={<NotFound />}
        />
        <Route 
          path="/locate" 
          element={<Locate />} 
        />
        <Route
          path="/forum"
          element={<Forum />} 
        />  
      </Routes>
    </BrowserRouter>
  );
}

export default App;