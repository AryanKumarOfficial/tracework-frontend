import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="bg-[#F4E189] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-8 border-white overflow-hidden shadow-xl">
              <Image
                src="/images/about-team.jpg"
                alt="Professional team"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Connecting careers with opportunities
            </h2>
            <p className="text-gray-700 text-lg mb-4 leading-relaxed">
              Whether you're searching for your dream job or looking to hire skilled professionals, our comprehensive platform offers a seamless experience.
            </p>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Job seekers can explore diverse job listings and apply with ease, while employers can find the perfect candidates to grow their teams.
            </p>
            <Link
              href="/search-jobs"
              className="inline-flex items-center gap-2 text-gray-900 font-semibold text-lg hover:gap-4 transition-all underline"
            >
              Search/Post Jobs
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
