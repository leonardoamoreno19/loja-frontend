import { Order } from '@/types/order';

class OrderService {
    private baseUrl = 'https://localhost:3010/api/order';

    async getAllOrders(): Promise<Order[]> {
        try {
            const response = await fetch(this.baseUrl);
            console.log('Orders API Status:', response.status);
            const text = await response.text();
            console.log('Orders API Response:', text);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
            }

            try {
                const data = JSON.parse(text);
                if (!Array.isArray(data)) {
                    throw new Error('Invalid response format: expected an array');
                }
                return data;
            } catch (e) {
                const error = e as Error;
                throw new Error(`Failed to parse orders response: ${error.message}`);
            }
        } catch (error) {
            console.error('Orders API Error:', error);
            throw error;
        }
    }

    async getOrder(id: string): Promise<Order> {
        const response = await fetch(`${this.baseUrl}/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch order');
        }
        return response.json();
    }

    async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        });
        
        if (!response.ok) {
            throw new Error('Failed to create order');
        }
        return response.json();
    }

    async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
        const response = await fetch(`${this.baseUrl}/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });
        
        if (!response.ok) {
            throw new Error('Failed to update order status');
        }
        return response.json();
    }

    async deleteOrder(id: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete order');
        }
    }
}

export const orderService = new OrderService();
