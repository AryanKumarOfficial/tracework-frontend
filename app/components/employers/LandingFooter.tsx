import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer className="bg-gray-50 py-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <div>
                <div className="font-bold text-gray-900 text-lg leading-tight">
                  TRACEWORKS
                </div>
                {/* <div className="text-orange-500 text-xs font-semibold">360°</div> */}
              </div>
            </div>
          </div>
            <div className="col-span-2 md:col-span-4 flex justify-end gap-25">
  {/* About */}
  <div>
    <h3 className="font-bold text-gray-900 mb-4">About</h3>
    <ul className="space-y-2">
      <li>
        <Link href="/about" className="text-gray-600 hover:text-orange-500 transition text-sm">
          About Us
        </Link>
      </li>
      <li>
        <Link href="/team" className="text-gray-600 hover:text-orange-500 transition text-sm">
          Home
        </Link>
      </li>
      <li>
        <Link href="/team" className="text-gray-600 hover:text-orange-500 transition text-sm">
          Jobs
        </Link>
      </li>
      <li>
        <Link href="/companies" className="text-gray-600 hover:text-orange-500 transition text-sm">
          Companies
        </Link>
      </li>
    </ul>
  </div>

  {/* Help */}
  <div>
    <h3 className="font-bold text-gray-900 mb-4">Help</h3>
    <ul className="space-y-2">
      <li>
        <Link href="/contact" className="text-gray-600 hover:text-orange-500 transition text-sm">
          Contact Us
        </Link>
      </li>
      <li>
        <Link href="/report" className="text-gray-600 hover:text-orange-500 transition text-sm">
          Report Issue
        </Link>
      </li>
    </ul>
  </div>

  {/* Privacy Policy */}
  <div>
    <h3 className="font-bold text-gray-900 mb-4">Privacy Policy</h3>
    <ul className="space-y-2">
      <li>
        <Link href="/terms" className="text-gray-600 hover:text-orange-500 transition text-sm">
          Terms & Conditions
        </Link>
      </li>
      <li>
        <Link href="/fraud-alert" className="text-gray-600 hover:text-orange-500 transition text-sm">
          Fraud Alert
        </Link>
      </li>
    </ul>
  </div>
</div>

        </div>
       
      </div>
    </footer>
  );
}