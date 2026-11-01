'use client';

import React, { useState, useEffect } from 'react';
import TelaCozinhaKDS from '../../src/sistema_controle/TelaCozinhaKDS';
import ViewSwitcherBar from '../../src/sistema_controle/ViewSwitcherBar';
import PwaInstallPrompt from '../../src/components/PwaInstallPrompt';
import { CentralStore } from '../../src/sistema_controle/store';
import { useRouter } from 'next/navigation';

export default function CozinhaPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    setAdminUser(CentralStore.getCurrentUser() || CentralStore.getLoggedAdmin());
  }, []);

  const handleViewChange = (view) => {
    if (view === 'client') {
      router.push('/');
    } else if (view === 'admin') {
      router.push('/admin');
    }
  };

  const handleLogout = () => {
    CentralStore.logoutAdmin();
    router.push('/');
  };

  return (
    <>
      <TelaCozinhaKDS onNavigateBack={() => router.push('/admin')} />
      <ViewSwitcherBar 
        activeView="kitchen" 
        onViewChange={handleViewChange} 
        isAdmin={true}
        adminUser={adminUser}
        onLogout={handleLogout}
      />
      <PwaInstallPrompt />
    </>
  );
}
