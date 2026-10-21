import React, { useState, useEffect, useCallback } from 'react';
import { Users, ShieldCheck, UserPlus, RefreshCw, CheckCircle2, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import UserTable from '../components/UserTable';
import AddUserModal from '../components/AddUserModal';
import { userService } from '../services/api';

export default function Dashboard({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successNotification, setSuccessNotification] = useState('');

  // Fetch users from API
  const fetchUsers = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await userService.getUsers();
      if (response && Array.isArray(response.users)) {
        setUsers(response.users);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(
        err.status === 403
          ? 'Access denied. You do not have administrator permissions to view this user directory.'
          : err.message || 'An error occurred while loading the user directory.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle new user creation from modal
  const handleUserCreated = async (userData) => {
    const result = await userService.createUser(userData);

    // Close modal
    setIsModalOpen(false);

    // Show success notification
    const createdName = result?.user?.name || userData.name;
    setSuccessNotification(`User "${createdName}" was registered successfully!`);

    // Refresh list and counter
    await fetchUsers(true);

    // Auto-clear notification after 5 seconds
    setTimeout(() => {
      setSuccessNotification('');
    }, 5000);
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <Navbar user={user} onLogout={onLogout} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Notification Alert */}
        {successNotification && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800 shadow-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-sm font-medium">{successNotification}</span>
            </div>
            <button
              onClick={() => setSuccessNotification('')}
              className="text-emerald-500 hover:text-emerald-700 p-1 rounded-lg hover:bg-emerald-100 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Welcome Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome back, {user?.name || 'Administrator'}!
            </h1>
            <p className="mt-1 text-sm text-slate-500 max-w-2xl">
              Manage your organization&apos;s registered accounts, inspect access roles, and provision new user credentials.
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-xl shadow-xs shadow-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          )}
        </div>

        {/* Dashboard Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {/* Card 1: Total Users */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Registered Users
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-0.5">
                {isLoading ? (
                  <span className="text-slate-300">...</span>
                ) : (
                  users.length
                )}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Verified database records
              </div>
            </div>
          </div>

          {/* Card 2: System Security */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                System Security
              </div>
              <div className="text-sm font-semibold text-slate-900 mt-1">
                Role-Based Access Control
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Protected by JSON Web Tokens and salted bcrypt hashing
              </div>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-slate-900">
                Registered Users
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {isLoading ? '...' : `${users.length} total`}
              </span>
            </div>

            <button
              type="button"
              onClick={() => fetchUsers(true)}
              disabled={isLoading || isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              title="Refresh users list"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              <span>Refresh</span>
            </button>
          </div>

          {/* User Table */}
          <UserTable
            users={users}
            isLoading={isLoading}
            error={error}
            onRetry={() => fetchUsers(false)}
          />
        </div>
      </main>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleUserCreated}
      />
    </div>
  );
}
