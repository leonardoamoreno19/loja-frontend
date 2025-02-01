'use client';

import { useEffect, useState } from 'react';
import { Order } from '@/types/order';
import { Product } from '@/types/product';
import { orderService } from '@/services/orderService';
import { productService } from '@/services/productService';
import { customerService } from '@/services/customerService';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [orderItems, setOrderItems] = useState<Array<{
        productId: string;
        quantity: number;
    }>>([{ productId: '', quantity: 1 }]);

    useEffect(() => {
        loadInitialData();   
    }, []);

    async function loadInitialData() {
        try {
            setIsLoading(true);
            setError(null);
            
            let ordersData, productsData, customersData;
            
            try {
                [ordersData, productsData, customersData] = await Promise.all([
                    orderService.getAllOrders(),
                    productService.getAllProducts(),
                    customerService.getAllCustomers()
                ]);
            } catch (error) {
                console.error('Fetch error:', error);
                if (error instanceof Error) {
                    throw new Error(`Erro ao carregar dados: ${error.message}`);
                }
                throw new Error('Erro ao carregar dados');
            }

            if (!Array.isArray(ordersData)) {
                console.error('Invalid orders data:', ordersData);
                throw new Error('Formato de dados inválido para pedidos');
            }

            console.log('Orders loaded:', ordersData);
            setOrders(ordersData);
            setProducts(Array.isArray(productsData) ? productsData : []);
            setCustomers(Array.isArray(customersData) ? customersData : []);
        } catch (err) {
            console.error('Error loading data:', err);
            setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
        } finally {
            setIsLoading(false);
        }
    }

    const addOrderItem = () => {
        setOrderItems([...orderItems, { productId: '', quantity: 1 }]);
    };

    const removeOrderItem = (index: number) => {
        setOrderItems(orderItems.filter((_, i) => i !== index));
    };

    const updateOrderItem = (index: number, field: 'productId' | 'quantity', value: string | number) => {
        const newItems = [...orderItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setOrderItems(newItems);
    };

    const calculateTotal = () => {
        return orderItems.reduce((total, item) => {
            const product = products.find(p => p.id === item.productId);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCustomer || orderItems.some(item => !item.productId)) {
            setError('Por favor, preencha todos os campos');
            return;
        }

        const customer = customers.find(c => c.id === selectedCustomer);
        
        try {
            const orderData = {
                customerId: selectedCustomer,
                customerName: customer.name,
                items: orderItems.map(item => {
                    const product = products.find(p => p.id === item.productId);
                    if (!product) {
                        throw new Error('Produto não encontrado');
                    }
                    return {
                        id: Date.now().toString(),
                        productId: item.productId,
                        productName: product.name,
                        quantity: item.quantity,
                        price: product.price,
                        subtotal: product.price * item.quantity
                    };
                }),
                totalAmount: calculateTotal(),
                status: 'pending' as const
            };

            const newOrder = await orderService.createOrder(orderData);
            setOrders([...orders, newOrder]);
            
            // Limpar formulário
            setSelectedCustomer('');
            setOrderItems([{ productId: '', quantity: 1 }]);
        } catch (err) {
            setError('Erro ao criar pedido');
        }
    };

    if (isLoading) return <div className="p-6">Carregando...</div>;
    if (error) return <div className="p-6 text-red-500">Erro: {error}</div>;

    return (
        <div className="p-6 text-gray-600">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Pedidos</h1>
                <button 
                    onClick={() => {
                        setIsLoading(true);
                        setError(null);
                        loadInitialData();
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Atualizar
                </button>
            </div>

            {/* Formulário de novo pedido */}
            <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-white p-6 rounded-lg shadow">
                <div>
                    <label className="block mb-1">Cliente:</label>
                    <select
                        value={selectedCustomer}
                        onChange={(e) => setSelectedCustomer(e.target.value)}
                        className="border p-2 w-full rounded"
                        required
                    >
                        <option value="">Selecione um cliente</option>
                        {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>
                                {customer.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-4">
                    <label className="block mb-1">Itens do Pedido:</label>
                    {orderItems.map((item, index) => (
                        <div key={index} className="flex gap-4 items-center">
                            <select
                                value={item.productId}
                                onChange={(e) => updateOrderItem(index, 'productId', e.target.value)}
                                className="border p-2 flex-1 rounded"
                                required
                            >
                                <option value="">Selecione um produto</option>
                                {products.map(product => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} - R$ {product.price?.toFixed(2) ?? '0.00'}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value))}
                                className="border p-2 w-24 rounded"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => removeOrderItem(index)}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                                Remover
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={addOrderItem}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Adicionar Item
                </button>

                <div className="text-right text-xl font-bold">
                    Total: R$ {calculateTotal().toFixed(2)}
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                >
                    Criar Pedido
                </button>
            </form>

            {/* Lista de pedidos */}
            <div className="space-y-4">
                {orders.length === 0 && (
                    <div className="text-center p-4 bg-gray-100 rounded">
                        Nenhum pedido encontrado
                    </div>
                )}
                {orders.map(order => (
                    <div key={order.id} className="border p-4 rounded bg-white shadow">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="font-bold">Pedido #{order.id}</h3>
                                <p>Cliente: {order.customerName}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">Total: R$ {order.totalAmount?.toFixed(2) ?? '0.00'}</p>
                                <p className={`
                                    ${order.status === 'completed' ? 'text-green-500' : ''}
                                    ${order.status === 'cancelled' ? 'text-red-500' : ''}
                                    ${order.status === 'pending' ? 'text-yellow-500' : ''}
                                `}>
                                    Status: {order.status}
                                </p>
                            </div>
                        </div>
                        
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left">Produto</th>
                                    <th className="text-right">Qtd</th>
                                    <th className="text-right">Preço</th>
                                    <th className="text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.productName}</td>
                                        <td className="text-right">{item.quantity}</td>
                                        <td className="text-right">R$ {item.price?.toFixed(2) ?? '0.00'}</td>
                                        <td className="text-right">R$ {item.subtotal?.toFixed(2) ?? '0.00'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
}
