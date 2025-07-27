import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import QRCode from "react-qr-code";
import Logo from "../components/Logo";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Live QR Preview State
  const [demoUrl, setDemoUrl] = useState("https://qrgen.com");
  const [demoQrColor, setDemoQrColor] = useState("#000000");
  const [demoQrBgColor, setDemoQrBgColor] = useState("#ffffff");
  const [demoQrSize, setDemoQrSize] = useState(200);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Show loading spinner while Firebase auth is initializing
  if (loading) {
    return (
      <div className="bg-gray-50 text-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 lg:py-6">
            <Link to="/" className="flex items-center group">
              <div className="transform group-hover:scale-105 transition-transform duration-200">
                <Logo />
              </div>
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
              {user ? (
                // Authenticated user navigation
                <div className="flex items-center space-x-6">
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
                  >
                    Dashboard
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                  </Link>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {(user.displayName || user.email || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
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
              ) : (
                // Non-authenticated user navigation
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setMenuOpen(!menuOpen)}
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
                  d={
                    menuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Dropdown */}
      {menuOpen && (
        <div className="md:hidden fixed top-0 left-0 right-0 bottom-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          ></div>

          {/* Navigation Menu */}
          <div className="relative bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100">
            {/* Header with close button */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <Link
                to="/"
                className="flex items-center"
                onClick={() => setMenuOpen(false)}
              >
                <Logo />
              </Link>
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                onClick={() => setMenuOpen(false)}
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
                onClick={() => setMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/pricing"
                className="block text-gray-700 hover:text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200"
                onClick={() => setMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/contact"
                className="block text-gray-700 hover:text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200"
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </Link>

              {user ? (
                // Authenticated user mobile navigation
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <Link
                    to="/dashboard"
                    className="block text-gray-700 hover:text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="flex items-center space-x-3 py-3 px-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {(user.displayName || user.email || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-medium truncate">
                        {user.displayName || user.email}
                      </p>
                      <p className="text-gray-500 text-sm">Signed in</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left text-red-600 hover:text-red-700 font-medium py-3 px-4 rounded-lg hover:bg-red-50 transition-all duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                // Non-authenticated user mobile navigation
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <Link
                    to="/login"
                    className="block text-gray-700 hover:text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-center shadow-lg"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-24 px-6 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-600 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-600 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-amber-500 rounded-full blur-xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              ✨ The #1 QR Code Generator
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6 leading-tight">
            Generate Stylish QR Codes
            <span className="block text-4xl md:text-5xl lg:text-6xl mt-2">
              in Seconds
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Create beautiful, customizable QR codes for URLs, Wi-Fi, contacts,
            and more. Track performance with real-time analytics and never worry
            about broken links again.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/dashboard"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold text-lg"
            >
              <span className="mr-2">🚀</span>
              Start Creating Free
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all duration-200 font-semibold text-lg"
            >
              <span className="mr-2">📋</span>
              View Features
            </Link>
          </div>

          {/* Live QR Code Preview */}
          <div className="relative inline-block">
            <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100">
              <div className="flex justify-center mb-4">
                <QRCode
                  value={demoUrl || "https://qrgen.com"}
                  size={128}
                  fgColor={demoQrColor}
                  bgColor={demoQrBgColor}
                  className="rounded-lg"
                />
              </div>
              <p className="text-sm text-gray-500 font-medium">
                Live QR Preview
              </p>
            </div>
            <div className="absolute -top-2 -right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
              LIVE
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-blue-50 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🎯 Try It Live
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See the magic in action! Generate QR codes instantly with our live
              preview
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Interactive Controls */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                🛠️ Customize Your QR Code
              </h3>

              {/* URL Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter a URL
                </label>
                <input
                  type="text"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                  placeholder="https://example.com"
                />
              </div>

              {/* Color Controls */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    QR Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={demoQrColor}
                      onChange={(e) => setDemoQrColor(e.target.value)}
                      className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 font-mono">
                      {demoQrColor}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Background
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={demoQrBgColor}
                      onChange={(e) => setDemoQrBgColor(e.target.value)}
                      className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 font-mono">
                      {demoQrBgColor}
                    </span>
                  </div>
                </div>
              </div>

              {/* Size Control */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Size: {demoQrSize}px
                </label>
                <input
                  type="range"
                  min="150"
                  max="300"
                  value={demoQrSize}
                  onChange={(e) => setDemoQrSize(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Link
                  to={user ? "/dashboard" : "/signup"}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-center block text-lg"
                >
                  {user ? "🚀 Go to Dashboard" : "🎯 Start Creating QR Codes"}
                </Link>
                <p className="text-center text-sm text-gray-500">
                  {user
                    ? "Access full dashboard features"
                    : "Free account • No credit card required"}
                </p>
              </div>
            </div>

            {/* Live QR Code Preview */}
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 relative">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    ⚡ Instant Preview
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Changes appear in real-time
                  </p>
                </div>

                <div className="flex justify-center mb-6 p-6 bg-gray-50 rounded-xl">
                  <QRCode
                    value={demoUrl || "https://qrgen.com"}
                    size={demoQrSize}
                    fgColor={demoQrColor}
                    bgColor={demoQrBgColor}
                    className="rounded-lg shadow-lg"
                  />
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Live Preview Active
                  </div>
                </div>

                {/* Floating Animation Dots */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Quick Features Demo */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              🌟 See What You Can Create
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* WiFi QR Demo */}
              <div className="bg-white p-4 rounded-xl shadow-lg border border-blue-100">
                <div className="mb-3">
                  <QRCode
                    value="WIFI:T:WPA;S:Guest-Network;P:password123;;"
                    size={80}
                    fgColor="#2563eb"
                    bgColor="#ffffff"
                    className="mx-auto"
                  />
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  📶 WiFi QR
                </p>
                <p className="text-xs text-gray-500">Share network access</p>
              </div>

              {/* Contact QR Demo */}
              <div className="bg-white p-4 rounded-xl shadow-lg border border-purple-100">
                <div className="mb-3">
                  <QRCode
                    value="BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD"
                    size={80}
                    fgColor="#7c3aed"
                    bgColor="#faf5ff"
                    className="mx-auto"
                  />
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  👤 Contact QR
                </p>
                <p className="text-xs text-gray-500">Share your info</p>
              </div>

              {/* Custom Colored QR Demo */}
              <div className="bg-white p-4 rounded-xl shadow-lg border border-green-100">
                <div className="mb-3">
                  <QRCode
                    value="https://qrgen.com/custom-design"
                    size={80}
                    fgColor="#059669"
                    bgColor="#ecfdf5"
                    className="mx-auto"
                  />
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  🎨 Custom Colors
                </p>
                <p className="text-xs text-gray-500">Match your brand</p>
              </div>

              {/* Text QR Demo */}
              <div className="bg-white p-4 rounded-xl shadow-lg border border-orange-100">
                <div className="mb-3">
                  <QRCode
                    value="Welcome to QRGen! The best QR code generator for all your needs."
                    size={80}
                    fgColor="#ea580c"
                    bgColor="#fff7ed"
                    className="mx-auto"
                  />
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  📝 Text QR
                </p>
                <p className="text-xs text-gray-500">Share messages</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features for
              <span className="block text-blue-600">Every Need</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create, customize, and track professional
              QR codes that drive results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Full Customization
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Personalize every aspect of your QR codes with custom colors,
                logos, frames, and patterns that perfectly match your brand
                identity.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border border-purple-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Advanced Analytics
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get detailed insights with real-time scan tracking, geographic
                data, device information, and comprehensive performance metrics.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🔁</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Dynamic Links
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Update your QR code destinations anytime without reprinting.
                Perfect for campaigns, events, and evolving content strategies.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl border border-orange-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Multiple Formats
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Generate QR codes for URLs, Wi-Fi credentials, contact cards,
                plain text, and more with instant preview and validation.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-gradient-to-br from-pink-50 to-pink-100 p-8 rounded-2xl border border-pink-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Lightning Fast
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Generate high-quality QR codes instantly with our optimized
                engine. Download in PNG or SVG formats within seconds.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-2xl border border-indigo-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Secure & Private
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your data is protected with enterprise-grade security. We never
                store your QR code content permanently on our servers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple 3-Step Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Creating professional QR codes has never been easier. Get started
              in under a minute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection lines for desktop */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-300 via-purple-300 to-blue-300"></div>

            {/* Step 1 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <div className="absolute -inset-4 bg-blue-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Enter Your Content
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Input your URL, Wi-Fi credentials, contact information, or any
                text you want to encode into a QR code.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <div className="absolute -inset-4 bg-purple-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Customize Design
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Personalize colors, adjust size, and preview your QR code in
                real-time to match your brand perfectly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <div className="absolute -inset-4 bg-green-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Download & Share
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Download your QR code in high-quality PNG or SVG format and
                start using it anywhere you need.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link
              to="/dashboard"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold text-lg"
            >
              <span className="mr-2">✨</span>
              Try It Now - It's Free!
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-10 w-32 h-32 bg-blue-600 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 left-20 w-40 h-40 bg-purple-600 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Loved by Thousands
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers are saying about QRGen
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Amani M.</h4>
                  <p className="text-gray-600 text-sm">Event Organizer</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "QRGen made our event ticketing so smooth. The customization
                  options are incredible and the analytics help us understand
                  our audience better."
                </p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Sarah K.</h4>
                  <p className="text-gray-600 text-sm">Marketing Director</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "The dynamic QR codes are a game-changer! We can update our
                  campaigns without reprinting materials. Saves time and money."
                </p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Mike R.</h4>
                  <p className="text-gray-600 text-sm">Restaurant Owner</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "Perfect for our digital menu! Customers love how fast and
                  easy it is to access. The branded QR codes look professional
                  too."
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl">
              <div className="text-3xl font-bold mb-2">50K+</div>
              <p className="text-blue-100">QR Codes Generated</p>
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl">
              <div className="text-3xl font-bold mb-2">99.9%</div>
              <p className="text-purple-100">Uptime Guarantee</p>
            </div>
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-2xl">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <p className="text-green-100">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 border-t">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="mb-4">
                <Logo />
              </div>
              <p className="text-gray-300 mb-4 leading-relaxed">
                The most powerful and user-friendly QR code generator for
                businesses and individuals. Create, customize, and track your QR
                codes with ease.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  <span className="text-xl">🐦</span>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">LinkedIn</span>
                  <span className="text-xl">💼</span>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">GitHub</span>
                  <span className="text-xl">⚡</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-white">
                Quick Links
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/features"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-white">Support</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2025 QRGen. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Made with</span>
              <span className="text-red-500 text-lg">❤️</span>
              <span className="text-gray-400 text-sm">
                for creators worldwide
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
