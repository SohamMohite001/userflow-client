import React, { useState, useEffect } from 'react';
import { X, UserPlus, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AddUserModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [validationErrors, setValidationErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setEmail('');
      setPassword('');
      setShowPassword(false);
      setValidationErrors({});
      setServerError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Handle ESC key press to close modal (only when not submitting)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = 'Full name is required.';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long.';
    } else if (name.trim().length > 100) {
      errors.name = 'Name cannot exceed 100 characters.';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSuccess({
        name: name.trim(),
        email: email.trim(),
        password
      });
      // The parent will call onClose and trigger the success notification
    } catch (err) {
      setServerError(
        err.message || 'An error occurred while creating the user. Please try again.'
      );
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden transform transition-all">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <h2 id="modal-title" className="text-base font-semibold text-slate-900">
              Register New User
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {serverError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (validationErrors.name) {
                  setValidationErrors((prev) => ({ ...prev, name: '' }));
                }
              }}
              disabled={isSubmitting}
              placeholder="e.g. Jane Doe"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                validationErrors.name
                  ? 'border-red-300 focus:ring-red-400'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              } disabled:bg-slate-50 disabled:cursor-not-allowed`}
            />
            {validationErrors.name && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.name}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label
              htmlFor="modalEmail"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Email Address
            </label>
            <input
              id="modalEmail"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (validationErrors.email) {
                  setValidationErrors((prev) => ({ ...prev, email: '' }));
                }
              }}
              disabled={isSubmitting}
              placeholder="jane@example.com"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                validationErrors.email
                  ? 'border-red-300 focus:ring-red-400'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              } disabled:bg-slate-50 disabled:cursor-not-allowed`}
            />
            {validationErrors.email && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="modalPassword"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Temporary Password
            </label>
            <div className="relative">
              <input
                id="modalPassword"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationErrors.password) {
                    setValidationErrors((prev) => ({ ...prev, password: '' }));
                  }
                }}
                disabled={isSubmitting}
                placeholder="At least 8 characters"
                className={`w-full pl-3.5 pr-10 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  validationErrors.password
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
                } disabled:bg-slate-50 disabled:cursor-not-allowed`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
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
            {validationErrors.password ? (
              <p className="mt-1 text-xs text-red-600">
                {validationErrors.password}
              </p>
            ) : (
              <p className="mt-1 text-xs text-slate-400">
                Default assigned role will be standard USER.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Register User</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
