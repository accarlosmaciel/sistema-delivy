import '../src/index.css';

export const metadata = {
  title: 'Delivy Gourmet & Crafts',
  description: 'Peça os melhores lanches artesanais, pratos executivos e bebidas especiais. Entrega rápida e segura.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
