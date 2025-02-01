import { CustomerDto } from '@/types/customer';

class CustomerService {
    private baseUrl = 'https://localhost:3010/api/customer';

    async getAllCustomers(): Promise<CustomerDto[]> {
        const response = await fetch(this.baseUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch customers');
        }
        return response.json();
    }

    async getCustomer(id: string): Promise<CustomerDto> {
        const response = await fetch(`${this.baseUrl}/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch customer');
        }
        return response.json();
    }

    async createCustomer(customer: Omit<CustomerDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomerDto> {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(customer),
        });
        
        if (!response.ok) {
            throw new Error('Failed to create customer');
        }
        return response.json();
    }

    async updateCustomer(id: string, customer: Partial<CustomerDto>): Promise<CustomerDto> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(customer),
        });
        
        if (!response.ok) {
            throw new Error('Failed to update customer');
        }
        return response.json();
    }

    async deleteCustomer(id: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete customer');
        }
    }
}

export const customerService = new CustomerService(); 