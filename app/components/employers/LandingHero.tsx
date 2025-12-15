import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

export default function LandingHero() {
  return (
    <section className="min-h-screen bg-gray-100 pt-24 pb-0">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-0 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8 pr-0 -mt-60">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight font-exo">
              Discover Your Next
              <br />
              <span className="bg-[#FFD902] px-4 py-2 inline-block mt-2">
                Great Hire
              </span>
            </h1>
            
            <p className="text-gray-600 text-lg leading-relaxed">
                Efficient, effective recruitment solutions for every employer.
            </p>

            <div className="flex gap-4 pt-20">
              <Link
                href="/auth/login"
                className="px-10 py-3 bg-[#050126] text-white font-semibold rounded-md hover:bg-[#050126] transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="px-10 py-3 bg-[#050126] text-white font-semibold rounded-md hover:bg-[#050126] transition-colors"
              >
                Register Now
              </Link>
            </div>
          </div>

          {/* Right Content - Images */}
          <div className="relative h-[649px] md:h-[812px]">
  {/* Image Wrapper */}
  <div className="absolute top-0 right-0 w-full h-[70%] rounded-lg overflow-hidden shadow-xl">
    <Image
      src="/images/landing-hero.png"
      alt="Professional consultation"
      fill
      className="object-cover"
    />

    {/* Yellow CTA Box */}
    <div className="absolute bottom-2 left-0  bg-[#FFD902] p-8 rounded-lg shadow-2xl z-10 w-[320px] md:w-[320px] md:h-[180px]">
      <Link href="/search-jobs" className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl md:text-3xl font-bold text-gray-900 leading-tight">
            Start Your
            <br />
            Search
          </h3>
        </div>

        <div className="flex items-center">
          <ChevronRight size={45} className="text-gray-900" strokeWidth={4} />
          <ChevronRight size={45} className="text-gray-900 -ml-5" strokeWidth={4} />
          <ChevronRight size={45} className="text-gray-900 -ml-5" strokeWidth={4} />
        </div>
      </Link>
    </div>
  </div>
</div>

        </div>
      </div>
    </section>
  );
}
