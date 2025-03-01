"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return
    }

    // Validate password length
    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    // Validate password match
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || []
    const userExists = users.some((user) => user.email === formData.email)

    if (!userExists) {
      setError("No account found with this email address")
      return
    }

    // Update password in localStorage
    const updatedUsers = users.map((user) => {
      if (user.email === formData.email) {
        return { ...user, password: formData.newPassword }
      }
      return user
    })

    localStorage.setItem("users", JSON.stringify(updatedUsers))
    alert("Password updated successfully!")
    navigate("/login")
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Reset Password</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Reset Password
          </button>
        </form>

        <div className="form-footer">
          <button onClick={() => navigate("/login")} className="back-button">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

