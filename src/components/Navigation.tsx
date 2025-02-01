'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname?.startsWith(path);
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex gap-4">
        <Link href="/" className="hover:text-gray-300">Home</Link>
        <Link href="/customers" className="hover:text-gray-300">Clientes</Link>
        <Link href="/products" className="hover:text-gray-300">Produtos</Link>
        <Link href="/orders" className="hover:text-gray-300">Pedidos</Link>
      </div>
    </nav>
  );
} 