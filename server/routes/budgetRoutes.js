const express = require("express");
const {
  setBudget,
  getBudget,
  checkBudgetStatus
} = require("../controllers/budgetController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, setBudget);
router.get("/", protect, getBudget);
router.get("/status", protect, checkBudgetStatus);

module.exports = router;
