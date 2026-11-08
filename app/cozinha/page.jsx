'use client';

import React from 'react';
import TelaCozinhaKDS from '../../src/sistema_controle/TelaCozinhaKDS';
import PwaInstallPrompt from '../../src/components/PwaInstallPrompt';
import { useRouter } from 'next/navigation';

export default function CozinhaPage() {
  const router = useRouter();

  return (
    <>
      <TelaCozinhaKDS onNavigateBack={() => router.push('/admin')} />
      <PwaInstallPrompt />
    </>
  );
}
