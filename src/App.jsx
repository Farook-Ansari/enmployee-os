import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login.jsx";
import Home from "./components/Home.jsx";
import NewEmployee from "./components/NewEmployee.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/employees/new" element={<NewEmployee />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
