import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { GoogleLogin } from "@react-oauth/google";

export default function AuthPage({ mode }) {
  const isSignup = mode === 'signup';
  const { signup, login, googleLogin, githubLogin, loading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignup) {
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      await signup(formData.name, formData.email, formData.password);
    } else {
      await login(formData.email, formData.password);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl p-10 shadow-lg border border-gray-200">

        {/* Header */}
        <section className="flex flex-col items-center mb-8">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
            <div
              style={{
                width: 48,
                height: 48,
                backgroundColor: '#DC2626',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <BookOpen size={22} color="#fff" />
            </div>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>AI-Study Copilot</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-2">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-gray-500 text-center">
            {isSignup ? 'Start your AI-powered learning journey.' : 'Continue your learning journey.'}
          </p>
        </section>

        {/* Form */}
        <section>
          <form onSubmit={handleSubmit}>
            {isSignup && (
              <input
                type="text"
                name="name"
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            )}
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {isSignup && (
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            )}
            {!isSignup && (
              <div className="text-right mb-6">
                <button type="button" className="text-red-600 text-sm font-medium">
                  Forgot Password?
                </button>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Login'}
            </button>
          </form>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400 font-medium">OR CONTINUE WITH</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Social Login */}
        <section>
          <div className="flex gap-3">
            <div className="flex-1 flex justify-center">
  <GoogleLogin
    onSuccess={async (credentialResponse) => {
      if (credentialResponse.credential) {
        await googleLogin(credentialResponse.credential);
      } else {
        toast.error("Failed to get Google ID token");
      }
    }}
    onError={() => {
      toast.error("Google Login Failed");
    }}
  />
</div>
            <button
              type="button"
              className="flex-1 border border-gray-200 rounded-lg py-3 text-sm font-medium hover:bg-gray-50 flex items-center justify-center"
              onClick={() => {
  window.location.href = "http://localhost:5000/api/auth/github";
}}
            >
              GitHub
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-6 text-center text-sm text-gray-500">
          {isSignup ? (
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-red-600 font-medium">
                Login
              </Link>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="text-red-600 font-medium">
                Sign Up
              </Link>
            </p>
          )}
        </footer>

      </div>
    </div>
  );
}
