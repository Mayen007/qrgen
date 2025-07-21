import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Logo from "../components/Logo";

export default function Terms() {
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
        <div className="md:hidden bg-white/95 backdrop-blur-sm shadow-lg py-6 px-6 text-center space-y-6 border-t border-gray-100 animate-in slide-in-from-top duration-200">
          <Link
            to="/features"
            className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200"
            onClick={() => setMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            to="/pricing"
            className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200"
            onClick={() => setMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link
            to="/contact"
            className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>
          {user ? (
            // Authenticated user mobile navigation
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <Link
                to="/dashboard"
                className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <div className="flex items-center justify-center space-x-3 py-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {(user.displayName || user.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-700 font-medium">
                  {user.displayName || user.email}
                </span>
              </div>
              <button
                onClick={() => {
                  handleSignOut();
                  setMenuOpen(false);
                }}
                className="block text-red-600 hover:text-red-700 font-medium py-2 transition-colors duration-200 mx-auto"
              >
                Sign Out
              </button>
            </div>
          ) : (
            // Non-authenticated user mobile navigation
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <Link
                to="/login"
                className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600">
            Last updated: January 21, 2025
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Agreement to Terms
            </h2>
            <p className="text-gray-600 mb-6">
              By accessing and using QRGen's services, you accept and agree to
              be bound by the terms and provision of this agreement. If you do
              not agree to abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
              Use License
            </h2>
            <p className="text-gray-600 mb-4">
              Permission is granted to temporarily download one copy of QRGen's
              materials for personal, non-commercial transitory viewing only.
              This is the grant of a license, not a transfer of title, and under
              this license you may not:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>modify or copy the materials</li>
              <li>
                use the materials for any commercial purpose or for any public
                display
              </li>
              <li>
                attempt to reverse engineer any software contained on the
                website
              </li>
              <li>
                remove any copyright or other proprietary notations from the
                materials
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
              Service Description
            </h2>
            <p className="text-gray-600 mb-6">
              QRGen provides QR code generation services including but not
              limited to URL, text, WiFi, and contact information QR codes. We
              reserve the right to modify or discontinue our services at any
              time without notice.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
              User Accounts
            </h2>
            <p className="text-gray-600 mb-4">
              When you create an account with us, you must provide information
              that is accurate, complete, and current at all times. You are
              responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>Safeguarding the password for your account</li>
              <li>All activities that occur under your account</li>
              <li>Immediately notifying us of any unauthorized use</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
              Acceptable Use
            </h2>
            <p className="text-gray-600 mb-4">
              You agree not to use QRGen for any unlawful purpose or any purpose
              prohibited under this clause. You may not use QRGen:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>
                For any unlawful purpose or to solicit others to perform
                unlawful acts
              </li>
              <li>
                To violate any international, federal, provincial, or state
                regulations, rules, laws, or local ordinances
              </li>
              <li>
                To infringe upon or violate our intellectual property rights or
                the intellectual property rights of others
              </li>
              <li>
                To harass, abuse, insult, harm, defame, slander, disparage,
                intimidate, or discriminate
              </li>
              <li>To submit false or misleading information</li>
              <li>
                To upload or transmit viruses or any other type of malicious
                code
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
              Content and QR Codes
            </h2>
            <p className="text-gray-600 mb-6">
              You retain ownership of any content you submit for QR code
              generation. However, you grant us a limited license to process and
              generate QR codes from your content. You are solely responsible
              for the content you submit and its legality.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
              Payment Terms
            </h2>
            <p className="text-gray-600 mb-4">For paid services:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>Fees are charged in advance on a monthly or annual basis</li>
              <li>All fees are non-refundable except as required by law</li>
              <li>
                We reserve the right to change our pricing with 30 days notice
              </li>
              <li>Failure to pay fees may result in service suspension</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
              Service Availability
            </h2>
            <p className="text-gray-600 mb-6">
              We strive to maintain high availability but do not guarantee
              uninterrupted service. We may experience downtime for maintenance,
              updates, or due to factors beyond our control.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
              Intellectual Property
            </h2>
            <p className="text-gray-600 mb-6">
              The service and its original content, features, and functionality
              are and will remain the exclusive property of QRGen and its
              licensors. The service is protected by copyright, trademark, and
              other laws.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
              Disclaimers
            </h2>
            <p className="text-gray-600 mb-6">
              The information on this website is provided on an "as is" basis.
              To the fullest extent permitted by law, this Company excludes all
              representations, warranties, conditions and terms whether express
              or implied.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
              Limitation of Liability
            </h2>
            <p className="text-gray-600 mb-6">
              In no event shall QRGen, nor its directors, employees, partners,
              agents, suppliers, or affiliates, be liable for any indirect,
              incidental, special, consequential, or punitive damages, including
              without limitation, loss of profits, data, use, goodwill, or other
              intangible losses.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
              Termination
            </h2>
            <p className="text-gray-600 mb-6">
              We may terminate or suspend your account and bar access to the
              service immediately, without prior notice or liability, under our
              sole discretion, for any reason whatsoever and without limitation,
              including but not limited to a breach of the Terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
              Governing Law
            </h2>
            <p className="text-gray-600 mb-6">
              These Terms shall be interpreted and governed by the laws of the
              State of California, United States. Any disputes will be resolved
              in the courts of San Francisco County, California.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
              Changes to Terms
            </h2>
            <p className="text-gray-600 mb-6">
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material, we will
              provide at least 30 days notice prior to any new terms taking
              effect.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
              Contact Information
            </h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <ul className="list-none text-gray-600 mb-6">
              <li>Email: legal@qrgen.com</li>
              <li>Address: 123 Tech Street, San Francisco, CA 94105</li>
              <li>Phone: +1 (555) 123-4567</li>
            </ul>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> These are sample terms of service for
                demonstration purposes. In a real application, you should
                consult with legal professionals to ensure compliance with
                applicable laws and regulations.
              </p>
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
