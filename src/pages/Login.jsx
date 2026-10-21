import React, { useState } from 'react';
import { Users, Eye, EyeOff, Loader2, AlertCircle, Lock } from 'lucide-react';
import { authService, saveSession } from '../services/api';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [validationErrors, setValidationErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login(email.trim(), password);

      if (response && response.token && response.user) {
        saveSession(response.token, response.user);
        onLoginSuccess(response.user, response.token);
      } else {
        throw new Error('Authentication succeeded but invalid response received.');
      }
    } catch (err) {
      setErrorMessage(
        err.message || 'Authentication failed. Please verify your credentials and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <h1 className="text-center text-2xl font-bold tracking-tight text-slate-900">
          User<span className="text-indigo-600">Flow</span>
        </h1>
        <h2 className="mt-2 text-center text-xl font-semibold text-slate-800">
          Welcome back
        </h2>
        <p className="mt-1 text-center text-sm text-slate-500">
          Sign in to access your user management dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 border border-slate-200 rounded-2xl shadow-sm">
          {errorMessage && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-sm text-red-700">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email Field */}
            <div>
              <label
                htmlFor="loginEmail"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <input
                id="loginEmail"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) {
                    setValidationErrors((prev) => ({ ...prev, email: '' }));
                  }
                }}
                disabled={isLoading}
                placeholder="admin@example.com"
                className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  validationErrors.email
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
                } disabled:bg-slate-50 disabled:cursor-not-allowed`}
              />
              {validationErrors.email && (
                <p className="mt-1.5 text-xs text-red-600">
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="loginPassword"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="loginPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) {
                      setValidationErrors((prev) => ({ ...prev, password: '' }));
                    }
                  }}
                  disabled={isLoading}
                  placeholder="Enter your password"
                  className={`w-full pl-3.5 pr-10 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    validationErrors.password
                      ? 'border-red-300 focus:ring-red-400'
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
                  } disabled:bg-slate-50 disabled:cursor-not-allowed`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 disabled:opacity-40"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-1.5 text-xs text-red-600">
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm rounded-lg shadow-xs shadow-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Initial administrator access is provisioned via the backend setup script.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
