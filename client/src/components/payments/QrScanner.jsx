import { Html5Qrcode } from "html5-qrcode";
import { useEffect } from "react";

export default function QrScanner({ onScan, onError }) {
  useEffect(() => {
    let html5QrCode;

    const startScanner = async () => {
      try {
        // 1️⃣ Get camera list
        const devices = await Html5Qrcode.getCameras();

        if (!devices || devices.length === 0) {
          throw new Error("No cameras found");
        }

        // 2️⃣ Prefer BACK camera
        const backCamera =
          devices.find((d) =>
            d.label.toLowerCase().includes("back")
          ) || devices[devices.length - 1]; // fallback

        // 3️⃣ Start scanner
        html5QrCode = new Html5Qrcode("qr-reader");

        await html5QrCode.start(
          backCamera.id,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            onScan(decodedText);
            html5QrCode.stop().catch(() => {});
          }
        );
      } catch (err) {
        onError?.(err);
      }
    };

    startScanner();

    return () => {
      if (html5QrCode) {
        html5QrCode.stop().catch(() => {});
      }
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
