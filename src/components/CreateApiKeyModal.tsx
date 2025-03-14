'use client';

import { useState } from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

// FormField component for reusable form inputs
type FormFieldProps = {
  id: string;
  label: string;
  description?: string;
  showHelpIcon?: boolean;
  children: React.ReactNode;
};

const FormField = ({ id, label, description, showHelpIcon = false, children }: FormFieldProps) => (
  <div className="mb-6">
    <div className="flex items-center justify-between mb-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {description && <span className="text-sm text-gray-500">— {description}</span>}
      </label>
      {showHelpIcon && (
        <button
          type="button"
          className="ml-1 text-gray-500 hover:text-gray-700"
          aria-label={`Learn more about ${label}`}
        >
          <QuestionMarkCircleIcon className="h-4 w-4" />
        </button>
      )}
    </div>
    {children}
  </div>
);

// Interface for form data
interface ApiKeyFormData {
  name: string;
  usage_limit: number;
  type: string;
  piiEnabled: boolean;
}

// Props interface
interface CreateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateKey: (data: { name: string; usage_limit: number; type?: string; piiEnabled?: boolean }) => void;
}

export default function CreateApiKeyModal({ isOpen, onClose, onCreateKey }: CreateApiKeyModalProps) {
  // State for form fields
  const [formData, setFormData] = useState<ApiKeyFormData>({
    name: '',
    usage_limit: 1000,
    type: 'Development',
    piiEnabled: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Early return if modal should be closed
  if (!isOpen) return null;

  // Handle form field changes
  const handleChange = (field: keyof ApiKeyFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!formData.name.trim()) {
      toast.error('Please enter a key name');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Call parent handler to create the key
      await onCreateKey({
        name: formData.name,
        usage_limit: typeof formData.usage_limit === 'string' 
          ? parseInt(formData.usage_limit as string) 
          : formData.usage_limit,
        type: formData.type,
        piiEnabled: formData.piiEnabled
      });
      
      // Reset form and close modal
      setFormData({
        name: '',
        usage_limit: 1000,
        type: 'Development',
        piiEnabled: false
      });
      onClose();
    } catch (error) {
      console.error('Error creating API key:', error);
      toast.error('Failed to create API key');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Create a new API key</h2>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-sm text-gray-700 mb-6">
            Enter a name and limit for the new API key.
          </p>

          {/* Key Name Field */}
          <FormField 
            id="keyName" 
            label="Key Name" 
            description="A unique name to identify this key"
          >
            <input
              type="text"
              id="keyName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
              placeholder="Key Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </FormField>

          {/* Key Type Field */}
          <FormField 
            id="keyType" 
            label="Key Type" 
            description="Environment where this key will be used"
          >
            <select
              id="keyType"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
            >
              <option value="Development">Development</option>
              <option value="Production">Production</option>
              <option value="Testing">Testing</option>
            </select>
          </FormField>

          {/* Usage Limit Field */}
          <FormField 
            id="usageLimit" 
            label="Usage Limit" 
            description="Maximum number of requests per month"
            showHelpIcon
          >
            <input
              type="number"
              id="usageLimit"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
              placeholder="Usage Limit"
              value={formData.usage_limit}
              onChange={(e) => handleChange('usage_limit', parseInt(e.target.value) || 0)}
              min="1"
            />
          </FormField>

          {/* PII Enabled Field */}
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="piiEnabled"
              checked={formData.piiEnabled}
              onChange={(e) => handleChange('piiEnabled', e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="piiEnabled" className="ml-2 block text-sm font-medium text-gray-700">
              Enable PII processing
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create API Key'}
          </button>
        </div>
      </div>
    </div>
  );
} 