'use client';

import React from 'react';
import SistemaControleApp from '../../src/sistema_controle/SistemaControleApp';
import PwaInstallPrompt from '../../src/components/PwaInstallPrompt';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  return (
    <>
      <SistemaControleApp onNavigateToClient={() => router.push('/')} />
      <PwaInstallPrompt />
    </>
  );
}
