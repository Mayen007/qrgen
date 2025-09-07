import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import QRCode from "react-qr-code";
import QRCodeLib from "qrcode";
import Logo from "../components/Logo";
import { Globe, FileText, Wifi, User, Palette, Download } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const canvasRef = useRef();

  useEffect(() => {
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
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Validation functions
  const validateUrl = (url) => {
    try {
      new URL(url);
      return url.match(/^https?:\/\/.+\..+/) !== null;
    } catch {
      return false;
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-()]/g, ""));
  };

  const validateInput = () => {
    const newErrors = {};

    switch (qrType) {
      case "url":
        if (!qrData.trim()) {
          newErrors.qrData = "URL is required";
        } else if (!validateUrl(qrData)) {
          newErrors.qrData =
            "Please enter a valid URL (e.g., https://example.com)";
        }
        break;

      case "text":
        if (!qrData.trim()) {
          newErrors.qrData = "Text content is required";
        } else if (qrData.length > 2953) {
          newErrors.qrData =
            "Text is too long for QR code (max 2953 characters)";
        }
        break;

      case "wifi":
        if (!wifiData.ssid.trim()) {
          newErrors.ssid = "Network name (SSID) is required";
        } else if (wifiData.ssid.length > 32) {
          newErrors.ssid = "Network name must be 32 characters or less";
        }

        if (wifiData.security !== "nopass" && !wifiData.password.trim()) {
          newErrors.password = "Password is required for secured networks";
        } else if (wifiData.password.length > 63) {
          newErrors.password = "Password must be 63 characters or less";
        }
        break;

      case "contact":
        if (
          !contactData.name.trim() &&
          !contactData.email.trim() &&
          !contactData.phone.trim()
        ) {
          newErrors.contact =
            "At least one contact field (name, email, or phone) is required";
        }

        if (contactData.email.trim() && !validateEmail(contactData.email)) {
          newErrors.email = "Please enter a valid email address";
        }

        if (contactData.phone.trim() && !validatePhone(contactData.phone)) {
          newErrors.phone = "Please enter a valid phone number";
        }

        if (contactData.name.length > 100) {
          newErrors.name = "Name must be 100 characters or less";
        }

        if (contactData.organization.length > 100) {
          newErrors.organization =
            "Organization must be 100 characters or less";
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearMessages = () => {
    setErrors({});
    setSuccessMessage("");
  };

  // Input change handlers that clear errors
  const handleQrDataChange = (value) => {
    setQrData(value);
    if (errors.qrData) {
      setErrors((prev) => ({ ...prev, qrData: null }));
    }
  };

  const handleWifiDataChange = (field, value) => {
    setWifiData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleContactDataChange = (field, value) => {
    setContactData((prev) => ({ ...prev, [field]: value }));
    if (errors[field] || errors.contact) {
      setErrors((prev) => ({ ...prev, [field]: null, contact: null }));
    }
  };

  const handleQrTypeChange = (newType) => {
    setQrType(newType);
    clearMessages();
    setQrValue(""); // Clear existing QR code when type changes
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

  const handleGenerate = async () => {
    clearMessages();

    if (!validateInput()) {
      return;
    }

    setIsGenerating(true);

    try {
      // Add a small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 300));

      const value = generateQRValue();
      setQrValue(value);
      setSuccessMessage("QR code generated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error generating QR code:", error);
      setErrors({ general: "Failed to generate QR code. Please try again." });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = async (format = "png") => {
    if (!qrValue) {
      setErrors({ general: "Please generate a QR code first" });
      return;
    }

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
        link.download = `qrcode-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();

        setSuccessMessage(`PNG downloaded successfully!`);
        setTimeout(() => setSuccessMessage(""), 3000);
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
        link.download = `qrcode-${Date.now()}.svg`;
        link.href = URL.createObjectURL(blob);
        link.click();

        setSuccessMessage(`SVG downloaded successfully!`);
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error downloading QR code:", error);
      setErrors({
        general: `Failed to download ${format.toUpperCase()} file. Please try again.`,
      });
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
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <Logo />
            </Link>

            <nav className="hidden md:flex space-x-8 items-center">
              <Link
                to="/features"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
              >
                Features
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </Link>
              <Link
                to="/pricing"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
              >
                Pricing
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
              >
                Contact
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </Link>
              {user && (
                // Authenticated user navigation
                <div className="flex items-center space-x-6">
                  <Link
                    to="/dashboard"
                    className="text-blue-600 font-medium transition-colors duration-200 relative group"
                  >
                    Dashboard
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-100 transition-transform duration-200"></span>
                  </Link>
                  <div className="flex items-center space-x-3">
                    {user.photoURL && (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        className="w-8 h-8 rounded-full border-2 border-gray-200"
                      />
                    )}
                    <span className="text-gray-700 font-medium max-w-32 truncate">
                      {user.displayName || user.email}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="text-gray-500 hover:text-red-600 transition-colors duration-200 font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </nav>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed top-0 left-0 right-0 bottom-0 z-50">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>

            {/* Navigation Menu */}
            <div className="relative bg-white shadow-lg border-b border-gray-100">
              {/* Header with close button */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <Link
                  to="/"
                  className="flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Logo />
                </Link>
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <div className="px-6 py-6 space-y-4">
                <Link
                  to="/features"
                  className="block text-gray-700 hover:text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  to="/pricing"
                  className="block text-gray-700 hover:text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  to="/contact"
                  className="block text-gray-700 hover:text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  to="/dashboard"
                  className="block text-blue-600 font-medium py-3 px-4 rounded-lg bg-blue-50 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>

                {/* User section */}
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <div className="flex items-center space-x-3 py-3 px-4">
                    {user?.photoURL && (
                      <img
                        src={user.photoURL}
                        alt={user?.displayName || "User"}
                        className="w-10 h-10 rounded-full border-2 border-gray-200"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-medium truncate">
                        {user?.displayName || user?.email}
                      </p>
                      <p className="text-gray-500 text-sm">Dashboard User</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-red-600 hover:text-red-700 font-medium py-3 px-4 rounded-lg hover:bg-red-50 transition-all duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* QR Code Generator Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                QR Code Generator
              </h1>
              <p className="text-gray-600">
                Create custom QR codes for URLs, WiFi, contacts, and more
              </p>
            </div>

            {/* QR Type Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                QR Code Type
              </label>
              <select
                value={qrType}
                onChange={(e) => handleQrTypeChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="url">Website URL</option>
                <option value="text">Plain Text</option>
                <option value="wifi">WiFi Network</option>
                <option value="contact">Contact (vCard)</option>
              </select>
            </div>

            {/* Success/Error Messages */}
            {(successMessage || errors.general) && (
              <div className="mb-4">
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {successMessage}
                  </div>
                )}
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.general}
                  </div>
                )}
              </div>
            )}

            {/* Dynamic Input Based on Type */}
            {(qrType === "url" || qrType === "text") && (
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {qrType === "url" ? "Enter URL" : "Enter Text"}
                </label>
                <textarea
                  value={qrData}
                  onChange={(e) => handleQrDataChange(e.target.value)}
                  className={`w-full h-24 sm:h-32 p-3 sm:p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-colors ${
                    errors.qrData
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  placeholder={
                    qrType === "url"
                      ? "https://example.com"
                      : "Enter your text here"
                  }
                />
                {errors.qrData && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.qrData}
                  </p>
                )}
              </div>
            )}

            {qrType === "wifi" && (
              <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Network Name (SSID)
                  </label>
                  <input
                    type="text"
                    value={wifiData.ssid}
                    onChange={(e) =>
                      handleWifiDataChange("ssid", e.target.value)
                    }
                    className={`w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-colors ${
                      errors.ssid
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="My WiFi Network"
                  />
                  {errors.ssid && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.ssid}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={wifiData.password}
                    onChange={(e) =>
                      handleWifiDataChange("password", e.target.value)
                    }
                    className={`w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-colors ${
                      errors.password
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="WiFi Password"
                    disabled={wifiData.security === "nopass"}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Security Type
                  </label>
                  <select
                    value={wifiData.security}
                    onChange={(e) =>
                      handleWifiDataChange("security", e.target.value)
                    }
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">Open (No Password)</option>
                  </select>
                </div>
              </div>
            )}

            {qrType === "contact" && (
              <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
                {errors.contact && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                    {errors.contact}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={contactData.name}
                    onChange={(e) =>
                      handleContactDataChange("name", e.target.value)
                    }
                    className={`w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-colors ${
                      errors.name
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={contactData.phone}
                    onChange={(e) =>
                      handleContactDataChange("phone", e.target.value)
                    }
                    className={`w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-colors ${
                      errors.phone
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="+1234567890"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.phone}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={contactData.email}
                    onChange={(e) =>
                      handleContactDataChange("email", e.target.value)
                    }
                    className={`w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-colors ${
                      errors.email
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={contactData.organization}
                    onChange={(e) =>
                      handleContactDataChange("organization", e.target.value)
                    }
                    className={`w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-colors ${
                      errors.organization
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="Company Name"
                  />
                  {errors.organization && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.organization}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Customization Options */}
            <div className="mb-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Customization
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              disabled={isGenerating}
              className={`w-full py-3 px-6 rounded-lg font-semibold shadow-lg transition-all duration-200 transform ${
                isGenerating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:scale-105"
              }`}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </div>
              ) : (
                "Generate QR Code"
              )}
            </button>
          </div>

          {/* QR Code Preview and Download */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Preview & Download
              </h2>
              <p className="text-gray-600">
                Preview your QR code and download in multiple formats
              </p>
            </div>

            <div className="text-center mb-4 sm:mb-6">
              {qrValue ? (
                <div className="flex justify-center">
                  <QRCode
                    value={qrValue}
                    size={Math.min(qrSize, window.innerWidth < 640 ? 200 : 256)} // More responsive sizing
                    fgColor={qrColor}
                    bgColor={qrBgColor}
                    className="border border-gray-200 rounded-lg max-w-[180px] xs:max-w-[200px] sm:max-w-[256px] w-full h-auto"
                  />
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                </div>
              ) : (
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 lg:p-8">
                  <div className="text-gray-400 text-sm sm:text-base lg:text-lg">
                    Your QR code will appear here
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm mt-2">
                    Fill in the form and click "Generate QR Code"
                  </p>
                </div>
              )}
            </div>

            {qrValue && (
              <div className="space-y-3">
                <button
                  onClick={() => downloadQR("png")}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download PNG
                </button>
                <button
                  onClick={() => downloadQR("svg")}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Palette className="w-5 h-5" />
                  Download SVG
                </button>
              </div>
            )}

            {/* QR Code Info */}
            {qrValue && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                  QR Code Data:
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 break-all">
                  {qrValue}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
