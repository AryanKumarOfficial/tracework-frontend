import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#F4E189] py-12 border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <div>
                <div className="font-bold text-gray-900 text-lg leading-tight">
                  TRADEWORKS
                </div>
                <div className="text-orange-500 text-xs font-semibold">360°</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-lg">About</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-700 hover:text-orange-500 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-700 hover:text-orange-500 transition">
                  Home
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-700 hover:text-orange-500 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/report" className="text-gray-700 hover:text-orange-500 transition">
                  Report Issue
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Privacy Policy</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-700 hover:text-orange-500 transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/fraud-alert" className="text-gray-700 hover:text-orange-500 transition">
                  Fraud Alert
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-300 text-center text-gray-600 text-sm">
          © 2024 TradeWorks 360°. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
