@@ .. @@
 import React, { useState } from 'react';
-import { User, Home, Phone, MapPin, Lock, Key, Shield, Save, X } from 'lucide-react';
+import { User, Home, Phone, MapPin, Lock, Key, Shield, Save, X, ShoppingCart } from 'lucide-react';
 import { ViewMode } from '../types';
+import { OrderItem } from '../types';
 // import { GearAnimation } from './ui/GearAnimation';
 import { useLanguage } from '../hooks/useLanguage';
 import { passwordService, PasswordChangeRequest } from '../services/passwordService';
+import { CartButton } from './ui/CartButton';
 import logo from '../images /logo.png';
 
 interface HeaderProps {
   currentView: ViewMode;
   onViewChange: (view: ViewMode) => void;
+  cartItems?: OrderItem[];
+  onCartClick?: () => void;
 }
 
-export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
+export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, cartItems = [], onCartClick }) => {
@@ .. @@
           {/* Navigation */}
           <nav className="flex items-center space-x-1 sm:space-x-2">
             {currentView === 'customer' ? (
               <>
+                {onCartClick && (
+                  <CartButton items={cartItems} onClick={onCartClick} />
+                )}
+                
                 <a href="#menu" className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm text-gray-300 hover:text-white hover:bg-gray-700">
                   <User size={14} />
                   <span className="hidden sm:inline">Menu</span>