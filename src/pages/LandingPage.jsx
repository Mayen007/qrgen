import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="text-xl font-bold text-blue-600">
              QRGen
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/features"
                className="text-gray-700 hover:text-blue-600"
              >
                Features
              </Link>
              <Link to="/pricing" className="text-gray-700 hover:text-blue-600">
                Pricing
              </Link>
              {user ? (
                // Authenticated user navigation
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                    Dashboard
                  </Link>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700">
                      {user.displayName || user.email}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="text-gray-700 hover:text-blue-600"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                // Non-authenticated user navigation
                <>
                  <Link to="/login" className="text-gray-700 hover:text-blue-600">
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}
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
          <Link
            to="/features"
            className="block text-gray-700 hover:text-blue-600"
          >
            Features
          </Link>
          <Link
            to="/pricing"
            className="block text-gray-700 hover:text-blue-600"
          >
            Pricing
          </Link>
          {user ? (
            // Authenticated user mobile navigation
            <>
              <Link
                to="/dashboard"
                className="block text-gray-700 hover:text-blue-600"
              >
                Dashboard
              </Link>
              <div className="block text-gray-700">
                {user.displayName || user.email}
              </div>
              <button
                onClick={handleSignOut}
                className="block text-gray-700 hover:text-blue-600 mx-auto"
              >
                Sign Out
              </button>
            </>
          ) : (
            // Non-authenticated user mobile navigation
            <>
              <Link to="/login" className="block text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link
                to="/signup"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}

      {/* Hero Section */}
      <section className="text-center py-20 px-6 bg-white">
        <h2 className="text-4xl font-bold mb-4">
          Generate Stylish QR Codes in Seconds
        </h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Custom QR codes for links, Wi-Fi, contact info and more. Track
          performance with real-time analytics.
        </p>
        <Link
          to="/dashboard"
          className="inline-block bg-amber-500 text-white px-6 py-3 rounded-lg shadow hover:bg-amber-600"
        >
          Generate QR Code
        </Link>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-blue-600 text-4xl mb-2">🎨</div>
            <h3 className="text-xl font-semibold mb-2">Full Customization</h3>
            <p className="text-gray-600">
              Change colors, add logos, pick shapes and frames that match your
              brand.
            </p>
          </div>
          <div>
            <div className="text-blue-600 text-4xl mb-2">📊</div>
            <h3 className="text-xl font-semibold mb-2">Scan Analytics</h3>
            <p className="text-gray-600">
              Track how many times your QR is scanned, from where, and on what
              device.
            </p>
          </div>
          <div>
            <div className="text-blue-600 text-4xl mb-2">🔁</div>
            <h3 className="text-xl font-semibold mb-2">Dynamic Links</h3>
            <p className="text-gray-600">
              Change the destination URL without reprinting your QR code.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-white py-16 px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600">
            Creating your QR code is simple and quick.
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-2xl text-blue-600 font-bold mb-2">1</div>
            <p className="text-gray-700 font-medium">Enter Your Content</p>
          </div>
          <div>
            <div className="text-2xl text-blue-600 font-bold mb-2">2</div>
            <p className="text-gray-700 font-medium">Customize Design</p>
          </div>
          <div>
            <div className="text-2xl text-blue-600 font-bold mb-2">3</div>
            <p className="text-gray-700 font-medium">Download & Share</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="text-center max-w-xl mx-auto">
          <p className="text-xl font-semibold mb-4">
            "QRGen made our event ticketing so smooth. Stylish, fast, and
            reliable."
          </p>
          <p className="text-gray-500">— Amani M., Event Organizer</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-center text-gray-600 py-6 border-t">
        <p>&copy; 2025 QRGen. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <Link to="/privacy" className="hover:text-blue-600">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-blue-600">
            Terms
          </Link>
          <Link to="/contact" className="hover:text-blue-600">
            Contact
          </Link>
        </div>
      </footer>
    </div>
  );
}
