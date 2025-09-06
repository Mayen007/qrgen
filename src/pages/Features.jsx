import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Logo from "../components/Logo";

export default function Features() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
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
  return (
    <div className="bg-gray-50 min-h-screen">
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
                className="text-blue-600 font-medium transition-colors duration-200 relative group"
              >
                Features
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-100 transition-transform duration-200"></span>
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
                className="block text-blue-600 font-medium py-3 px-4 rounded-lg bg-blue-50 transition-all duration-200"
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
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-6 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-600 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-600 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-500 rounded-full blur-xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              🚀 Advanced QR Features
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6 leading-tight">
            Powerful QR Code Features
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Everything you need to create, customize, and track professional QR
            codes that drive results for your business.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link
              to="/dashboard"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold text-lg"
            >
              <span className="mr-2">✨</span>
              Try All Features
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all duration-200 font-semibold text-lg"
            >
              <span className="mr-2">💰</span>
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="text-blue-600 text-5xl mb-4">🎨</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Full Customization
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Make your QR codes truly yours with extensive customization
                options.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Custom colors and gradients
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Logo integration
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Multiple frame styles
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Pattern customization
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-48 h-48 bg-gray-200 mx-auto rounded-lg flex items-center justify-center">
                <span className="text-gray-500">QR Preview</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 lg:order-1">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">
                  Analytics Dashboard
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Scans</span>
                    <span className="font-bold">1,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Week</span>
                    <span className="font-bold text-green-600">+89</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Top Location</span>
                    <span className="font-bold">New York</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Top Device</span>
                    <span className="font-bold">Mobile (78%)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="text-blue-600 text-5xl mb-4">📊</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Advanced Analytics
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Get detailed insights into how your QR codes are performing.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Real-time scan tracking
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Geographic location data
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Device and browser info
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Time-based analytics
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="text-blue-600 text-5xl mb-4">🔁</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Dynamic QR Codes
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Update your content without reprinting your QR codes.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Change URLs anytime
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Update contact information
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Modify WiFi credentials
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  A/B test different destinations
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">Original URL</h4>
                  <p className="text-gray-600 text-sm">
                    https://example.com/old-page
                  </p>
                </div>
                <div className="text-center text-gray-400">↓ Updated</div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold">New URL</h4>
                  <p className="text-gray-600 text-sm">
                    https://example.com/new-page
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            More Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-blue-600 text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">
                Password Protection
              </h3>
              <p className="text-gray-600">
                Secure your QR codes with password protection.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-blue-600 text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Mobile Optimized</h3>
              <p className="text-gray-600">
                Perfect scanning experience on all devices.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-blue-600 text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Instant Generation</h3>
              <p className="text-gray-600">
                Create QR codes in seconds, not minutes.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-blue-600 text-4xl mb-4">💾</div>
              <h3 className="text-xl font-semibold mb-2">Bulk Export</h3>
              <p className="text-gray-600">
                Download multiple QR codes at once.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-blue-600 text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-semibold mb-2">Multiple Formats</h3>
              <p className="text-gray-600">
                Support for URLs, WiFi, vCards, and more.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-blue-600 text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">High Resolution</h3>
              <p className="text-gray-600">
                Crystal clear QR codes for print and digital.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 py-20 px-6 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-white rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-white rounded-full blur-xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              🚀 Ready to Start?
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Create Your First QR Code?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of businesses using QRGen for their QR code needs. Experience the power of advanced features today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-xl"
            >
              Get Started Free
            </Link>
            <Link
              to="/dashboard"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105"
            >
              Try Demo
            </Link>
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
