'use client';

import React, { useState, useEffect } from 'react';
import SistemaControleApp from '../../src/sistema_controle/SistemaControleApp';
import ViewSwitcherBar from '../../src/sistema_controle/ViewSwitcherBar';
import PwaInstallPrompt from '../../src/components/PwaInstallPrompt';
import { CentralStore } from '../../src/sistema_controle/store';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    setAdminUser(CentralStore.getCurrentUser() || CentralStore.getLoggedAdmin());
  }, []);

  const handleViewChange = (view) => {
    if (view === 'client') {
      router.push('/');
    } else if (view === 'kitchen') {
      router.push('/cozinha');
    }
  };

  const handleLogout = () => {
    CentralStore.logoutAdmin();
    router.push('/');
  };

  return (
    <>
      <SistemaControleApp onNavigateToClient={() => router.push('/')} />
      <ViewSwitcherBar 
        activeView="admin" 
        onViewChange={handleViewChange} 
        isAdmin={true}
        adminUser={adminUser}
        onLogout={handleLogout}
      />
      <PwaInstallPrompt />
    </>
  );
}
