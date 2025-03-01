"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart2,
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Upload,
} from "lucide-react";
import "../Dashboard.css";

const StockManagement = () => {
  const [stockItems, setStockItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [currentStock, setCurrentStock] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("");
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [newStock, setNewStock] = useState({
    medicineId: 0,
    medicineName: "",
    batchNumber: "",
    quantity: 0,
    reorderLevel: 0,
    unitCost: 0,
    sellingPrice: 0,
    expiryDate: "",
    supplier: "",
    lastUpdated: new Date().toISOString().split("T")[0],
  });

  const API_URL = "http://localhost:4000/api/stock";

  // Fetch stock items on component mount
  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setStockItems(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching stock items:", error);
      });
  }, []);

  // Filter stock items based on search term and supplier
  const filteredStockItems = stockItems.filter((item) => {
    return (
      item.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterSupplier === "" || item.supplier === filterSupplier)
    );
  });

  // Get unique suppliers for filter dropdown
  const suppliers = [...new Set(stockItems.map((item) => item.supplier))];

  // Calculate stock metrics
  const totalStockValue = stockItems.reduce((total, item) => total + item.quantity * item.unitCost, 0);
  const lowStockCount = stockItems.filter((item) => item.quantity < item.reorderLevel).length;
  const expiringCount = stockItems.filter((item) => {
    const expiryDate = new Date(item.expiryDate);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiryDate < threeMonthsFromNow;
  }).length;

  // Add stock item via API
  const handleAddStock = async () => {
    try {
      const response = await axios.post(API_URL, newStock);
      setStockItems([...stockItems, response.data.data]);
      setNewStock({
        medicineId: 0,
        medicineName: "",
        batchNumber: "",
        quantity: 0,
        reorderLevel: 0,
        unitCost: 0,
        sellingPrice: 0,
        expiryDate: "",
        supplier: "",
        lastUpdated: new Date().toISOString().split("T")[0],
      });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding stock item:", error);
      alert("Error adding stock item");
    }
  };

  // Edit stock item via API
  const handleEditStock = async () => {
    try {
      const response = await axios.put(`${API_URL}/${currentStock.id}`, currentStock);
      setStockItems(stockItems.map((item) => (item.id === currentStock.id ? response.data.data : item)));
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating stock item:", error);
      alert("Error updating stock item");
    }
  };

  // Delete stock item via API
  const handleDeleteStock = async () => {
    try {
      await axios.delete(`${API_URL}/${currentStock.id}`);
      setStockItems(stockItems.filter((item) => item.id !== currentStock.id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting stock item:", error);
      alert("Error deleting stock item");
    }
  };

  // Adjust stock quantity via API (using update endpoint)
  const handleAdjustStock = async () => {
    try {
      const adjustedQuantity = currentStock.quantity + Number.parseInt(adjustmentQuantity, 10);
      const updatedStock = { ...currentStock, quantity: adjustedQuantity, lastUpdated: new Date().toISOString().split("T")[0] };
      const response = await axios.put(`${API_URL}/${currentStock.id}`, updatedStock);
      setStockItems(stockItems.map((item) => (item.id === currentStock.id ? response.data.data : item)));
      setAdjustmentQuantity(0);
      setAdjustmentReason("");
      setShowAdjustModal(false);
    } catch (error) {
      console.error("Error adjusting stock:", error);
      alert("Error adjusting stock");
    }
  };

  const openAdjustModal = (stock) => {
    setCurrentStock(stock);
    setAdjustmentQuantity(0);
    setShowAdjustModal(true);
  };

  return (
    <div className="stock-management">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <BarChart2 size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Stock Value</h3>
            <p className="stat-value">${totalStockValue.toFixed(2)}</p>
            <p className="stat-change positive">+8% from last month</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-info">
            <h3>Low Stock Items</h3>
            <p className="stat-value">{lowStockCount}</p>
            <p className="stat-change negative">+3 from last week</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <h3>Expiring Soon</h3>
            <p className="stat-value">{expiringCount}</p>
            <p className="stat-change neutral">No change</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingDown size={24} />
          </div>
          <div className="stat-info">
            <h3>Stock Turnover</h3>
            <p className="stat-value">4.2x</p>
            <p className="stat-change positive">+0.3 from last quarter</p>
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
                placeholder="Search stock items..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-container">
              <Filter size={20} />
              <select
                className="filter-select"
                value={filterSupplier}
                onChange={(e) => setFilterSupplier(e.target.value)}
              >
                <option value="">All Suppliers</option>
                {suppliers.map((supplier) => (
                  <option key={supplier} value={supplier}>
                    {supplier}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="section-actions">
            <button className="btn btn-outline" onClick={() => {}}>
              <Download size={20} />
              Export
            </button>
            <button className="btn btn-outline" onClick={() => {}}>
              <Upload size={20} />
              Import
            </button>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={20} />
              Add Stock
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Batch Number</th>
                <th>Quantity</th>
                <th>Reorder Level</th>
                <th>Unit Cost</th>
                <th>Selling Price</th>
                <th>Expiry Date</th>
                <th>Supplier</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStockItems.map((item) => (
                <tr key={item.id} className={item.quantity < item.reorderLevel ? "low-stock-row" : ""}>
                  <td>{item.medicineName}</td>
                  <td>{item.batchNumber}</td>
                  <td className={item.quantity < item.reorderLevel ? "text-danger" : ""}>{item.quantity}</td>
                  <td>{item.reorderLevel}</td>
                  <td>${item.unitCost.toFixed(2)}</td>
                  <td>${item.sellingPrice.toFixed(2)}</td>
                  <td>{new Date(item.expiryDate).toLocaleDateString()}</td>
                  <td>{item.supplier}</td>
                  <td>{new Date(item.lastUpdated).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn adjust" onClick={() => openAdjustModal(item)} title="Adjust Stock">
                        <RefreshCw size={16} />
                      </button>
                      <button
                        className="action-btn edit"
                        onClick={() => {
                          setCurrentStock(item);
                          setShowEditModal(true);
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => {
                          setCurrentStock(item);
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

        {/* Pagination (static example) */}
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

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Stock</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Medicine Name</label>
                <input
                  type="text"
                  value={newStock.medicineName}
                  onChange={(e) => setNewStock({ ...newStock, medicineName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Batch Number</label>
                <input
                  type="text"
                  value={newStock.batchNumber}
                  onChange={(e) => setNewStock({ ...newStock, batchNumber: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={newStock.quantity}
                    onChange={(e) => setNewStock({ ...newStock, quantity: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Reorder Level</label>
                  <input
                    type="number"
                    value={newStock.reorderLevel}
                    onChange={(e) => setNewStock({ ...newStock, reorderLevel: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Unit Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newStock.unitCost}
                    onChange={(e) => setNewStock({ ...newStock, unitCost: Number.parseFloat(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Selling Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newStock.sellingPrice}
                    onChange={(e) => setNewStock({ ...newStock, sellingPrice: Number.parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  value={newStock.expiryDate}
                  onChange={(e) => setNewStock({ ...newStock, expiryDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Supplier</label>
                <input
                  type="text"
                  value={newStock.supplier}
                  onChange={(e) => setNewStock({ ...newStock, supplier: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddStock}>
                Add Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Stock Modal */}
      {showEditModal && currentStock && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Stock</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Medicine Name</label>
                <input
                  type="text"
                  value={currentStock.medicineName}
                  onChange={(e) => setCurrentStock({ ...currentStock, medicineName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Batch Number</label>
                <input
                  type="text"
                  value={currentStock.batchNumber}
                  onChange={(e) => setCurrentStock({ ...currentStock, batchNumber: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={currentStock.quantity}
                    onChange={(e) =>
                      setCurrentStock({ ...currentStock, quantity: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Reorder Level</label>
                  <input
                    type="number"
                    value={currentStock.reorderLevel}
                    onChange={(e) =>
                      setCurrentStock({ ...currentStock, reorderLevel: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Unit Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={currentStock.unitCost}
                    onChange={(e) => setCurrentStock({ ...currentStock, unitCost: Number.parseFloat(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Selling Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={currentStock.sellingPrice}
                    onChange={(e) =>
                      setCurrentStock({ ...currentStock, sellingPrice: Number.parseFloat(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  value={currentStock.expiryDate}
                  onChange={(e) => setCurrentStock({ ...currentStock, expiryDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Supplier</label>
                <input
                  type="text"
                  value={currentStock.supplier}
                  onChange={(e) => setCurrentStock({ ...currentStock, supplier: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleEditStock}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentStock && (
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
                Are you sure you want to delete stock for <strong>{currentStock.medicineName}</strong>?
              </p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteStock}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {showAdjustModal && currentStock && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Adjust Stock Quantity</h2>
              <button className="close-btn" onClick={() => setShowAdjustModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Medicine Name</label>
                <input type="text" value={currentStock.medicineName} disabled />
              </div>
              <div className="form-group">
                <label>Current Quantity</label>
                <input type="number" value={currentStock.quantity} disabled />
              </div>
              <div className="form-group">
                <label>Adjustment (+ for addition, - for reduction)</label>
                <input
                  type="number"
                  value={adjustmentQuantity}
                  onChange={(e) => setAdjustmentQuantity(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>New Quantity</label>
                <input
                  type="number"
                  value={currentStock.quantity + Number.parseInt(adjustmentQuantity || 0)}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Reason for Adjustment</label>
                <select value={adjustmentReason} onChange={(e) => setAdjustmentReason(e.target.value)}>
                  <option value="">Select a reason</option>
                  <option value="New Stock">New Stock</option>
                  <option value="Damaged">Damaged</option>
                  <option value="Expired">Expired</option>
                  <option value="Inventory Count">Inventory Count</option>
                  <option value="Return">Return</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {adjustmentReason === "Other" && (
                <div className="form-group">
                  <label>Specify Reason</label>
                  <textarea rows="3"></textarea>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowAdjustModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAdjustStock}
                disabled={!adjustmentReason || adjustmentQuantity === 0}
              >
                Confirm Adjustment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManagement;
