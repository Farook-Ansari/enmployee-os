import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login.jsx";
import AppLayout from "./components/AppLayout.jsx";
import Home from "./components/Home.jsx";
import NewEmployee from "./components/NewEmployee.jsx";
import NewEmployeeStep2 from "./components/NewEmployeeStep2.jsx";
import NewEmployeeStep3 from "./components/NewEmployeeStep3.jsx";
import SLAAgreement from "./components/SLAAgreement.jsx";
import Profile from "./components/Profile.jsx";
import Chat from "./components/Chat.jsx"; // Added import for Chat component

export default function App() {
  return (
    <Routes>
      {/* Root/Login */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Everything after login shares sidebar */}
      <Route element={<AppLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/employees/new" element={<NewEmployee />} />
        <Route path="/employees/new/step-2" element={<NewEmployeeStep2 />} />
        <Route path="/employees/new/step-3" element={<NewEmployeeStep3 />} />
        <Route path="/employees/new/step-4" element={<SLAAgreement />} />
        <Route path="/employees/profile" element={<Profile />} />
        <Route path="/chat" element={<Chat />} /> {/* Added Chat route */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}