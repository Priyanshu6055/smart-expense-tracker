import { useEffect, useState } from "react";
import axios from "axios";

export default function useUpiPayment(API_URL, token, onSuccess) {
  const [pendingExpense, setPendingExpense] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const initiatePayment = async (payload) => {
    const res = await axios.post(
      `${API_URL}/api/expenses/upi/initiate`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setPendingExpense(res.data.data.expenseId);
    window.location.href = res.data.data.upiUrl;
  };

  const confirmPayment = async (status) => {
    await axios.patch(
      `${API_URL}/api/expenses/${pendingExpense}/confirm`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setPendingExpense(null);
    setShowConfirm(false);
    onSuccess?.();
  };

  useEffect(() => {
    const onFocus = () => pendingExpense && setShowConfirm(true);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [pendingExpense]);

  return {
    initiatePayment,
    confirmPayment,
    showConfirm,
  };
}
