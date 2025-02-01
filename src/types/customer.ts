export interface CustomerDto {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface CreateCustomerCommand {
  name: string;
  email: string;
  phone: string;
}

export type UpdateCustomerCommand = CreateCustomerCommand; 