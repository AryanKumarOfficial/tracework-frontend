'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {Eye, EyeOff} from 'lucide-react';

export default function LoginForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Redirect to profile or dashboard
                router.push('/employers/profile');
            } else {
                alert(data.message || 'Invalid credentials');
            }
        } catch (error) {
            alert('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };
    return (
        <section className="min-h-screen bg-gray-50 pt-0">
            <div className="w-full py-12">
                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* ... Left Side Image ... */}
                    <div className="relative h-[755px] w-[800px] overflow-hidden shadow-xl">
                        <Image src="/images/landing-hero1.png" alt="Hero" fill className="object-cover"/>
                    </div>

                    {/* ... Right Side Form ... */}
                    <div className="max-w-xl mx-auto px-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Login into your account</h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Removed Company Name input as standard login usually uses Email */}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-[#0A0A3D] text-white font-bold rounded-md hover:bg-[#14145A] transition-colors mt-6 disabled:opacity-50"
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>

                            <p className="text-center text-sm text-gray-600 mt-4">
                                Don&#39;t have an account? <Link href="/register"
                                                                 className="text-orange-500 font-semibold hover:underline">Sign
                                Up</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
