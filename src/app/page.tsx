'use client';

import Link from 'next/link';

interface Module {
  name: string;
  path: string;
  description: string;
  icon: string;
}

const modules: Module[] = [
  {
    name: 'Clientes',
    path: '/customers',
    description: 'Gerenciamento de clientes',
    icon: '👥'
  },
  {
    name: 'Pedidos',
    path: '/orders',
    description: 'Controle de pedidos',
    icon: '📦'
  },
  {
    name: 'Produtos',
    path: '/products',
    description: 'Cadastro de produtos',
    icon: '🏷️'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema de Pedidos
          </h1>
          <p className="text-gray-600">
            Selecione um módulo para começar
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Link
              key={module.path}
              href={module.path}
              className="block group"
            >
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="text-4xl mb-4">
                  {module.icon}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                  {module.name}
                </h2>
                <p className="text-gray-600">
                  {module.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
