'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/services/authService';

interface FormData {
  email: string;
  password: string;
}

interface CategoryData {
  image: string;
  title: string;
  alt: string;
}

type CategoryType = 'photographer' | 'makeup' | 'developer' | 'tutor';

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

const fallbackImages: Record<CategoryType, string> = {
  photographer: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=600&h=700&fit=crop',
  makeup: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=700&fit=crop',
  developer: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=700&fit=crop',
  tutor: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=700&fit=crop'
};

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [category, setCategory] = useState<CategoryType>('photographer');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = authService.isAuthenticated();
        if (isAuthenticated) {
          router.push('/users/basicinfo');
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

    // Check for verification success message
    const verified = searchParams.get('verified');
    if (verified === 'true') {
      setSuccess('Account verified successfully! Please login.');
    }

    checkAuth();
  }, [searchParams, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

 const handleLogin = async () => {
  if (!formData.email || !formData.password) {
    setError('Please fill in all fields');
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    setError('Please enter a valid email address');
    return;
  }

  setIsLoading(true);
  setError('');
  setSuccess('');

  try {
    const result = await authService.login(formData.email, formData.password);

    // Detailed logging - click to expand in console
    console.group('🔍 Login Response Details');
    console.log('Success:', result.success);
    console.log('Message:', result.message);
    console.log('Data object:', result.data);
    console.log('Has token in data?', 'token' in (result.data || {}));
    console.log('Token value:', result.data?.token);
    console.log('Token length:', result.data?.token?.length);
    console.log('User ID:', result.data?.userId);
    console.log('Email:', result.data?.email);
    console.log('Name:', result.data?.name);
    console.groupEnd();

    if (result.success && result.data) {
      // Check if token was saved
      const savedToken = authService.getToken();
      console.log('💾 Token saved to cookies?', savedToken ? 'YES' : 'NO');
      if (savedToken) {
        console.log('💾 Token preview:', savedToken.substring(0, 30) + '...');
      }
      
      // Login successful - authService already set cookies
      setSuccess('Login successful! Redirecting...');
      
      // Redirect to profile or dashboard
      setTimeout(() => {
        router.push('/users/basicinfo');
      }, 1000);
    } else {
      setError(result.error || 'Invalid email or password');
    }
  } catch (error: any) {
    setError(error.message || 'An error occurred. Please try again.');
    console.error('Login error:', error);
  } finally {
    setIsLoading(false);
  }
};

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin();
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
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 flex items-center justify-center min-h-[700px]">
              <div className="relative w-full max-w-lg h-full flex items-center justify-center">
                <img
                  src={categoryData[category]?.image || fallbackImages[category]}
                  alt={categoryData[category]?.alt || `${category} image`}
                  className="w-full h-auto max-h-[500px] object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = fallbackImages[category];
                  }}
                />
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Login to your account
              </h2>
              <p className="text-gray-600 mb-8">
                Log in to connect with clients and unlock endless opportunities
              </p>

              {/* Category Badge */}
              <div className="mb-6">
                <span className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
                  Logging in as: {categoryData[category]?.title || category}
                </span>
              </div>

              {/* Success Message */}
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                  {success}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-5" onKeyPress={handleKeyPress}>
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
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
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
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
                </div>

                {/* Forgot Password Link */}
                <div className="text-left">
                  <Link 
                    href={`/users/forgot-password?category=${category}`} 
                    className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  onClick={handleLogin}
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
                      Logging in...
                    </span>
                  ) : 'Login'}
                </button>

                {/* Register Link */}
                <p className="text-center text-sm text-gray-600 pt-2">
                  Don't have an account?{' '}
                  <Link 
                    href={`/users/register?category=${category}`} 
                    className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
                  >
                    Register Now
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