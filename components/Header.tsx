import React from 'react';
import { UsersIcon, PlusIcon } from './Icons';

interface HeaderProps {
    onAddCustomer: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddCustomer }) => {
  return (
    <header className="bg-white dark:bg-slate-800/70 backdrop-blur-sm shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-500 text-white p-2 rounded-lg">
               <UsersIcon className="h-6 w-6" />
            </div>
            <h1 className="ml-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
              Customer Registry
            </h1>
          </div>
          <div className="flex items-center">
            <button
              onClick={onAddCustomer}
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2 -ml-1" />
              Add Customer
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
