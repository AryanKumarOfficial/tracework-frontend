import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="grid md:grid-cols-2 min-h-screen">
      {/* Left Side - Job Seekers/Employers */}
      <div className="relative flex items-center justify-center bg-gray-100 min-h-[50vh] md:min-h-screen">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-left.png"
            alt="Professional workspace"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Yellow strip at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-20 bg-[#F4E189] z-10"></div>

        {/* Text positioned in upper area */}
        <div className="absolute top-1/4 left-0 right-0 z-20 text-center px-6 md:px-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg">
            Your journey to the right job
            <br />
            <span className="text-2xl md:text-4xl">OR</span>
            <br />
            The ideal hire starts here
          </h1>
        </div>

        {/* Button positioned at center */}
        <div className="absolute top-3/4 left-160 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <Link
            href="/employers"
            className="
              inline-flex items-center justify-center
              px-12 py-4
              bg-[#0A0A3D]
              text-[#FDD835]
              font-bold text-base md:text-lg
              rounded-l-full rounded-r-md
              shadow-xl
              hover:bg-[#14145A]
              hover:shadow-2xl
              transition-all duration-300
              transform hover:scale-105
              whitespace-nowrap
            "
          >
            Search/Post Jobs
          </Link>
        </div>
      </div>

      {/* Right Side - Service Providers */}
      <div className="relative flex items-center justify-center bg-gray-200 min-h-[50vh] md:min-h-screen">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-right.png"
            alt="Professional consultation"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Yellow strip at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-20 bg-[#F4E189] z-10"></div>

        {/* Text positioned in upper area */}
        <div className="absolute top-1/4 left-0 right-0 z-20 text-center px-6 md:px-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg">
            The go-to platform
            <br />
            <span className="text-2xl md:text-4xl">FOR</span>
            <br />
            Finding/Providing services
          </h1>
        </div>

        {/* Button positioned at center */}
        <div className="absolute top-3/4 left-[130.5] transform -translate-x-1/2 -translate-y-1/2 z-20">
          <Link
            href="/find-services"
            className="
              inline-flex items-center justify-center
              px-12 py-4
              bg-[#FDD835]
              text-[#0A0A3D]
              font-bold text-base md:text-lg
              rounded-r-full rounded-l-md
              shadow-xl
              hover:bg-[#FBC02D]
              hover:shadow-2xl
              transition-all duration-300
              transform hover:scale-105
              whitespace-nowrap
            "
          >
            Find/Offer Services
          </Link>
        </div>
      </div>
    </section>
  );
}