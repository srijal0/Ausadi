"use client"

import { useState } from "react"
import {
  ShoppingCart,
  Search,
  Plus,
  Filter,
  DollarSign,
  CreditCard,
  Calendar,
  FileText,
  Printer,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react"

import "../Dashboard.css"

const SalesAndBilling = () => {
  const [medicines, setMedicines] = useState([
    { id: 1, name: "Paracetamol 500mg", category: "Pain Relief", price: 5.99, stock: 120 },
    { id: 2, name: "Amoxicillin 250mg", category: "Antibiotics", price: 12.5, stock: 45 },
    { id: 3, name: "Loratadine 10mg", category: "Antihistamine", price: 8.25, stock: 78 },
    { id: 4, name: "Omeprazole 20mg", category: "Antacid", price: 15.75, stock: 15 },
    { id: 5, name: "Metformin 500mg", category: "Antidiabetic", price: 9.99, stock: 92 },
  ])

  const [sales, setSales] = useState([
    {
      id: 1,
      invoiceNumber: "INV-2024-001",
      date: "2024-02-15",
      customer: "John Doe",
      items: [
        { id: 1, name: "Paracetamol 500mg", quantity: 2, price: 5.99 },
        { id: 3, name: "Loratadine 10mg", quantity: 1, price: 8.25 },
      ],
      subtotal: 20.23,
      tax: 2.02,
      discount: 0,
      total: 22.25,
      paymentMethod: "Cash",
      status: "Completed",
    },
    {
      id: 2,
      invoiceNumber: "INV-2024-002",
      date: "2024-02-16",
      customer: "Jane Smith",
      items: [
        { id: 2, name: "Amoxicillin 250mg", quantity: 1, price: 12.5 },
        { id: 4, name: "Omeprazole 20mg", quantity: 1, price: 15.75 },
      ],
      subtotal: 28.25,
      tax: 2.83,
      discount: 5,
      total: 26.08,
      paymentMethod: "Credit Card",
      status: "Completed",
    },
    {
      id: 3,
      invoiceNumber: "INV-2024-003",
      date: "2024-02-18",
      customer: "Robert Johnson",
      items: [{ id: 5, name: "Metformin 500mg", quantity: 3, price: 9.99 }],
      subtotal: 29.97,
      tax: 3.0,
      discount: 0,
      total: 32.97,
      paymentMethod: "Cash",
      status: "Completed",
    },
    {
      id: 4,
      invoiceNumber: "INV-2024-004",
      date: "2024-02-20",
      customer: "Emily Davis",
      items: [
        { id: 1, name: "Paracetamol 500mg", quantity: 1, price: 5.99 },
        { id: 2, name: "Amoxicillin 250mg", quantity: 1, price: 12.5 },
        { id: 3, name: "Loratadine 10mg", quantity: 2, price: 8.25 },
      ],
      subtotal: 34.99,
      tax: 3.5,
      discount: 10,
      total: 28.49,
      paymentMethod: "Credit Card",
      status: "Completed",
    },
    {
      id: 5,
      invoiceNumber: "INV-2024-005",
      date: "2024-02-22",
      customer: "Michael Wilson",
      items: [
        { id: 4, name: "Omeprazole 20mg", quantity: 2, price: 15.75 },
        { id: 5, name: "Metformin 500mg", quantity: 1, price: 9.99 },
      ],
      subtotal: 41.49,
      tax: 4.15,
      discount: 0,
      total: 45.64,
      paymentMethod: "Cash",
      status: "Completed",
    },
  ])

  const [cart, setCart] = useState([])
  const [customer, setCustomer] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("Cash")
  const [discount, setDiscount] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [salesSearchTerm, setSalesSearchTerm] = useState("")
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("")
  const [filterDateRange, setFilterDateRange] = useState({ start: "", end: "" })
  const [expandedSale, setExpandedSale] = useState(null)
  const [activeTab, setActiveTab] = useState("newSale")

  // Filter medicines based on search term and category
  const filteredMedicines = medicines.filter((medicine) => {
    return (
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === "" || medicine.category === filterCategory)
    )
  })

  // Get unique categories for filter dropdown
  const categories = [...new Set(medicines.map((medicine) => medicine.category))]

  // Filter sales based on search term, payment method, and date range
  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.invoiceNumber.toLowerCase().includes(salesSearchTerm.toLowerCase()) ||
      sale.customer.toLowerCase().includes(salesSearchTerm.toLowerCase())
    const matchesPayment = filterPaymentMethod === "" || sale.paymentMethod === filterPaymentMethod

    let matchesDate = true
    if (filterDateRange.start && filterDateRange.end) {
      const saleDate = new Date(sale.date)
      const startDate = new Date(filterDateRange.start)
      const endDate = new Date(filterDateRange.end)
      matchesDate = saleDate >= startDate && saleDate <= endDate
    }

    return matchesSearch && matchesPayment && matchesDate
  })

  // Calculate cart totals
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const tax = subtotal * 0.1 // 10% tax
  const discountAmount = (subtotal * discount) / 100
  const total = subtotal + tax - discountAmount

  // Calculate sales metrics
  const todaySales = sales
    .filter((sale) => {
      const today = new Date().toISOString().split("T")[0]
      return sale.date === today
    })
    .reduce((total, sale) => total + sale.total, 0)

  const monthlySales = sales
    .filter((sale) => {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const saleDate = new Date(sale.date)
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear
    })
    .reduce((total, sale) => total + sale.total, 0)

  const totalTransactions = sales.length
  const averageTransaction = sales.reduce((total, sale) => total + sale.total, 0) / totalTransactions

  const addToCart = (medicine) => {
    const existingItem = cart.find((item) => item.id === medicine.id)

    if (existingItem) {
      setCart(cart.map((item) => (item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }])
    }
  }

  const updateCartItemQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCart([])
    setCustomer("")
    setPaymentMethod("Cash")
    setDiscount(0)
  }

  const completeSale = () => {
    if (cart.length === 0 || !customer) {
      alert("Please add items to cart and enter customer information")
      return
    }

    const newSale = {
      id: sales.length + 1,
      invoiceNumber: `INV-2024-${String(sales.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      customer,
      items: [...cart],
      subtotal,
      tax,
      discount,
      total,
      paymentMethod,
      status: "Completed",
    }

    setSales([...sales, newSale])
    clearCart()
    alert("Sale completed successfully!")
  }

  const toggleSaleDetails = (id) => {
    setExpandedSale(expandedSale === id ? null : id)
  }

  return (
    <div className="sales-billing">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <ShoppingCart size={24} />
          </div>
          <div className="stat-info">
            <h3>Today's Sales</h3>
            <p className="stat-value">${todaySales.toFixed(2)}</p>
            <p className="stat-change positive">+15% from yesterday</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <h3>Monthly Sales</h3>
            <p className="stat-value">${monthlySales.toFixed(2)}</p>
            <p className="stat-change positive">+8% from last month</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Transactions</h3>
            <p className="stat-value">{totalTransactions}</p>
            <p className="stat-change neutral">No change</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <h3>Avg. Transaction</h3>
            <p className="stat-value">${averageTransaction.toFixed(2)}</p>
            <p className="stat-change positive">+3% from last week</p>
          </div>
        </div>
      </div>

      {/* Improved Tabs Layout */}
      <div className="tabs-container bg-white shadow-sm rounded-lg mb-6">
        <div className="tabs flex border-b">
          <button
            className={`tab px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === "newSale"
                ? "text-primary border-primary"
                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("newSale")}
          >
            New Sale
          </button>
          <button
            className={`tab px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === "salesHistory"
                ? "text-primary border-primary"
                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("salesHistory")}
          >
            Sales History
          </button>
        </div>
      </div>

      {/* New Sale Tab */}
      {activeTab === "newSale" && (
        <div className="section-content">
          <div className="sales-container grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Products Section - Left Side */}
            <div className="products-section lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
              <div className="section-header mb-6">
                <h3 className="text-lg font-semibold mb-4">Products</h3>
                <div className="search-filter-container flex gap-4">
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
              </div>

              {/* Improved Products Grid */}
              <div className="products-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredMedicines.map((medicine) => (
                  <div
                    key={medicine.id}
                    className="product-card bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors"
                  >
                    <div className="product-info space-y-2">
                      <h4 className="font-medium text-gray-900">{medicine.name}</h4>
                      <p className="product-category text-sm text-gray-500">{medicine.category}</p>
                      <p className="product-price text-lg font-semibold text-primary">${medicine.price.toFixed(2)}</p>
                      <p className={`product-stock text-sm ${medicine.stock < 10 ? "text-red-500" : "text-gray-600"}`}>
                        {medicine.stock} in stock
                      </p>
                    </div>
                    <button
                      className="btn btn-primary w-full mt-4 justify-center"
                      onClick={() => addToCart(medicine)}
                      disabled={medicine.stock <= 0}
                    >
                      <Plus size={16} />
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Section - Right Side */}
            <div className="cart-section bg-white p-6 rounded-lg shadow-sm">
              <div className="section-header mb-6">
                <h3 className="text-lg font-semibold">Current Sale</h3>
                <button className="btn btn-outline btn-sm mt-2" onClick={clearCart}>
                  Clear Cart
                </button>
              </div>

              {/* Improved Customer Info */}
              <div className="customer-info mb-6">
                <div className="form-group">
                  <label className="text-sm font-medium text-gray-700">Customer Name</label>
                  <input
                    type="text"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    placeholder="Enter customer name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              {/* Improved Cart Items */}
              <div className="cart-items flex-1 overflow-auto mb-6">
                {cart.length === 0 ? (
                  <div className="empty-cart text-center py-8">
                    <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium">Cart is empty</p>
                    <p className="text-sm text-gray-500">Add products to begin a new sale</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="cart-item bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                          </div>
                          <button className="text-gray-400 hover:text-red-500" onClick={() => removeFromCart(item.id)}>
                            <X size={16} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="quantity-control flex items-center border rounded-md">
                            <button
                              className="px-3 py-1 border-r hover:bg-gray-100"
                              onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateCartItemQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                              className="w-16 text-center border-none focus:ring-0"
                            />
                            <button
                              className="px-3 py-1 border-l hover:bg-gray-100"
                              onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Improved Cart Summary */}
              <div className="cart-summary border-t pt-4 space-y-4">
                <div className="summary-row flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row flex justify-between text-sm">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="summary-row flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Discount (%)</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discount}
                      onChange={(e) => setDiscount(Number.parseInt(e.target.value) || 0)}
                      className="w-16 rounded-md border-gray-300 text-sm"
                    />
                  </div>
                  <span className="font-medium text-sm">-${discountAmount.toFixed(2)}</span>
                </div>
                <div className="summary-row flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>

                {/* Improved Payment Method Selection */}
                <div className="payment-method">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full rounded-md border-gray-300"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Mobile Payment">Mobile Payment</option>
                  </select>
                </div>

                {/* Complete Sale Button */}
                <button
                  className="btn btn-primary w-full justify-center py-3 text-lg"
                  onClick={completeSale}
                  disabled={cart.length === 0 || !customer}
                >
                  <CreditCard size={20} />
                  Complete Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales History Tab */}
      {activeTab === "salesHistory" && (
        <div className="section-content">
          <div className="section-header">
            <div className="search-filter-container">
              <div className="search-container">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by invoice or customer..."
                  className="search-input"
                  value={salesSearchTerm}
                  onChange={(e) => setSalesSearchTerm(e.target.value)}
                />
              </div>
              <div className="filter-container">
                <Filter size={20} />
                <select
                  className="filter-select"
                  value={filterPaymentMethod}
                  onChange={(e) => setFilterPaymentMethod(e.target.value)}
                >
                  <option value="">All Payment Methods</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Mobile Payment">Mobile Payment</option>
                </select>
              </div>
              <div className="date-range-container">
                <input
                  type="date"
                  value={filterDateRange.start}
                  onChange={(e) => setFilterDateRange({ ...filterDateRange, start: e.target.value })}
                  placeholder="Start Date"
                />
                <span>to</span>
                <input
                  type="date"
                  value={filterDateRange.end}
                  onChange={(e) => setFilterDateRange({ ...filterDateRange, end: e.target.value })}
                  placeholder="End Date"
                />
              </div>
            </div>
            <div className="section-actions">
              <button className="btn btn-outline">
                <Printer size={20} />
                Print Report
              </button>
            </div>
          </div>

          {/* Sales Table */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Invoice #</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <>
                    <tr key={sale.id}>
                      <td>
                        <button className="expand-btn" onClick={() => toggleSaleDetails(sale.id)}>
                          {expandedSale === sale.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </td>
                      <td>{sale.invoiceNumber}</td>
                      <td>{sale.date}</td>
                      <td>{sale.customer}</td>
                      <td>{sale.items.length} items</td>
                      <td>${sale.total.toFixed(2)}</td>
                      <td>{sale.paymentMethod}</td>
                      <td>
                        <span className={`status-badge ${sale.status.toLowerCase()}`}>{sale.status}</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn print" title="Print Invoice">
                            <Printer size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedSale === sale.id && (
                      <tr className="expanded-row">
                        <td colSpan="9">
                          <div className="sale-details">
                            <h4>Sale Details</h4>
                            <div className="sale-items">
                              <table className="details-table">
                                <thead>
                                  <tr>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {sale.items.map((item, index) => (
                                    <tr key={index}>
                                      <td>{item.name}</td>
                                      <td>{item.quantity}</td>
                                      <td>${item.price.toFixed(2)}</td>
                                      <td>${(item.quantity * item.price).toFixed(2)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className="sale-summary">
                              <div className="summary-row">
                                <span>Subtotal:</span>
                                <span>${sale.subtotal.toFixed(2)}</span>
                              </div>
                              <div className="summary-row">
                                <span>Tax:</span>
                                <span>${sale.tax.toFixed(2)}</span>
                              </div>
                              <div className="summary-row">
                                <span>Discount:</span>
                                <span>${((sale.subtotal * sale.discount) / 100).toFixed(2)}</span>
                              </div>
                              <div className="summary-row total">
                                <span>Total:</span>
                                <span>${sale.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
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
      )}
    </div>
  )
}

export default SalesAndBilling

