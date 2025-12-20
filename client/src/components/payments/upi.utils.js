export const extractUpiFromQr = (qrText) => {
  try {
    if (!qrText.startsWith("upi://")) return null;

    const url = new URL(qrText);
    return url.searchParams.get("pa"); // receiver@upi
  } catch {
    return null;
  }
};
