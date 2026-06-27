import express from "express";
import { getExpenses, addExpense, deleteExpense, getSummary } from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getExpenses);
router.post("/", addExpense);
router.delete("/:id", deleteExpense);
router.get("/summary", getSummary);

export default router;
