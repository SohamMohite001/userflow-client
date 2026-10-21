import React from 'react';
import { Shield, User, AlertCircle, RefreshCw, Users } from 'lucide-react';

export default function UserTable({ users, isLoading, error, onRetry }) {
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '—';
    }
  };

  // 1. Loading Skeleton State
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th scope="col" className="py-3.5 px-4 sm:px-6">User</th>
                <th scope="col" className="py-3.5 px-4 sm:px-6">Email Address</th>
                <th scope="col" className="py-3.5 px-4 sm:px-6">Role</th>
                <th scope="col" className="py-3.5 px-4 sm:px-6">Registered On</th>
                <th scope="col" className="py-3.5 px-4 sm:px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 animate-pulse">
              {[1, 2, 3, 4].map((item) => (
                <tr key={item}>
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                      <div className="h-4 w-28 bg-slate-200 rounded"></div>
                    </div>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <div className="h-4 w-40 bg-slate-200 rounded"></div>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <div className="h-4 w-24 bg-slate-200 rounded"></div>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="bg-white border border-red-200 rounded-xl p-8 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">
          Failed to load users
        </h3>
        <p className="text-sm text-slate-500 mb-4 max-w-md mx-auto">
          {error}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Request
          </button>
        )}
      </div>
    );
  }

  // 3. Empty State
  if (!users || users.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <Users className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">
          No registered users found
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          There are currently no registered users in the database. Use the &quot;Add User&quot; button above to create a new user account.
        </p>
      </div>
    );
  }

  // 4. Data Table State
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th scope="col" className="py-3.5 px-4 sm:px-6">User</th>
              <th scope="col" className="py-3.5 px-4 sm:px-6">Email Address</th>
              <th scope="col" className="py-3.5 px-4 sm:px-6">Role</th>
              <th scope="col" className="py-3.5 px-4 sm:px-6">Registered On</th>
              <th scope="col" className="py-3.5 px-4 sm:px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {users.map((user) => {
              const isAdmin = user.role === 'ADMIN';

              return (
                <tr
                  key={user._id || user.id || user.email}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  {/* User Name & Icon */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          isAdmin
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {isAdmin ? (
                          <Shield className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <User className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                      <span className="font-medium text-slate-900">
                        {user.name}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-4 px-4 sm:px-6 text-slate-600 font-mono text-xs sm:text-sm">
                    {user.email}
                  </td>

                  {/* Role Badge */}
                  <td className="py-4 px-4 sm:px-6">
                    {isAdmin ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        ADMIN
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        USER
                      </span>
                    )}
                  </td>

                  {/* Registered Date */}
                  <td className="py-4 px-4 sm:px-6 text-slate-500 text-xs sm:text-sm">
                    {formatDate(user.createdAt)}
                  </td>

                  {/* Account Status */}
                  <td className="py-4 px-4 sm:px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Active
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
