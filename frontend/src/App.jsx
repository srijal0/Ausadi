import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./components/Landing-page"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Dashboard from "./components/Dashboard"
import ForgotPassword from "./components/forgot-password" // Added import
import "./App.css"
import "./Dashboard.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Added route */}
      </Routes>
    </Router>
  )
}

export default App
