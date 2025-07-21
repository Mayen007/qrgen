import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import QRCode from "react-qr-code";
import QRCodeLib from "qrcode";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [qrColor, setQrColor] = useState("#000000");
  const [qrBgColor, setQrBgColor] = useState("#ffffff");
  const [qrSize, setQrSize] = useState(256);
  const [qrType, setQrType] = useState("url");
  const [wifiData, setWifiData] = useState({
    ssid: "",
    password: "",
    security: "WPA",
  });
  const [contactData, setContactData] = useState({
    name: "",
    phone: "",
    email: "",
    organization: "",
  });
  const canvasRef = useRef();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const generateQRValue = () => {
    switch (qrType) {
      case "url":
        return qrData;
      case "wifi":
        return `WIFI:T:${wifiData.security};S:${wifiData.ssid};P:${wifiData.password};;`;
      case "contact":
        return `BEGIN:VCARD
VERSION:3.0
FN:${contactData.name}
ORG:${contactData.organization}
TEL:${contactData.phone}
EMAIL:${contactData.email}
END:VCARD`;
      case "text":
        return qrData;
      default:
        return qrData;
    }
  };

  const handleGenerate = () => {
    const value = generateQRValue();
    setQrValue(value);
  };

  const downloadQR = async (format = "png") => {
    const value = qrValue || generateQRValue();

    try {
      if (format === "png") {
        const canvas = await QRCodeLib.toCanvas(canvasRef.current, value, {
          width: qrSize,
          color: {
            dark: qrColor,
            light: qrBgColor,
          },
        });

        const link = document.createElement("a");
        link.download = "qrcode.png";
        link.href = canvas.toDataURL();
        link.click();
      } else if (format === "svg") {
        const svg = await QRCodeLib.toString(value, {
          type: "svg",
          width: qrSize,
          color: {
            dark: qrColor,
            light: qrBgColor,
          },
        });

        const blob = new Blob([svg], { type: "image/svg+xml" });
        const link = document.createElement("a");
        link.download = "qrcode.svg";
        link.href = URL.createObjectURL(blob);
        link.click();
      }
    } catch (error) {
      console.error("Error downloading QR code:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="text-xl font-bold text-blue-600">
              QRGen
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.displayName || user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="text-gray-700 hover:text-blue-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code Generator Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              QR Code Generator
            </h1>

            {/* QR Type Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                QR Code Type
              </label>
              <select
                value={qrType}
                onChange={(e) => setQrType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="url">Website URL</option>
                <option value="text">Plain Text</option>
                <option value="wifi">WiFi Network</option>
                <option value="contact">Contact (vCard)</option>
              </select>
            </div>

            {/* Dynamic Input Based on Type */}
            {(qrType === "url" || qrType === "text") && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {qrType === "url" ? "Enter URL" : "Enter Text"}
                </label>
                <textarea
                  value={qrData}
                  onChange={(e) => setQrData(e.target.value)}
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={
                    qrType === "url"
                      ? "https://example.com"
                      : "Enter your text here"
                  }
                />
              </div>
            )}

            {qrType === "wifi" && (
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Network Name (SSID)
                  </label>
                  <input
                    type="text"
                    value={wifiData.ssid}
                    onChange={(e) =>
                      setWifiData({ ...wifiData, ssid: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="My WiFi Network"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={wifiData.password}
                    onChange={(e) =>
                      setWifiData({ ...wifiData, password: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="WiFi Password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Security Type
                  </label>
                  <select
                    value={wifiData.security}
                    onChange={(e) =>
                      setWifiData({ ...wifiData, security: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">Open (No Password)</option>
                  </select>
                </div>
              </div>
            )}

            {qrType === "contact" && (
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={contactData.name}
                    onChange={(e) =>
                      setContactData({ ...contactData, name: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={contactData.phone}
                    onChange={(e) =>
                      setContactData({ ...contactData, phone: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1234567890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={contactData.email}
                    onChange={(e) =>
                      setContactData({ ...contactData, email: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={contactData.organization}
                    onChange={(e) =>
                      setContactData({
                        ...contactData,
                        organization: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Company Name"
                  />
                </div>
              </div>
            )}

            {/* Customization Options */}
            <div className="mb-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Customization
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foreground Color
                  </label>
                  <input
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={qrBgColor}
                    onChange={(e) => setQrBgColor(e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size: {qrSize}px
                </label>
                <input
                  type="range"
                  min="128"
                  max="512"
                  value={qrSize}
                  onChange={(e) => setQrSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Generate QR Code
            </button>
          </div>

          {/* QR Code Preview and Download */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Preview & Download
            </h2>

            <div className="text-center mb-6">
              {qrValue ? (
                <div>
                  <QRCode
                    value={qrValue}
                    size={qrSize}
                    fgColor={qrColor}
                    bgColor={qrBgColor}
                    className="mx-auto border border-gray-200 rounded-lg"
                  />
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                </div>
              ) : (
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8">
                  <div className="text-gray-400 text-lg">
                    Your QR code will appear here
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    Fill in the form and click "Generate QR Code"
                  </p>
                </div>
              )}
            </div>

            {qrValue && (
              <div className="space-y-3">
                <button
                  onClick={() => downloadQR("png")}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  Download PNG
                </button>
                <button
                  onClick={() => downloadQR("svg")}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
                >
                  Download SVG
                </button>
              </div>
            )}

            {/* QR Code Info */}
            {qrValue && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">
                  QR Code Data:
                </h3>
                <p className="text-sm text-gray-600 break-all">{qrValue}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
