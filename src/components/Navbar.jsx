import React from 'react';
import { Users, LogOut } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                User<span className="text-indigo-600">Flow</span>
              </span>
            </div>
          </div>

          {/* User Details & Logout */}
          <div className="flex items-center gap-3 sm:gap-5">
            {user && (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200 sm:border-l-0">
                <div
                  className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold text-xs flex items-center justify-center shadow-xs"
                  title={user.name}
                >
                  {getInitials(user.name)}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-semibold text-slate-800 leading-tight">
                    {user.name}
                  </div>
                  <div className="text-xs text-slate-500 leading-tight">
                    {user.email}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={onLogout}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              title="Sign out of your account"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden xs:inline">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
