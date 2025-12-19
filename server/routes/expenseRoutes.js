const express = require("express");
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getMonthlySummary,
  initiateUpiPayment,
  confirmUpiPayment,
} = require("../controllers/expenseController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, getTransactions);
router.get("/summary", protect, getMonthlySummary);

router.post("/", protect, addTransaction);

// 🔥 UPI ROUTES (ADD THESE)
router.post("/upi/initiate", protect, initiateUpiPayment);
router.patch("/upi/confirm/:id", protect, confirmUpiPayment);

router.put("/:id", protect, updateTransaction);
router.delete("/:id", protect, deleteTransaction);

module.exports = router;
