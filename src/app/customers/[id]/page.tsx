'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CustomerDto, CreateCustomerCommand } from '@/types/customer';
import { customerService } from '@/services/customerService';

export default function CustomerForm() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isEditing = id !== 'new';
  
  const [formData, setFormData] = useState<CreateCustomerCommand>({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (isEditing) {
      loadCustomer();
    }
  }, [isEditing]);

  const loadCustomer = async () => {
    try {
      const customer = await customerService.getCustomer(id);
      setFormData(customer);
    } catch (error) {
      console.error('Error loading customer:', error);
    }

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await customerService.updateCustomer(id, formData);
      } else {
        await customerService.createCustomer(formData);

      }

      router.push('/customers');
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto p-4 text-gray-600">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label className="block mb-2">Nome:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Telefone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Salvar
          </button>
          <button
            type="button"
            onClick={() => router.push('/customers')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
} 