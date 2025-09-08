import React, { useState, useEffect } from 'react';

interface AdminAuthGateProps {
  onAuthenticated: () => void;
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({ onAuthenticated }) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const alreadyAuthed = sessionStorage.getItem('admin_authed') === 'true';
    if (alreadyAuthed) onAuthenticated();
  }, [onAuthenticated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = import.meta.env.VITE_ADMIN_PASSWORD || '';
    if (expected && passwordInput === expected) {
      sessionStorage.setItem('admin_authed', 'true');
      setError(null);
      onAuthenticated();
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Admin Access</h2>
        <p className="text-gray-300 mb-6 text-center">Enter the admin password to continue.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600"
          />
          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}
          <button
            type="submit"
            className="w-full px-4 py-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold transition-colors"
          >
            Unlock Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAuthGate;


