import React from 'react';
import { Customer } from '../types';
import { PencilIcon, TrashIcon, EnvelopeIcon, PhoneIcon, CalendarIcon } from './Icons';

interface CustomerItemProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

const CustomerItem: React.FC<CustomerItemProps> = ({ customer, onEdit, onDelete }) => {
  const formattedDate = new Date(customer.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{customer.name}</h3>
            <div className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <p className="flex items-center">
                <EnvelopeIcon className="h-4 w-4 mr-2 text-slate-400" />
                <span>{customer.email}</span>
              </p>
              <p className="flex items-center">
                <PhoneIcon className="h-4 w-4 mr-2 text-slate-400" />
                <span>{customer.phone}</span>
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0 flex items-center space-x-3">
            <button
              onClick={() => onEdit(customer)}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-700 dark:hover:text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={`Edit ${customer.name}`}
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(customer.id)}
              className="p-2 rounded-full text-slate-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label={`Delete ${customer.name}`}
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
           <p className="flex items-center text-xs text-slate-500 dark:text-slate-400">
             <CalendarIcon className="h-4 w-4 mr-2" />
             Member since: {formattedDate}
           </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerItem;
