"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Plus, Edit, Trash2, UserCheck, UserX, Eye, EyeOff } from "lucide-react";
import "../Dashboard.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    status: "Active", // default status active
  });

  const API_URL = "http://localhost:4000/api/users";

  // Fetch all users from backend on component mount
  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        // Assuming all fetched users are active
        setUsers(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calculate user metrics (all users are active)
  const activeUsers = users.length;
  const inactiveUsers = 0;

  // API call to add a new user
  const handleAddUser = async () => {
    try {
      // Force status to Active for all new users
      const payload = { ...newUser, status: "Active" };
      const response = await axios.post(API_URL, payload);
      setUsers([...users, response.data.data]);
      setNewUser({
        name: "",
        email: "",
        password: "",
        status: "Active",
      });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Error adding user");
    }
  };

  // API call to update a user
  const handleEditUser = async () => {
    try {
      // Ensure status remains Active
      const updatedUser = { ...currentUser, status: "Active" };
      const response = await axios.put(`${API_URL}/${currentUser.id}`, updatedUser);
      setUsers(users.map((user) => (user.id === currentUser.id ? response.data.data : user)));
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user");
    }
  };

  // API call to delete a user
  const handleDeleteUser = async () => {
    try {
      await axios.delete(`${API_URL}/${currentUser.id}`);
      setUsers(users.filter((user) => user.id !== currentUser.id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user");
    }
  };

  // Toggle user status locally (in this case, all users are Active, so this can be removed or disabled)
  // We'll leave a dummy function in case you need to extend functionality later.
  const toggleUserStatus = async (userId) => {
    // Since all users are active, this function currently does nothing.
    alert("User status cannot be toggled. All users are active.");
  };

  return (
    <div className="user-management">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <UserCheck size={24} />
          </div>
          <div className="stat-info">
            <h3>Active Users</h3>
            <p className="stat-value">{activeUsers}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <UserX size={24} />
          </div>
          <div className="stat-info">
            <h3>Inactive Users</h3>
            <p className="stat-value">{inactiveUsers}</p>
          </div>
        </div>
      </div>

      {/* Section Content */}
      <div className="section-content">
        <div className="section-header">
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={20} />
            Add User
          </button>
        </div>

        {/* Users Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="status-badge active">Active</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn"
                        onClick={() => toggleUserStatus(user.id)}
                        title="Active"
                      >
                        <UserCheck size={16} />
                      </button>
                      <button
                        className="action-btn edit"
                        onClick={() => {
                          setCurrentUser(user);
                          setShowEditModal(true);
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => {
                          setCurrentUser(user);
                          setShowDeleteModal(true);
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New User</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAddUser}
                disabled={!newUser.name || !newUser.email || !newUser.password}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && currentUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit User</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={currentUser.name}
                  onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleEditUser}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete user <strong>{currentUser.name}</strong>?
              </p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteUser}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
