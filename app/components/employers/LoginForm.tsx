'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', formData);
    router.push('/login-verification');
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
            {/* Overlay Card */}
            <div className="absolute bottom-8 left-8 bg-[#0A0A3D] p-6 rounded-lg max-w-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xl">K</span>
                </div>
                <span className="text-white font-bold text-xl">moneypro</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Moneypro</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                "Game-changer for hiring! Found the perfect candidates quickly and efficiently. Highly recommend for streamlining your recruitment process."
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="max-w-xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Login into your account
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

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
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

              {/* Forgot Password Link */}
              <div className="text-left">
                <Link href="/forgot-password" className="text-sm text-orange-500 font-semibold hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full py-3 bg-[#0A0A3D] text-white font-bold rounded-md hover:bg-[#14145A] transition-colors mt-6"
              >
                Login
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?{' '}
                <Link href="/register" className="text-orange-500 font-semibold hover:underline">
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
