"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Pill, Package, Users, ShoppingCart, BarChart2, Bell, Search, LogOut, Menu, X } from 'lucide-react'

// Import feature components
import MedicineManagement from "./medicine-management"
import StockManagement from "./stock-management"
import SalesAndBilling from "./sales-billing"
import UserManagement from "./user-management"

const Dashboard = () => {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState("medicine")

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleLogout = () => {
    // You can add any cleanup logic here (e.g., clearing local storage)
    localStorage.removeItem('user');
    window.location.href = '/login';  // Direct navigation to login page
  };

  // Render the appropriate component based on active section
  const renderActiveComponent = () => {
    switch (activeSection) {
      case "medicine":
        return <MedicineManagement />
      case "stock":
        return <StockManagement />
      case "sales":
        return <SalesAndBilling />
      case "users":
        return <UserManagement />
      default:
        return <MedicineManagement />
    }
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <Pill className="logo-icon" />
            <span className="logo-text">Ausadi</span>
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeSection === "medicine" ? "active" : ""}`}
            onClick={() => setActiveSection("medicine")}
          >
            <Package size={20} />
            <span>Medicine Management</span>
          </button>
          <button
            className={`nav-item ${activeSection === "stock" ? "active" : ""}`}
            onClick={() => setActiveSection("stock")}
          >
            <BarChart2 size={20} />
            <span>Stock Management</span>
          </button>
          <button
            className={`nav-item ${activeSection === "sales" ? "active" : ""}`}
            onClick={() => setActiveSection("sales")}
          >
            <ShoppingCart size={20} />
            <span>Sales & Billing</span>
          </button>
          <button
            className={`nav-item ${activeSection === "users" ? "active" : ""}`}
            onClick={() => setActiveSection("users")}
          >
            <Users size={20} />
            <span>User Management</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="page-title">
              {activeSection === "medicine" && "Medicine Management"}
              {activeSection === "stock" && "Stock Management"}
              {activeSection === "sales" && "Sales & Billing"}
              {activeSection === "users" && "User Management"}
            </h1>
          </div>
          <div className="header-right">
            <div className="search-container">
              <Search size={20} className="search-icon" />
              <input type="text" placeholder="Search..." className="search-input" />
            </div>
            <button className="notification-button">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            <div className="user-profile">
            
              <span className="profile-name">John Doe</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Render the active component */}
          {renderActiveComponent()}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
