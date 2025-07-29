const Expense = require("../models/Expense");

// @desc    Add a new transaction
exports.addTransaction = async (req, res) => {
  try {
    const { type, category, amount, date, description } = req.body;

    const newExpense = new Expense({
      userId: req.user.id, // from auth middleware
      type,
      category,
      amount,
      date,
      description,
    });

    await newExpense.save();
    res.status(201).json({ success: true, message: "Transaction added", data: newExpense });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

// @desc    Get all transactions of a user
exports.getTransactions = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.json({ success: true, data: expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

// @desc    Update a transaction
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.json({ success: true, message: "Transaction updated", data: updatedExpense });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

// @desc    Delete a transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Expense.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.json({ success: true, message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};
