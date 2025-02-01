'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { productService } from '@/services/productService';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: ''
    });

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        try {
            const data = await productService.getAllProducts();
            setProducts(data);
        } catch (err) {
            setError('Erro ao carregar produtos');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const newProduct = await productService.createProduct({
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                stock: Number(formData.stock)
            });
            setProducts([...products, newProduct]);
            setFormData({ name: '', description: '', price: '', stock: '' });
        } catch (err) {
            setError('Erro ao criar produto');
        }
    }

    async function handleDelete(id: string) {
        try {
            await productService.deleteProduct(id);
            setProducts(products.filter(product => product.id !== id));
        } catch (err) {
            setError('Erro ao deletar produto');
        }
    }

    if (isLoading) return <div>Carregando...</div>;
    if (error) return <div>Erro: {error}</div>;

    return (
        <div className="p-6 text-gray-600">
            <h1 className="text-2xl font-bold mb-6">Produtos</h1>

            {/* Formulário de cadastro */}
            <form onSubmit={handleSubmit} className="mb-8 space-y-4">
                <div>
                    <label className="block mb-1">Nome:</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="border p-2 w-full rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1">Descrição:</label>
                    <textarea
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="border p-2 w-full rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1">Preço:</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                        className="border p-2 w-full rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1">Estoque:</label>
                    <input
                        type="number"
                        value={formData.stock}
                        onChange={e => setFormData({...formData, stock: e.target.value})}
                        className="border p-2 w-full rounded"
                        required
                    />
                </div>
                <button 
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Adicionar Produto
                </button>
            </form>

            {/* Lista de produtos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(product => (
                    <div key={product.id} className="border p-4 rounded">
                        <h3 className="font-bold">{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Preço: R$ {product.price.toFixed(2)}</p>
                        <p>Estoque: {product.stock}</p>
                        <button
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded mt-2 hover:bg-red-600"
                        >
                            Deletar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
} 