import { useState } from "react";
import { Link } from "react-router-dom";

export default function Features() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="text-xl font-bold text-blue-600">
              QRGen
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link to="/features" className="text-blue-600 font-medium">
                Features
              </Link>
              <Link to="/pricing" className="text-gray-700 hover:text-blue-600">
                Pricing
              </Link>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg
                className="w-6 h-6"
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
        <div className="md:hidden bg-white shadow-md py-4 px-6 text-center space-y-4 border-t">
          <Link to="/features" className="block text-blue-600 font-medium">
            Features
          </Link>
          <Link
            to="/pricing"
            className="block text-gray-700 hover:text-blue-600"
          >
            Pricing
          </Link>
          <Link to="/login" className="block text-gray-700 hover:text-blue-600">
            Login
          </Link>
          <Link
            to="/signup"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful QR Code Features
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to create, customize, and track professional QR
            codes for your business.
          </p>
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
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Create Your First QR Code?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of businesses using QRGen for their QR code needs.
          </p>
          <div className="space-x-4">
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 inline-block"
            >
              Get Started Free
            </Link>
            <Link
              to="/dashboard"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 inline-block"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">QRGen</h3>
              <p className="text-gray-400">
                The most powerful QR code generator for businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/features" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-white">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 QRGen. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
