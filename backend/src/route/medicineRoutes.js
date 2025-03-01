import express from "express";
import { medicineController } from "../controller/medicineController.js";

const router = express.Router();

router.get("/", medicineController.getAll);
router.post("/", medicineController.create);
router.get("/:id", medicineController.getById);
router.put("/:id", medicineController.update);
router.delete("/:id", medicineController.deleteById);

export { router as medicineRouter };
