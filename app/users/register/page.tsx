'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/services/authService';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  captcha: string;
}

interface CategoryData {
  image: string;
  title: string;
  alt: string;
}

type CategoryType = 'photographer' | 'makeup' | 'developer' | 'tutor';

export default function RegistrationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [category, setCategory] = useState<CategoryType>('photographer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generatedCaptcha, setGeneratedCaptcha] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    captcha: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Generate captcha function
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 7; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const refreshCaptcha = () => {
    const newCaptcha = generateCaptcha();
    setGeneratedCaptcha(newCaptcha);
    setFormData(prev => ({ ...prev, captcha: '' }));
  };

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          // User is already logged in, redirect to dashboard
          router.push('/users/login');
        } else {
          setIsCheckingAuth(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsCheckingAuth(false);
      }
    };

    const categoryParam = searchParams.get('category') as CategoryType;
    if (categoryParam && ['photographer', 'makeup', 'developer', 'tutor'].includes(categoryParam)) {
      setCategory(categoryParam);
    }
    
    refreshCaptcha();
    checkAuth();
  }, [searchParams, router]);

  const categoryData: Record<CategoryType, CategoryData> = {
    photographer: {
      image: '/images/photographer.png',
      title: 'Photographer',
      alt: 'Professional photographer with camera'
    },
    makeup: {
      image: '/images/artist.png',
      title: 'Makeup Artist',
      alt: 'Professional makeup artist'
    },
    developer: {
      image: '/images/tutor.png',
      title: 'Developer',
      alt: 'Professional developer'
    },
    tutor: {
      image: '/images/study.png',
      title: 'Tutor',
      alt: 'Professional tutor'
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    // Validate all required fields
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.captcha) {
      setError('Please fill in all required fields');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Validate password strength (both password and confirmPassword must be at least 8 characters)
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (formData.confirmPassword.length < 8) {
      setError('Confirm password must be at least 8 characters long');
      return false;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return false;
    }

    // Validate captcha (case-insensitive)
    if (formData.captcha.toUpperCase() !== generatedCaptcha.toUpperCase()) {
      setError('Invalid captcha code');
      refreshCaptcha();
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Map category to userType (1-4)
      const userTypeMap: Record<CategoryType, number> = {
        photographer: 1,
        makeup: 2,
        developer: 3,
        tutor: 4
      };

      const userType = userTypeMap[category];

      console.log('🔵 Registration Data:', {
        name: formData.name,
        email: formData.email,
        password: '***hidden***',
        confirmPassword: '***hidden***',
        userType: userType,
        category: category
      });

      const response = await authService.register(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword,
        category,
        formData.captcha
      );

      if (response.success) {
        setSuccess('Registration successful! Check your email for verification code.');
        
        // Store email in localStorage for verification page
        if (typeof window !== 'undefined') {
          localStorage.setItem('pendingVerificationEmail', formData.email);
        }
        
        // Redirect to verification page
        setTimeout(() => {
          router.push(`/users/verification?category=${category}&email=${encodeURIComponent(formData.email)}`);
        }, 1500);
      } else {
        setError(response.error || 'Registration failed');
        refreshCaptcha();
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'An unexpected error occurred');
      refreshCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-700">Checking authentication...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <div className="text-orange-500 text-2xl font-bold">T</div>
              <span className="ml-1 text-gray-800 font-semibold">TRACEWORKS</span>
              <span className="ml-2 text-xs text-gray-500">JOBS</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">Jobs</Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">Companies</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href={`/users/login?category=${category}`}>
                <button className="px-6 py-2 text-orange-500 border border-orange-500 rounded hover:bg-orange-50 transition-colors">
                  Login
                </button>
              </Link>
              <Link href={`/users/register?category=${category}`}>
                <button className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors">
                  Register Now
                </button>
              </Link>
              <Link href="/employers">
                <button className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors">
                  Employers
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left Side - Image */}
            <div className="bg-linear-to-br from-gray-100 to-gray-200 p-8 flex items-center justify-center min-h-175">
              <img
                src={categoryData[category].image}
                alt={categoryData[category].alt}
                className="w-full max-w-lg h-auto object-contain"
              />
            </div>

            {/* Right Side - Registration Form */}
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create your free account
              </h2>
              <p className="text-gray-600 mb-8">
                Create your account today and unlock endless opportunities
              </p>

              {/* Category Badge */}
              <div className="mb-6">
                <span className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
                  Registering as: {categoryData[category].title}
                </span>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                  {success}
                </div>
              )}

              <div className="space-y-5">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Set Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none pr-12 transition-colors"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`flex-1 h-1 rounded ${
                              formData.password.length >= 8 &&
                              /[A-Z]/.test(formData.password) &&
                              /[0-9]/.test(formData.password)
                                ? 'bg-green-500'
                                : formData.password.length >= 6
                                ? 'bg-yellow-500'
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600">
                        {formData.password.length === 0
                          ? 'Enter a password'
                          : formData.password.length < 8
                          ? 'Password too short (min 8 characters)'
                          : !/[A-Z]/.test(formData.password)
                          ? 'Add uppercase letters'
                          : !/[0-9]/.test(formData.password)
                          ? 'Add numbers'
                          : 'Strong password'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none pr-12 transition-colors"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">
                      ⚠️ Passwords do not match
                    </p>
                  )}
                  {formData.confirmPassword && formData.password === formData.confirmPassword && formData.confirmPassword.length >= 8 && (
                    <p className="mt-2 text-sm text-green-600">
                      ✓ Passwords match
                    </p>
                  )}
                </div>

                {/* Captcha */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Captcha <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      disabled={isLoading}
                      className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw size={14} />
                      Refresh
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gray-200 px-6 py-3 rounded text-xl font-bold tracking-wider select-none flex-1 text-center">
                      {generatedCaptcha}
                    </div>
                  </div>
                  <input
                    type="text"
                    name="captcha"
                    value={formData.captcha}
                    onChange={handleInputChange}
                    placeholder="Enter the characters above"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                    required
                    disabled={isLoading}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.99]'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Registering...
                    </span>
                  ) : (
                    'Register Now'
                  )}
                </button>

                {/* Login Link */}
                <p className="text-center text-sm text-gray-600 pt-2">
                  Already have an account?{' '}
                  <Link 
                    href={`/users/login?category=${category}`} 
                    className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}