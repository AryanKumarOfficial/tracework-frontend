import Image from 'next/image';
import { FileText, Briefcase, Mail, Users } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: FileText,
      title: 'Easy Registration',
      description: 'Sign up and create an account quickly and easily to start your hiring journey.',
      color: 'bg-[#0A0A3D] text-white',
    },
    {
      icon: Briefcase,
      title: 'Post a Job',
      description: 'Publish your job listing and spend Trace Coins to reach a wide pool of qualified candidates.',
      color: 'bg-[#0A0A3D] text-white',
    },
    {
      icon: Mail,
      title: 'Receive Applications',
      description: 'Get applications directly to your inbox and review detailed candidate profiles.',
      color: 'bg-[#0A0A3D] text-white',
    },
    {
      icon: Users,
      title: 'Connect and Hire',
      description: 'Pay to view candidate contact details and connect with top talent to make your next great hire.',
      color: 'bg-[#0A0A3D] text-white',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-20">
          How It Works?
        </h2>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left - Steps */}
          <div className="space-y-10">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className={`flex-shrink-0 w-16 h-16 ${step.color} rounded-lg flex items-center justify-center shadow-lg`}>
                  <step.icon size={32} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right - Image */}
          <div className="relative">
            <div className="relative h-[379px] md:h-[406px] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/images/how-it-works.png"
                alt="Professional team"
                fill
                className="object-cover"
              />
            </div>
            {/* Yellow accent bar at bottom */}
            <div className="absolute bottom-0 right-0 w-3/4 h-6 "></div>
          </div>
        </div>
      </div>
    </section>
  );
}
