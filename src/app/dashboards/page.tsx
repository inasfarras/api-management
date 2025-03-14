'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon, ClipboardIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import UsageStats from '@/components/UsageStats';
import ApiKeysSection from '@/components/ApiKeysSection';
import ContactSection from '@/components/ContactSection';
import { fetchApiKeys, createApiKey, updateApiKey as updateApiKeyService, deleteApiKey as deleteApiKeyService } from '@/lib/apiKeyService';
import { ApiKey } from '@/lib/supabase';

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  keyName: string;
}

interface EditApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedKey: Partial<ApiKey>) => void;
  apiKey: ApiKey | null;
}

const DeleteConfirmation = ({ isOpen, onClose, onConfirm, keyName }: DeleteConfirmationProps) => (
  <Dialog open={isOpen} onClose={onClose} className="relative z-50">
    <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Dialog.Panel className="bg-white rounded-lg p-6 max-w-sm w-full">
        <Dialog.Title className="text-xl font-semibold mb-4 text-gray-800">Delete API Key</Dialog.Title>
        <Dialog.Description className="mb-4 text-gray-600 text-base">
          Are you sure you want to delete the API key "{keyName}"? This action cannot be undone.
        </Dialog.Description>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-base"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-base"
          >
            Delete
          </button>
        </div>
      </Dialog.Panel>
    </div>
  </Dialog>
);

const EditApiKeyModal = ({ isOpen, onClose, onSave, apiKey }: EditApiKeyModalProps) => {
  const [keyName, setKeyName] = useState(apiKey?.name || '');
  const [keyType, setKeyType] = useState(apiKey?.type || 'Development');
  const [usageLimit, setUsageLimit] = useState(apiKey?.usage_limit || 1000);
  const [piiEnabled, setPiiEnabled] = useState(apiKey?.pii_enabled || false);

  const handleSave = () => {
    onSave({
      name: keyName,
      type: keyType,
      usage_limit: usageLimit,
      pii_enabled: piiEnabled
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg p-8 max-w-lg w-full">
          <Dialog.Title className="text-2xl font-bold mb-6 text-black">Edit API key</Dialog.Title>
          <Dialog.Description className="mb-6 text-base text-gray-700">
            Enter a new limit for the API key and configure PII restrictions.
          </Dialog.Description>

          <div className="space-y-6">
            {/* Key Name */}
            <div>
              <label className="block mb-2 text-base font-medium text-black">
                Key Name — A unique name to identify this key
              </label>
              <input
                type="text"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="Enter key name"
              />
            </div>

            {/* Key Type */}
            <div>
              <label className="block mb-2 text-base font-medium text-black">
                Key Type — Environment where this key will be used
              </label>
              <select
                value={keyType}
                onChange={(e) => setKeyType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="Development">Development</option>
                <option value="Production">Production</option>
                <option value="Testing">Testing</option>
              </select>
            </div>

            {/* Usage Limit */}
            <div>
              <label className="block mb-2 text-base font-medium text-black">
                Usage Limit — Maximum number of requests per month
              </label>
              <input
                type="number"
                value={usageLimit}
                onChange={(e) => setUsageLimit(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="Enter usage limit"
                min="1"
              />
            </div>

            {/* PII Enabled */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="piiEnabled"
                checked={piiEnabled}
                onChange={(e) => setPiiEnabled(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="piiEnabled" className="ml-2 block text-base font-medium text-black">
                Enable PII processing
              </label>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base"
            >
              Save Changes
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default function DashboardPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; keyId: string; keyName: string }>({
    isOpen: false,
    keyId: '',
    keyName: '',
  });
  const [editModal, setEditModal] = useState<{ isOpen: boolean; apiKey: ApiKey | null }>({
    isOpen: false,
    apiKey: null,
  });

  // Fetch API keys on component mount
  useEffect(() => {
    const loadApiKeys = async () => {
      try {
        setIsLoading(true);
        const keys = await fetchApiKeys();
        setApiKeys(keys);
      } catch (error) {
        console.error('Failed to load API keys:', error);
        toast.error('Failed to load API keys');
      } finally {
        setIsLoading(false);
      }
    };

    loadApiKeys();
  }, []);

  const generateApiKey = async () => {
    if (!newKeyName) {
      toast.error('Please enter a key name');
      return;
    }
    
    setIsLoading(true);
    try {
      const newKey = await createApiKey(newKeyName);
      setApiKeys([newKey, ...apiKeys]);
      setNewKeyName('');
      toast.success('API key generated successfully');
    } catch (error: any) {
      console.error('Failed to generate API key:', error);
      toast.error(error.message || 'Failed to generate API key');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      await deleteApiKeyService(id);
      setApiKeys(apiKeys.filter(key => key.id !== id));
      toast.success('API key deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete API key:', error);
      toast.error(error.message || 'Failed to delete API key');
    }
  };

  const updateApiKeyName = async (id: string) => {
    if (!editName.trim()) {
      toast.error('Please enter a valid name');
      return;
    }

    try {
      const updatedKey = await updateApiKeyService(id, { name: editName });
      setApiKeys(apiKeys.map(key => 
        key.id === id ? { ...key, name: updatedKey.name } : key
      ));
      setEditingKey(null);
      setEditName('');
      toast.success('API key name updated successfully');
    } catch (error: any) {
      console.error('Failed to update API key name:', error);
      toast.error(error.message || 'Failed to update API key name');
    }
  };

  const updateApiKey = async (id: string, updatedData: Partial<ApiKey>) => {
    try {
      const updatedKey = await updateApiKeyService(id, updatedData);
      setApiKeys(apiKeys.map(key => 
        key.id === id ? { ...key, ...updatedKey } : key
      ));
      toast.success('API key updated successfully');
    } catch (error: any) {
      console.error('Failed to update API key:', error);
      toast.error(error.message || 'Failed to update API key');
    }
  };

  const openEditModal = (apiKey: ApiKey) => {
    setEditModal({
      isOpen: true,
      apiKey
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('API key copied to clipboard');
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const maskApiKey = (key: string) => {
    const prefix = key.substring(0, 5);
    const suffix = key.substring(key.length - 4);
    return `${prefix}${'•'.repeat(20)}${suffix}`;
  };

  const totalRequests = apiKeys.reduce((sum, key) => sum + (key.usage_limit || 0), 0) || 1000;
  const usedRequests = apiKeys.reduce((sum, key) => sum + key.usage, 0);
  const usagePercentage = (usedRequests / totalRequests) * 100;

  return (
    <div className="container mx-auto">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
          <p className="mt-2 text-gray-600">Manage your API keys and usage.</p>
        </div>
        
        {/* Usage Stats */}
        <UsageStats />
        
        {/* API Keys Section */}
        <ApiKeysSection />
        
        {/* Contact Section */}
        <ContactSection />
      </div>
    </div>
  );
} 