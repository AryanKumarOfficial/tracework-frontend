'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    captcha: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add validation here
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Navigate to verification page
    router.push('/verification');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="min-h-screen bg-gray-50 pt-0">
  <div className="w-full py-12">
    <div className="grid md:grid-cols-2 gap-12 items-start">

      {/* Left Side - Image */}
      <div className="relative h-[755px] w-[800px] overflow-hidden shadow-xl">
        <Image
          src="/images/landing-hero1.png"
          alt="Professional meeting"
          fill
          className="object-cover"
        />
      </div>

          {/* Right Side - Registration Form */}
          
      <div className="max-w-xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Create your free account
            </h2>
            <p className="text-gray-600 text-sm mb-8 leading-relaxed">
              "Simplify your hiring process and find top talent effortlessly. Post jobs, browse candidates, and build your dream team with ease!"
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter your company name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FDD835] focus:border-transparent outline-none"
                  />
                  <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your business email address"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FDD835] focus:border-transparent outline-none"
                  />
                  <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              {/* Set Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Set Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FDD835] focus:border-transparent outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirmation */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmation
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FDD835] focus:border-transparent outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Captcha */}
              <div>
                <div className="flex items-center gap-3 mb-2 mt-2">
                  <div className="bg-gray-200 px-6 py-3 rounded font-mono text-xl tracking-wider select-none">
                    6B9A0EA
                  </div>
                </div>
                <input
                  type="text"
                  name="captcha"
                  value={formData.captcha}
                  onChange={handleChange}
                  placeholder="Enter the characters"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FDD835] focus:border-transparent outline-none"
                />
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="w-full py-3 bg-[#0A0A3D] text-white font-bold rounded-md hover:bg-[#14145A] transition-colors mt-6"
              >
                Register Now
              </button>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{' '}
                <Link href="/login" className="text-orange-500 font-semibold hover:underline">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}