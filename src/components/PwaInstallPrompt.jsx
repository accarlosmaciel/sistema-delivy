'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Share2, PlusSquare, Sparkles, Smartphone } from 'lucide-react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // 1. Verificação rigorosa: Se estiver rodando no PC/Desktop, aborta imediatamente
    if (typeof window === 'undefined') return;

    const isMobileDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isNarrowScreen = window.innerWidth <= 768;
      const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      
      // No PC (tela larga e sem UA mobile), nunca chama
      if (!isMobileUA && !isNarrowScreen) {
        return false;
      }
      return isMobileUA || (isNarrowScreen && hasTouch);
    };

    if (!isMobileDevice()) {
      return; // PC detectado -> não executa
    }

    // 2. Se já estiver instalado em modo standalone (app aberto), não exibe
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true;
    if (isStandalone) {
      return;
    }

    // 3. Controle anti-spam: se já instalou ou dispensou recentemente (7 dias), não chama
    try {
      const alreadyInstalled = localStorage.getItem('delivy_pwa_installed');
      if (alreadyInstalled === 'true') {
        return;
      }

      const dismissedUntil = localStorage.getItem('delivy_pwa_dismissed_until');
      if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) {
        return; // Em período de descanso
      }
    } catch (e) {}

    // 4. Detecção de iOS Safari
    const checkIsIos = () => {
      const ua = navigator.userAgent;
      return /iPhone|iPad|iPod/i.test(ua) && !window.MSStream;
    };

    const isIosDevice = checkIsIos();
    setIsIos(isIosDevice);

    // 5. Escuta o evento nativo 'beforeinstallprompt' (Android / Chrome / Samsung Internet)
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Aguarda 2.5 segundos para não atrapalhar o primeiro contato com a tela
      setTimeout(() => {
        setShowPrompt(true);
      }, 2500);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // No caso do iOS que não dispara 'beforeinstallprompt', exibe dica amigável após delay
    if (isIosDevice) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3500);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // Dispensar prompt e salvar cooldown de 7 dias
  const handleDismiss = () => {
    setShowPrompt(false);
    try {
      const cooldownMs = 7 * 24 * 60 * 60 * 1000; // 7 dias
      localStorage.setItem('delivy_pwa_dismissed_until', String(Date.now() + cooldownMs));
    } catch (e) {}
  };

  // Instalar aplicativo via prompt nativo
  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      handleDismiss();
      return;
    }

    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        localStorage.setItem('delivy_pwa_installed', 'true');
      } else {
        handleDismiss();
      }
    } catch (err) {
      console.error('Erro ao instalar PWA:', err);
      handleDismiss();
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <aside 
      className="pwa-install-banner" 
      role="dialog" 
      aria-label="Instalar Aplicativo Delivy"
    >
      <div className="pwa-banner-card">
        {/* Botão fechar */}
        <button 
          className="pwa-close-btn" 
          onClick={handleDismiss} 
          title="Fechar aviso"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        <div className="pwa-banner-content">
          {/* Ícone do App */}
          <div className="pwa-app-icon-wrap">
            <img 
              src="/icons/icon-192.svg" 
              alt="Delivy" 
              className="pwa-app-icon"
            />
          </div>

          {/* Texto descritivo */}
          <div className="pwa-banner-text">
            <div className="pwa-badge">
              <Sparkles size={12} color="#ea580c" />
              <span>Instalar Aplicativo</span>
            </div>
            <h3 className="pwa-title">Baixe o Delivy no seu Celular</h3>
            <p className="pwa-desc">
              {isIos 
                ? 'Abra com 1 toque direto da tela inicial, com pedidos e acompanhamento em tempo real.' 
                : 'Acesso rápido e leve, sem ocupar espaço da memória e sem precisar digitar o endereço.'}
            </p>
          </div>
        </div>

        {/* Instruções para iOS Safari ou Botão de Instalação para Android */}
        {isIos ? (
          <div className="pwa-ios-instructions">
            <div className="pwa-ios-step">
              <span className="pwa-ios-num">1</span>
              <span>Toque em Compartilhar</span>
              <Share2 size={16} color="#38bdf8" />
            </div>
            <div className="pwa-ios-step">
              <span className="pwa-ios-num">2</span>
              <span>Adicionar à Tela de Início</span>
              <PlusSquare size={16} color="#ea580c" />
            </div>
            <button 
              className="pwa-btn-dismiss" 
              onClick={handleDismiss}
              style={{ marginTop: '6px' }}
            >
              Entendi, agora não
            </button>
          </div>
        ) : (
          <div className="pwa-banner-actions">
            <button 
              type="button" 
              className="pwa-btn-install" 
              onClick={handleInstallClick}
            >
              <Download size={17} />
              <span>Instalar App Agora</span>
            </button>
            <button 
              type="button" 
              className="pwa-btn-dismiss" 
              onClick={handleDismiss}
            >
              Agora não
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
