import { Customer } from '../types';

// In-memory database to simulate a backend
let customers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    createdAt: new Date('2023-01-15T10:30:00Z').toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '098-765-4321',
    createdAt: new Date('2023-02-20T14:00:00Z').toISOString(),
  },
  {
    id: '3',
    name: 'Peter Jones',
    email: 'peter.jones@example.com',
    phone: '555-555-5555',
    createdAt: new Date('2023-03-10T09:00:00Z').toISOString(),
  },
];

const SIMULATED_DELAY = 500;

// Simulate generating a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export const getCustomers = (): Promise<Customer[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...customers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }, SIMULATED_DELAY);
  });
};

export const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!customerData.name || !customerData.email) {
        return reject(new Error('Name and email are required.'));
      }
      const newCustomer: Customer = {
        ...customerData,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      customers.push(newCustomer);
      resolve(newCustomer);
    }, SIMULATED_DELAY);
  });
};

export const updateCustomer = (id: string, customerData: Partial<Omit<Customer, 'id' | 'createdAt'>>): Promise<Customer> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = customers.findIndex(c => c.id === id);
      if (index === -1) {
        return reject(new Error('Customer not found.'));
      }
      customers[index] = { ...customers[index], ...customerData };
      resolve(customers[index]);
    }, SIMULATED_DELAY);
  });
};

export const deleteCustomer = (id: string): Promise<void> => {
  console.log(`[customerService.ts] Service called to delete customer with ID: ${id}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = customers.length;
      const index = customers.findIndex(c => c.id === id);
      console.log(`[customerService.ts] Found customer at index: ${index}`);
      
      if (index > -1) {
        customers.splice(index, 1);
        console.log(`[customerService.ts] Customer removed. Array length changed from ${initialLength} to ${customers.length}.`);
        resolve();
      } else {
        console.error(`[customerService.ts] Customer with ID ${id} not found.`);
        reject(new Error('Customer not found.'));
      }
    }, SIMULATED_DELAY);
  });
};