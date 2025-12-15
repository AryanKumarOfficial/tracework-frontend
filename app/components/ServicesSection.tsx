import Image from 'next/image';
import Link from 'next/link';

export default function ServicesSection() {
  const experts = [
    { id: 1, image: '/images/expert-1.jpg', alt: 'Expert 1' },
    { id: 2, image: '/images/expert-2.jpg', alt: 'Expert 2' },
    { id: 3, image: '/images/expert-3.jpg', alt: 'Expert 3' },
    { id: 4, image: '/images/expert-4.jpg', alt: 'Expert 4' },
  ];

  return (
    <section className="bg-[#F4E189] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Find Experts or Offer Your Services
            </h2>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Whether you're looking to hire an expert to meet your needs or you're a professional ready to provide your expertise, our platform seamlessly connects you with the right people. Job seekers can showcase their services, while service providers can effortlessly reach new clients.
            </p>
            <Link
              href="/find-services"
              className="inline-block px-8 py-4 bg-[#FDD835] text-gray-900 font-semibold rounded-md hover:bg-[#FBC02D] transition-colors"
            >
              Find/Offer Services
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6 md:gap-8">
            {experts.map((expert, index) => (
              <div
                key={expert.id}
                className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white overflow-hidden shadow-lg mx-auto ${
                  index % 2 === 1 ? 'mt-8' : ''
                }`}
              >
                <Image
                  src={expert.image}
                  alt={expert.alt}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}