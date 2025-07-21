import { Link } from "react-router-dom";

export default function Terms() {
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
              <Link
                to="/features"
                className="text-gray-700 hover:text-blue-600"
              >
                Features
              </Link>
              <Link to="/pricing" className="text-gray-700 hover:text-blue-600">
                Pricing
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600">
                Contact
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
          </div>
        </div>
      </header>

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
                  <Link to="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white">
                    Contact
                  </Link>
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
                  <Link to="/privacy" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white">
                    Terms
                  </Link>
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
