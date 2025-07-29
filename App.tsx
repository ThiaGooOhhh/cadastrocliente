import React, { useState, useEffect, useCallback } from 'react';
import { Customer } from './types';
import { getCustomers, addCustomer, updateCustomer, deleteCustomer as apiDeleteCustomer } from './services/customerService';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import Modal from './components/Modal';
import Header from './components/Header';
import ConfirmationModal from './components/ConfirmationModal';
import { PlusIcon, ExclamationTriangleIcon } from './components/Icons';

function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // State for the confirmation modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [customerToDeleteId, setCustomerToDeleteId] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      setError('Failed to fetch customers. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSaveCustomer = useCallback(async (customerData: Omit<Customer, 'id'> | Customer) => {
    try {
      if ('id' in customerData) {
        await updateCustomer(customerData.id, customerData);
      } else {
        await addCustomer(customerData);
      }
      handleCloseModal();
      await fetchCustomers(); // Refetch data for consistency
    } catch (err) {
      setError('Failed to save customer.');
      console.error(err);
    }
  }, [fetchCustomers]);

  // --- Deletion Logic ---

  // 1. Open the confirmation modal when delete is requested
  const handleRequestDelete = (id: string) => {
    console.log(`[App.tsx] User requested to delete customer with ID: ${id}`);
    setCustomerToDeleteId(id);
    setIsConfirmModalOpen(true);
  };

  // 2. Close the confirmation modal
  const handleCloseConfirmModal = () => {
    console.log('[App.tsx] Deletion cancelled or completed. Closing confirmation modal.');
    setIsConfirmModalOpen(false);
    setCustomerToDeleteId(null);
  };
  
  // 3. Handle the actual deletion after user confirmation
  const handleConfirmDelete = useCallback(async () => {
    if (!customerToDeleteId) {
      console.error('[App.tsx] handleConfirmDelete called without a customer ID.');
      return;
    }
    console.log(`[App.tsx] User confirmed deletion for customer ID: ${customerToDeleteId}`);
    try {
        await apiDeleteCustomer(customerToDeleteId);
        console.log('[App.tsx] Deletion successful, refetching customers...');
        await fetchCustomers();
    } catch (err) {
        setError('Failed to delete customer.');
        console.error('[App.tsx] Error during customer deletion:', err);
    } finally {
        handleCloseConfirmModal();
    }
  }, [customerToDeleteId, fetchCustomers]);
  
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header onAddCustomer={handleOpenAddModal} />
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {isLoading && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-lg">Loading Customers...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md mb-6 flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 mr-3" />
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && customers.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">No Customers Found</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Get started by adding a new customer.</p>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add First Customer
            </button>
          </div>
        )}

        {!isLoading && !error && customers.length > 0 && (
          <CustomerList 
            customers={customers} 
            onEdit={handleOpenEditModal} 
            onDelete={handleRequestDelete}
          />
        )}
      </main>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
      >
        <CustomerForm 
          onSubmit={handleSaveCustomer} 
          onCancel={handleCloseModal}
          customerToEdit={editingCustomer}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
      >
        <p>Are you sure you want to delete this customer? This action cannot be undone.</p>
      </ConfirmationModal>
    </div>
  );
}

export default App;