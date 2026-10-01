import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ReportItem from "./pages/ReportItem";
import Items from "./pages/Items";
import MyReports from "./pages/MyReports";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/report-item" element={<ReportItem />} />
                <Route path="/items" element={<Items />} />
                <Route path="/my-reports" element={<MyReports />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
