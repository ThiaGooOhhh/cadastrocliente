import React, { useState, useEffect } from 'react';
import { Customer } from '../types';

interface CustomerFormProps {
  onSubmit: (customer: Omit<Customer, 'id' | 'createdAt'> | Customer) => void;
  onCancel: () => void;
  customerToEdit?: Customer | null;
}

interface FormState {
    name: string;
    email: string;
    phone: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit, onCancel, customerToEdit }) => {
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (customerToEdit) {
      setFormState({
        name: customerToEdit.name,
        email: customerToEdit.email,
        phone: customerToEdit.phone,
      });
    } else {
      setFormState({ name: '', email: '', phone: '' });
    }
    setErrors({});
  }, [customerToEdit]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formState.name.trim()) {
        newErrors.name = 'Name is required.';
    }
    if (!formState.email.trim()) {
        newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
        newErrors.email = 'Email is invalid.';
    }
    if (!formState.phone.trim()) {
        newErrors.phone = 'Phone number is required.';
    } else if (!/^[0-9\s-()+]*$/.test(formState.phone)) {
        newErrors.phone = 'Phone number is invalid.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      const dataToSubmit = customerToEdit ? { ...customerToEdit, ...formState } : formState;
      await onSubmit(dataToSubmit);
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: keyof FormErrors) => 
    `w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 dark:border-slate-600 ${
        errors[field] 
        ? 'border-red-500 focus:ring-red-500' 
        : 'border-slate-300 focus:ring-indigo-500'
    }`;


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          value={formState.name} 
          onChange={handleChange} 
          className={inputClass('name')}
          placeholder="e.g., John Doe"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          value={formState.email} 
          onChange={handleChange} 
          className={inputClass('email')}
          placeholder="e.g., john.doe@example.com"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
        <input 
          type="tel" 
          id="phone" 
          name="phone" 
          value={formState.phone} 
          onChange={handleChange} 
          className={inputClass('phone')}
          placeholder="e.g., 123-456-7890"
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button 
          type="button" 
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-slate-800 transition-colors"
        >
          {isSubmitting ? 'Saving...' : 'Save Customer'}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;
