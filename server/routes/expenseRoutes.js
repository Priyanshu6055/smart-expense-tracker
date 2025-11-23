const express = require("express");
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getMonthlySummary,
} = require("../controllers/expenseController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, getTransactions);

router.get("/summary", protect, getMonthlySummary);

router.post("/", protect, addTransaction);

router.put("/:id", protect, updateTransaction);

router.delete("/:id", protect, deleteTransaction);

module.exports = router;
