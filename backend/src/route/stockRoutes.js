import express from "express";
import { stockController } from "../controller/stockController.js";

const router = express.Router();

router.get("/", stockController.getAll);
router.post("/", stockController.create);
router.put("/:id", stockController.update);
router.delete("/:id", stockController.deleteById);

export { router as stockRouter };
