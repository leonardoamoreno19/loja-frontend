import { Product } from '@/types/product';

class ProductService {
    private baseUrl = 'https://localhost:3010/api/product';

    async getAllProducts(): Promise<Product[]> {
        const response = await fetch(this.baseUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        return response.json();
    }

    async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        });
        
        if (!response.ok) {
            throw new Error('Failed to create product');
        }
        return response.json();
    }

    async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        });
        
        if (!response.ok) {
            throw new Error('Failed to update product');
        }
        return response.json();
    }

    async deleteProduct(id: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete product');
        }
    }
}

export const productService = new ProductService(); 