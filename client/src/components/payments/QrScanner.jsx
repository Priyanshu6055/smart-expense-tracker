import { Html5QrcodeScanner } from "html5-qrcode";
import { useRef } from "react";

export default function QrScanner({ onScan, onError }) {
  const scannerRef = useRef(null);

  const startScan = () => {
    if (scannerRef.current) return;

    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 280, height: 280 }, // ✅ bigger box helps iOS
        rememberLastUsedCamera: true,

        // ✅ CRITICAL FIX FOR iOS
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true,
        },
      },
      false
    );

    scannerRef.current.render(
      (decodedText) => {
        onScan(decodedText);
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      },
      (err) => {
        // ignore scan errors
      }
    );
  };

  return (
    <div className="mt-4">
      {/* REQUIRED user gesture for iOS */}
      <button
        onClick={startScan}
        className="w-full mb-3 bg-purple-600 py-2 rounded text-white font-semibold"
      >
        Start QR Scan
      </button>

      <div
        id="qr-reader"
        style={{
          width: "100%",
          minHeight: "320px",
        }}
      />

      <p className="text-xs text-gray-400 text-center mt-2">
        iPhone tip: hold QR steady, good lighting required
      </p>
    </div>
  );
}
