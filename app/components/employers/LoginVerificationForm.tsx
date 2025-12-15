'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginVerificationForm() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join('');
    console.log('Login Verification code:', verificationCode);
    // Add verification logic here
    router.push('/employers'); // Redirect to employers dashboard after login verification
  };

  const handleResendCode = () => {
    setTimer(30);
    // Add resend code logic here
    console.log('Resending login verification code...');
  };

  return (
    <section className="min-h-screen bg-gray-50 pt-20">
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

          {/* Right Side - Verification Form */}
          <div className="max-w-xl mx-auto px-6 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Enter the verification code
            </h2>
            <p className="text-gray-600 text-sm mb-8">
              "Your verification code has been sent! Check your email now to complete the login process.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Code Input Boxes */}
              <div className="flex gap-3 justify-start mb-4">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD835] focus:border-transparent outline-none"
                  />
                ))}
              </div>

              {/* Timer */}
              <p className="text-left text-sm text-gray-600">
                00:{timer.toString().padStart(2, '0')} sec
              </p>

              {/* Resend Code */}
              <p className="text-left text-sm text-gray-600">
                Haven't received the code?{' '}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={timer > 0}
                  className={`font-semibold ${
                    timer > 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-orange-500 hover:underline'
                  }`}
                >
                  Resend code
                </button>
              </p>

              {/* Verify Button */}
              <button
                type="submit"
                className="w-full py-3 bg-[#0A0A3D] text-white font-bold rounded-md hover:bg-[#14145A] transition-colors"
              >
                Verify
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}