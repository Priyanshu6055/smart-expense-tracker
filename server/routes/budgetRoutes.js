const express = require("express");
const {
  setBudget,
  getBudget,
  checkBudgetStatus,
  getBudgetSuggestion,   // <-- Import AI suggestion controller
} = require("../controllers/budgetController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Create or update a budget
router.post("/", protect, setBudget);

// Get all budgets for logged-in user
router.get("/", protect, getBudget);

// Check budget status (over or near limit)
router.get("/status", protect, checkBudgetStatus);

// ✅ NEW: Get AI-powered budget suggestions
router.get("/suggestion", protect, getBudgetSuggestion);

module.exports = router;
