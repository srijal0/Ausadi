import { Medicine } from "../models/medicine.js";

const getAll = async (req, res) => {
  try {
    const medicines = await Medicine.findAll();
    res.status(200).send({ data: medicines, message: "Medicines fetched successfully" });
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch medicines", error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { name, category, manufacturer, stock, price, expiryDate, status } = req.body;
    if (!name || !category || !manufacturer || !price || !expiryDate) {
      return res.status(400).send({ message: "Missing required fields" });
    }
    const medicine = await Medicine.create({
      name,
      category,
      manufacturer,
      stock: stock || 0,
      price,
      expiryDate,
      status: status || "In Stock",
    });
    res.status(201).send({ data: medicine, message: "Medicine created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Failed to create medicine", error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findByPk(id);
    if (!medicine) {
      return res.status(404).send({ message: "Medicine not found" });
    }
    res.status(200).send({ data: medicine, message: "Medicine fetched successfully" });
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch medicine", error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findByPk(id);
    if (!medicine) {
      return res.status(404).send({ message: "Medicine not found" });
    }
    const updatedMedicine = await medicine.update(req.body);
    res.status(200).send({ data: updatedMedicine, message: "Medicine updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Failed to update medicine", error: error.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findByPk(id);
    if (!medicine) {
      return res.status(404).send({ message: "Medicine not found" });
    }
    await medicine.destroy();
    res.status(200).send({ message: "Medicine deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Failed to delete medicine", error: error.message });
  }
};

export const medicineController = {
  getAll,
  create,
  getById,
  update,
  deleteById,
};
