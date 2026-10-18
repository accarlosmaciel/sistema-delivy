'use client';

import React from 'react';
import TelaCozinhaKDS from '../../src/sistema_controle/TelaCozinhaKDS';
import ViewSwitcherBar from '../../src/sistema_controle/ViewSwitcherBar';
import { useRouter } from 'next/navigation';

export default function CozinhaPage() {
  const router = useRouter();

  const handleViewChange = (view) => {
    if (view === 'client') {
      router.push('/');
    } else if (view === 'admin') {
      router.push('/admin');
    }
  };

  return (
    <>
      <TelaCozinhaKDS onNavigateBack={() => router.push('/admin')} />
      <ViewSwitcherBar activeView="kitchen" onViewChange={handleViewChange} />
    </>
  );
}
