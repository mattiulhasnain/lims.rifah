import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, Lock, User, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [logoError, setLogoError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(username, password);
    if (!success) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 animate-gradient bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-200" style={{ filter: 'blur(0px)' }} />
      {/* Subtle floating shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 opacity-20 rounded-full blur-3xl animate-float-slow" style={{ zIndex: 1, top: '-120px', left: '-120px' }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-300 opacity-20 rounded-full blur-3xl animate-float-slower" style={{ zIndex: 1, bottom: '-100px', right: '-100px' }} />
      {/* Glassmorphism Card */}
      <div className="relative z-10 max-w-md w-full p-8 rounded-3xl shadow-2xl border border-white/30 bg-white/30 backdrop-blur-2xl flex flex-col items-center animate-fade-in-up" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}>
        {/* Rifah Laboratories Logo */}
        <div className="w-24 h-24 rounded-full bg-white/60 flex items-center justify-center mb-4 shadow-xl animate-pop-in border-4 border-white" style={{ overflow: 'hidden' }}>
          {!logoError ? (
            <img
              src="/rifah-logo.png"
              alt="Rifah Laboratories Logo"
              className="w-20 h-20 object-contain drop-shadow-lg"
              onError={() => setLogoError(true)}
            />
          ) : (
            <Stethoscope className="w-10 h-10 text-blue-600 opacity-60" />
          )}
            </div>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '1px' }}>LabManager Pro</h2>
        <p className="text-lg text-gray-700 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>Ultimate Laboratory Management System</p>
        <form className="w-full space-y-6" onSubmit={handleSubmit} autoComplete="off">
            <div className="space-y-4">
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-sm transition-all"
                    placeholder="Enter your username"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>
              </div>
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-sm transition-all"
                    placeholder="Enter your password"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
            {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-shake">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-bold text-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all animate-pop-in"
            style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '1px' }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            © 2025 LabManager Pro. All rights reserved.
          </p>
        </div>
      </div>
      {/* Animations */}
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(.4,0,.2,1) both; }
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.7); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-pop-in { animation: pop-in 0.6s cubic-bezier(.4,0,.2,1) both; }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        @keyframes float-slower {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(20px) scale(1.08); }
        }
        .animate-float-slower { animation: float-slower 12s ease-in-out infinite; }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 16s ease-in-out infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.4s cubic-bezier(.4,0,.2,1); }
      `}</style>
    </div>
  );
};

export default Login;