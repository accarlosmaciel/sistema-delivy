'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  LogIn, 
  AlertCircle, 
  X,
  ChefHat,
  LayoutDashboard,
  Sparkles
} from 'lucide-react';
import { CentralStore } from './store';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setError('');
      setShowPassword(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password.trim()) {
      setError('Preencha todos os campos.');
      triggerShake();
      return;
    }

    setIsLoading(true);

    // Simular pequeno delay de autenticação
    await new Promise(r => setTimeout(r, 800));

    const result = CentralStore.loginAdmin(email.trim(), password);

    if (result.success) {
      setIsLoading(false);
      onLoginSuccess(result.user);
    } else {
      setIsLoading(false);
      setError(result.error);
      triggerShake();
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleQuickFill = (userEmail) => {
    setEmail(userEmail);
    setPassword(userEmail === 'cozinha@delivygourmet.com' ? 'cozinha123' : 'admin123');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="admin-login-overlay" onClick={onClose}>
      <div 
        className={`admin-login-card ${shake ? 'shake' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className="admin-login-close" onClick={onClose} type="button">
          <X size={20} />
        </button>

        {/* Header */}
        <div className="admin-login-header">
          <div className="admin-login-logo">
            <ShieldCheck size={36} />
          </div>
          <h2 className="admin-login-title">Acesso Restrito</h2>
          <p className="admin-login-subtitle">
            Área exclusiva para administradores e equipe da cozinha
          </p>
        </div>

        {/* Form */}
        <form className="admin-login-form" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="admin-login-field">
            <label className="admin-login-label">
              <Mail size={14} />
              <span>E-mail</span>
            </label>
            <div className="admin-login-input-wrap">
              <input
                type="email"
                className="admin-login-input"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="admin-login-field">
            <label className="admin-login-label">
              <Lock size={14} />
              <span>Senha</span>
            </label>
            <div className="admin-login-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                className="admin-login-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                autoComplete="current-password"
              />
              <button 
                type="button" 
                className="admin-login-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="admin-login-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className={`admin-login-submit ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="admin-login-spinner"></span>
            ) : (
              <>
                <LogIn size={18} />
                <span>Entrar no Painel</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Access (demo only) */}
        <div className="admin-login-quick">
          <div className="admin-login-quick-label">
            <Sparkles size={12} />
            <span>Acesso rápido (Demo)</span>
          </div>
          <div className="admin-login-quick-btns">
            <button 
              type="button"
              className="admin-login-quick-btn"
              onClick={() => handleQuickFill('superadmin@delivy.com.br')}
            >
              <ShieldCheck size={14} />
              <span>Superadmin</span>
            </button>
            <button 
              type="button"
              className="admin-login-quick-btn"
              onClick={() => handleQuickFill('roberto@delivygourmet.com')}
            >
              <LayoutDashboard size={14} />
              <span>Dono da Loja</span>
            </button>
            <button 
              type="button"
              className="admin-login-quick-btn"
              onClick={() => handleQuickFill('cozinha@delivygourmet.com')}
            >
              <ChefHat size={14} />
              <span>Cozinha</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
