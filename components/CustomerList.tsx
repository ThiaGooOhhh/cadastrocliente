import React from 'react';
import { Customer } from '../types';
import CustomerItem from './CustomerItem';

interface CustomerListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ customers, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      {customers.map(customer => (
        <CustomerItem 
          key={customer.id} 
          customer={customer} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

export default CustomerList;
