import React, { useState } from 'react';
import { User, Home, Phone, MapPin, Lock, Key, Shield, Save, X } from 'lucide-react';
import { ViewMode } from '../types';
// import { GearAnimation } from './ui/GearAnimation';
import { useLanguage } from '../hooks/useLanguage';
import { passwordService, PasswordChangeRequest } from '../services/passwordService';
import logo from '../images /logo.png';
import { CartButton } from './ui/CartButton';
import { OrderItem } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  cartItems?: OrderItem[];
  onCartClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, cartItems = [], onCartClick }) => {
  const { isRTL } = useLanguage();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordType, setPasswordType] = useState<'admin' | 'advanced_admin'>('admin');
  const [globalKey, setGlobalKey] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRelock = () => {
    sessionStorage.removeItem('advanced_admin_authed');
    window.location.reload();
  };

  const handlePasswordManagement = () => {
    setShowPasswordModal(true);
    setShowChangePassword(false);
    setError('');
    setSuccess('');
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const request: PasswordChangeRequest = {
        globalKey,
        newPassword,
        passwordType
      };

      const result = await passwordService.changePassword(request);
      
      if (result.success) {
        setSuccess(result.message || `Password changed successfully for ${passwordType === 'admin' ? 'Admin' : 'Advanced Admin'}`);
        setGlobalKey('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setShowChangePassword(false);
          setSuccess('');
        }, 5000); // Show message longer since it includes restart instructions
      } else {
        setError(result.error || 'Failed to change password');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo Section */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2 sm:space-x-3' : 'space-x-2 sm:space-x-3'}`}>
            <img src={logo} alt="Logo" className="h-10 w-10 sm:h-12 sm:w-12 rounded-md object-cover border border-orange-500" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-orange-400">
              Mechanical Burger
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            {currentView === 'customer' ? (
              <>
                {onCartClick && (
                  <CartButton items={cartItems} onClick={onCartClick} />
                )}
                <a href="#menu" className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm text-gray-300 hover:text-white hover:bg-gray-700">
                  <User size={14} />
                  <span className="hidden sm:inline">Menu</span>
                </a>
                
                <a href="#contact" className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm text-gray-300 hover:text-white hover:bg-gray-700">
                  <Phone size={14} />
                  <span className="hidden sm:inline">Phone</span>
                </a>
                
                <a href="#location" className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm text-gray-300 hover:text-white hover:bg-gray-700">
                  <MapPin size={14} />
                  <span className="hidden sm:inline">Location</span>
                </a>
              </>
            ) : (
              <>
                <button
                  onClick={() => onViewChange('customer')}
                  className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  <Home size={14} />
                  <span className="hidden sm:inline">Customer View</span>
                </button>
                
                <button
                  onClick={handlePasswordManagement}
                  className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm text-blue-300 hover:text-blue-200 hover:bg-blue-600/20"
                  title="Password Management"
                >
                  <Key size={14} />
                  <span className="hidden sm:inline">Passwords</span>
                </button>
                
                <button
                  onClick={handleRelock}
                  className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm text-yellow-300 hover:text-yellow-200 hover:bg-yellow-600/20"
                  title="Relock Advanced Features"
                >
                  <Lock size={14} />
                  <span className="hidden sm:inline">Relock</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Password Management Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-600 rounded-xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Shield size={64} className="text-blue-400" />
                  <Key size={24} className="absolute -top-2 -right-2 text-yellow-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">PASSWORD MANAGEMENT</h2>
              <p className="text-gray-300">
                Manage admin passwords and access controls
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Current Passwords</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Admin Password:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400">••••••••</span>
                      {passwordService.getPasswordStatus().adminChanged && (
                        <span className="text-green-400 text-xs">✓ Changed</span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Advanced Admin:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400">••••••••</span>
                      {passwordService.getPasswordStatus().advancedChanged && (
                        <span className="text-green-400 text-xs">✓ Changed</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Global key info removed for security */}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowChangePassword(true)}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Key size={16} />
                Change Password
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-600 rounded-xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Shield size={64} className="text-green-400" />
                  <Key size={24} className="absolute -top-2 -right-2 text-blue-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">CHANGE PASSWORD</h2>
              <p className="text-gray-300">
                Enter global key and new password
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  PASSWORD TYPE:
                </label>
                <select
                  value={passwordType}
                  onChange={(e) => setPasswordType(e.target.value as 'admin' | 'advanced_admin')}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  <option value="admin">Admin Password</option>
                  <option value="advanced_admin">Advanced Admin Password</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  GLOBAL KEY:
                </label>
                <input
                  type="password"
                  value={globalKey}
                  onChange={(e) => setGlobalKey(e.target.value)}
                  placeholder="Enter global key"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  NEW PASSWORD:
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  CONFIRM PASSWORD:
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm flex items-center gap-2">
                  <span>⚠️</span>
                  {error}
                </div>
              )}

              {success && (
                <div className="text-green-400 text-sm flex items-center gap-2">
                  <span>✅</span>
                  {success}
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleChangePassword}
                disabled={loading || !globalKey || !newPassword || !confirmPassword}
                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Save size={16} />
                {loading ? 'Changing...' : 'Change Password'}
              </button>
              <button
                onClick={() => {
                  setShowChangePassword(false);
                  setError('');
                  setSuccess('');
                  setGlobalKey('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};