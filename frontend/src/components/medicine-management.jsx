"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Pill,
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  AlertCircle,
  Calendar,
  DollarSign,
} from "lucide-react";
import "../Dashboard.css";

const MedicineManagement = () => {
  const [medicines, setMedicines] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentMedicine, setCurrentMedicine] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    category: "",
    manufacturer: "",
    stock: 0,
    price: 0,
    expiryDate: "",
    status: "In Stock",
  });

  const API_URL = "http://localhost:4000/api/medicines";

  // Fetch medicines from backend on component mount
  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setMedicines(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching medicines:", error);
      });
  }, []);

  // Filter medicines based on search term and category
  const filteredMedicines = medicines.filter((medicine) => {
    return (
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === "" || medicine.category === filterCategory)
    );
  });

  // Get unique categories for filter dropdown
  const categories = [...new Set(medicines.map((medicine) => medicine.category))];

  const handleAddMedicine = async () => {
    try {
      const response = await axios.post(API_URL, newMedicine);
      setMedicines([...medicines, response.data.data]);
      setNewMedicine({
        name: "",
        category: "",
        manufacturer: "",
        stock: 0,
        price: 0,
        expiryDate: "",
        status: "In Stock",
      });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding medicine:", error);
      alert("Error adding medicine");
    }
  };

  const handleEditMedicine = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/${currentMedicine.id}`,
        currentMedicine
      );
      setMedicines(
        medicines.map((medicine) =>
          medicine.id === currentMedicine.id ? response.data.data : medicine
        )
      );
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating medicine:", error);
      alert("Error updating medicine");
    }
  };

  const handleDeleteMedicine = async () => {
    try {
      await axios.delete(`${API_URL}/${currentMedicine.id}`);
      setMedicines(
        medicines.filter((medicine) => medicine.id !== currentMedicine.id)
      );
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting medicine:", error);
      alert("Error deleting medicine");
    }
  };

  return (
    <div className="medicine-management">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Pill size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Medicines</h3>
            <p className="stat-value">{medicines.length}</p>
            <p className="stat-change positive">+12% from last month</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <AlertCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>Low Stock Items</h3>
            <p className="stat-value">
              {medicines.filter((m) => m.status === "Low Stock").length}
            </p>
            <p className="stat-change negative">+5% from last month</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <h3>Expiring Soon</h3>
            <p className="stat-value">12</p>
            <p className="stat-change neutral">No change</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <h3>Inventory Value</h3>
            <p className="stat-value">
              $
              {medicines
                .reduce((total, med) => total + med.price * med.stock, 0)
                .toFixed(2)}
            </p>
            <p className="stat-change positive">+8% from last month</p>
          </div>
        </div>
      </div>

      {/* Section Content */}
      <div className="section-content">
        <div className="section-header">
          <div className="search-filter-container">
            <div className="search-container">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search medicines..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-container">
              <Filter size={20} />
              <select
                className="filter-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="section-actions">
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={20} />
              Add Medicine
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Manufacturer</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.map((medicine) => (
                <tr key={medicine.id}>
                  <td>{medicine.name}</td>
                  <td>{medicine.category}</td>
                  <td>{medicine.manufacturer}</td>
                  <td>{medicine.stock} units</td>
                  <td>${medicine.price.toFixed(2)}</td>
                  <td>
                    {new Date(medicine.expiryDate).toLocaleDateString()}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        medicine.status === "In Stock" ? "in-stock" : "low-stock"
                      }`}
                    >
                      {medicine.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn edit"
                        onClick={() => {
                          setCurrentMedicine(medicine);
                          setShowEditModal(true);
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => {
                          setCurrentMedicine(medicine);
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

        {/* Pagination */}
        <div className="pagination">
          <button className="btn btn-outline" disabled>
            Previous
          </button>
          <div className="pagination-numbers">
            <button className="pagination-number active">1</button>
            <button className="pagination-number">2</button>
            <button className="pagination-number">3</button>
            <span>...</span>
            <button className="pagination-number">10</button>
          </div>
          <button className="btn btn-outline">Next</button>
        </div>
      </div>

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Medicine</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Medicine Name</label>
                <input
                  type="text"
                  value={newMedicine.name}
                  onChange={(e) =>
                    setNewMedicine({ ...newMedicine, name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={newMedicine.category}
                  onChange={(e) =>
                    setNewMedicine({ ...newMedicine, category: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Manufacturer</label>
                <input
                  type="text"
                  value={newMedicine.manufacturer}
                  onChange={(e) =>
                    setNewMedicine({ ...newMedicine, manufacturer: e.target.value })
                  }
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    value={newMedicine.stock}
                    onChange={(e) =>
                      setNewMedicine({
                        ...newMedicine,
                        stock: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newMedicine.price}
                    onChange={(e) =>
                      setNewMedicine({
                        ...newMedicine,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  value={newMedicine.expiryDate}
                  onChange={(e) =>
                    setNewMedicine({
                      ...newMedicine,
                      expiryDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={newMedicine.status}
                  onChange={(e) =>
                    setNewMedicine({ ...newMedicine, status: e.target.value })
                  }
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddMedicine}>
                Add Medicine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Medicine Modal */}
      {showEditModal && currentMedicine && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Medicine</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Medicine Name</label>
                <input
                  type="text"
                  value={currentMedicine.name}
                  onChange={(e) =>
                    setCurrentMedicine({ ...currentMedicine, name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={currentMedicine.category}
                  onChange={(e) =>
                    setCurrentMedicine({ ...currentMedicine, category: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Manufacturer</label>
                <input
                  type="text"
                  value={currentMedicine.manufacturer}
                  onChange={(e) =>
                    setCurrentMedicine({
                      ...currentMedicine,
                      manufacturer: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    value={currentMedicine.stock}
                    onChange={(e) =>
                      setCurrentMedicine({
                        ...currentMedicine,
                        stock: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={currentMedicine.price}
                    onChange={(e) =>
                      setCurrentMedicine({
                        ...currentMedicine,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  value={
                    currentMedicine.expiryDate
                      ? new Date(currentMedicine.expiryDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setCurrentMedicine({
                      ...currentMedicine,
                      expiryDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={currentMedicine.status}
                  onChange={(e) =>
                    setCurrentMedicine({ ...currentMedicine, status: e.target.value })
                  }
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleEditMedicine}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentMedicine && (
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
                Are you sure you want to delete <strong>{currentMedicine.name}</strong>?
              </p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteMedicine}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineManagement;
