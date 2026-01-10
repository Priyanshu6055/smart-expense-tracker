import { Html5QrcodeScanner } from "html5-qrcode";
import { useRef } from "react";

export default function QrScanner({ onScan }) {
  const scannerRef = useRef(null);

  const startScan = () => {
    if (scannerRef.current) return;

    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 280, height: 280 },
        rememberLastUsedCamera: true,
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true, // ✅ iOS fix
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
      () => {}
    );
  };

  return (
    <div>
      <button
        onClick={startScan}
        className="w-full bg-purple-600 py-2 rounded text-white font-semibold"
      >
        Start QR Scan
      </button>

      <div id="qr-reader" className="scale-[0.9]" />

      <p className="text-xs text-gray-400 text-center">
        iPhone tip: hold QR steady with good lighting
      </p>
    </div>
  );
}
