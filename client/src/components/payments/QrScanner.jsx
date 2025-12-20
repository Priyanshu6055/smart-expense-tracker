import { Html5Qrcode } from "html5-qrcode";
import { useEffect } from "react";

export default function QrScanner({ onScan, onError }) {
  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qr-reader");

    html5QrCode
      .start(
        { facingMode: "environment" }, // ✅ BACK CAMERA
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScan(decodedText);
          html5QrCode.stop().catch(() => {});
        },
        (errorMessage) => {
          // ignore scan errors
        }
      )
      .catch((err) => {
        onError?.(err);
      });

    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, []);

  return (
    <div className="mt-4">
      <div id="qr-reader" />
      <p className="text-xs text-gray-400 text-center mt-2">
        Using back camera for scanning
      </p>
    </div>
  );
}
