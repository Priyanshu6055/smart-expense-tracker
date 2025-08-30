const express = require("express");
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/expenseController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// GET all transactions for the logged-in user
router.get("/", protect, getTransactions);

// POST a new income or expense transaction
router.post("/", protect, addTransaction);

// PUT to update an existing transaction
router.put("/:id", protect, updateTransaction);

// DELETE a transaction by ID
router.delete("/:id", protect, deleteTransaction);

module.exports = router;
