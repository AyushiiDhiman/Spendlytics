import express from "express";
import { categorizeExpense, getInsights } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/categorize", categorizeExpense);
router.get("/insights", getInsights);

export default router;
