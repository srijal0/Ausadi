import { StockItem } from "../models/stockItem.js";
// Get all stock items
const getAll = async (req, res) => {
  try {
    const stockItems = await StockItem.findAll();
    res.status(200).send({ data: stockItems, message: "Stock items fetched successfully" });
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch stock items", error: error.message });
  }
};
// Create a new stock item
const create = async (req, res) => {
  try {
    const {
      medicineId,
      medicineName,
      batchNumber,
      quantity,
      reorderLevel,
      unitCost,
      sellingPrice,
      expiryDate,
      supplier,
    } = req.body;
    if (!medicineName || !batchNumber || !unitCost || !sellingPrice || !expiryDate || !supplier) {
      return res.status(400).send({ message: "Missing required fields" });
    }
    const stockItem = await StockItem.create({
      medicineId: medicineId || 0,
      medicineName,
      batchNumber,
      quantity: quantity || 0,
      reorderLevel: reorderLevel || 0,
      unitCost,
      sellingPrice,
      expiryDate,
      supplier,
      lastUpdated: new Date(),
    });
    res.status(201).send({ data: stockItem, message: "Stock item created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Failed to create stock item", error: error.message });
  }
};

// Update an existing stock item
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const stockItem = await StockItem.findByPk(id);
    if (!stockItem) {
      return res.status(404).send({ message: "Stock item not found" });
    }
    const updatedStock = await stockItem.update({
      ...req.body,
      lastUpdated: new Date(),
    });
    res.status(200).send({ data: updatedStock, message: "Stock item updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Failed to update stock item", error: error.message });
  }
};

// Delete a stock item
const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const stockItem = await StockItem.findByPk(id);
    if (!stockItem) {
      return res.status(404).send({ message: "Stock item not found" });
    }
    await stockItem.destroy();
    res.status(200).send({ message: "Stock item deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Failed to delete stock item", error: error.message });
  }
};

export const stockController = {
  getAll,
  create,
  update,
  deleteById,
};
