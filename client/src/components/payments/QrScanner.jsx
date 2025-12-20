import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export default function QrScanner({ onScan, onError }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
        scanner.clear();
      },
      (err) => onError?.(err)
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return <div id="qr-reader" className="mt-4" />;
}
