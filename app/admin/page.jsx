'use client';

import React from 'react';
import SistemaControleApp from '../../src/sistema_controle/SistemaControleApp';
import ViewSwitcherBar from '../../src/sistema_controle/ViewSwitcherBar';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  const handleViewChange = (view) => {
    if (view === 'client') {
      router.push('/');
    } else if (view === 'kitchen') {
      router.push('/cozinha');
    }
  };

  return (
    <>
      <SistemaControleApp onNavigateToClient={() => router.push('/')} />
      <ViewSwitcherBar activeView="admin" onViewChange={handleViewChange} />
    </>
  );
}
