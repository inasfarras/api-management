'use client';

import { useState, useEffect } from 'react';
import { EyeSlashIcon, EyeIcon, PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import CreateApiKeyModal from './CreateApiKeyModal';
import NotificationBanner from './NotificationBanner';
import Image from 'next/image';
import { fetchApiKeys, createApiKey, updateApiKey, deleteApiKey } from '@/lib/apiKeyService';
import { ApiKey } from '@/lib/supabase';

// Extracted component for the API key table row
const ApiKeyRow = ({ 
  apiKey, 
  visibleKeyId,
  onToggleVisibility, 
  onCopyKey, 
  onEditKey, 
  onDeleteKey 
}: { 
  apiKey: ApiKey, 
  visibleKeyId: string | null,
  onToggleVisibility: (id: string) => void,
  onCopyKey: (key: string) => void,
  onEditKey: (key: ApiKey) => void,
  onDeleteKey: (id: string) => void
}) => {
  return (
    <tr key={apiKey.id}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {apiKey.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {apiKey.type}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {apiKey.usage}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
        {visibleKeyId === apiKey.id ? apiKey.key : 'tvly-dev-*****************************'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex space-x-2">
          <button 
            onClick={() => onToggleVisibility(apiKey.id)}
            className="text-gray-400 hover:text-gray-600"
            aria-label={visibleKeyId === apiKey.id ? "Hide API key" : "Show API key"}
            title={visibleKeyId === apiKey.id ? "Hide API key" : "Show API key"}
          >
            {visibleKeyId === apiKey.id ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
          <button 
            className="text-gray-400 hover:text-gray-600"
            aria-label="Copy API key"
            title="Copy API key"
            onClick={() => onCopyKey(apiKey.key)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button 
            className="text-gray-400 hover:text-gray-600"
            aria-label="Edit API key"
            title="Edit API key"
            onClick={() => onEditKey(apiKey)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            className="text-gray-400 hover:text-gray-600"
            aria-label="Delete API key"
            title="Delete API key"
            onClick={() => onDeleteKey(apiKey.id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

// Extracted component for the API key table
const ApiKeysTable = ({ 
  apiKeys, 
  visibleKeyId, 
  onToggleVisibility, 
  onCopyKey, 
  onEditKey, 
  onDeleteKey 
}: { 
  apiKeys: ApiKey[], 
  visibleKeyId: string | null,
  onToggleVisibility: (id: string) => void,
  onCopyKey: (key: string) => void,
  onEditKey: (key: ApiKey) => void,
  onDeleteKey: (id: string) => void
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usage
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Key
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Options
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {apiKeys.map((apiKey) => (
            <ApiKeyRow 
              key={apiKey.id}
              apiKey={apiKey}
              visibleKeyId={visibleKeyId}
              onToggleVisibility={onToggleVisibility}
              onCopyKey={onCopyKey}
              onEditKey={onEditKey}
              onDeleteKey={onDeleteKey}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Extracted component for the edit modal
const EditApiKeyModal = ({ 
  isOpen, 
  apiKey, 
  onClose, 
  onSave 
}: { 
  isOpen: boolean, 
  apiKey: ApiKey | null, 
  onClose: () => void, 
  onSave: (id: string, name: string) => void 
}) => {
  const [keyName, setKeyName] = useState('');
  
  useEffect(() => {
    if (apiKey) {
      setKeyName(apiKey.name);
    }
  }, [apiKey]);
  
  if (!isOpen || !apiKey) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Edit API key</h2>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <label htmlFor="editKeyName" className="block text-sm font-medium text-gray-700 mb-1">
              Key Name
            </label>
            <input
              type="text"
              id="editKeyName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black bg-transparent"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
            />
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => onSave(apiKey.id, keyName)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Interface for notification state
interface NotificationState {
  type: 'success' | 'warning' | 'info';
  message: string;
  show: boolean;
}

export default function ApiKeysSection() {
  // State management
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleKeyId, setVisibleKeyId] = useState<string | null>(null);
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  
  // Notification state
  const [notification, setNotification] = useState<NotificationState>({
    type: 'info',
    message: '',
    show: false
  });

  // Initialize - fetch API keys on component mount
  useEffect(() => {
    loadApiKeys();
  }, []);
  
  // Load API keys
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
  
  // Show notification helper
  const showNotification = (type: 'success' | 'warning' | 'info', message: string) => {
    setNotification({
      type,
      message,
      show: true
    });
  };
  
  // API key operations
  const handleCreateKey = async (data: { name: string; usage_limit: number, type?: string, piiEnabled?: boolean }) => {
    try {
      setIsLoading(true);
      const newKey = await createApiKey(
        data.name, 
        data.type || 'Development', 
        data.usage_limit, 
        data.piiEnabled || false
      );
      setApiKeys([newKey, ...apiKeys]);
      showNotification('success', `Successfully created new API key: ${data.name}`);
    } catch (error: any) {
      console.error('Failed to create API key:', error);
      toast.error(error.message || 'Failed to create API key');
    } finally {
      setIsLoading(false);
      setIsCreateModalOpen(false);
    }
  };

  const handleEditKey = async (id: string, newName: string) => {
    if (!newName.trim()) {
      toast.error('Please enter a valid key name');
      return;
    }
    
    try {
      const updatedKey = await updateApiKey(id, { name: newName });
      const updatedKeys = apiKeys.map(key => 
        key.id === id ? { ...key, name: updatedKey.name } : key
      );
      
      setApiKeys(updatedKeys);
      setIsEditModalOpen(false);
      toast.success(`API key renamed to "${newName}"`);
    } catch (error) {
      console.error('Failed to update API key:', error);
      toast.error('Failed to update API key');
    }
  };

  const handleDeleteKey = async (id: string) => {
    try {
      const keyToDelete = apiKeys.find(key => key.id === id);
      await deleteApiKey(id);
      const updatedKeys = apiKeys.filter(key => key.id !== id);
      setApiKeys(updatedKeys);
      toast.error(`API key "${keyToDelete?.name}" has been deleted`);
    } catch (error) {
      console.error('Failed to delete API key:', error);
      toast.error('Failed to delete API key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('API key copied to clipboard');
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeyId(visibleKeyId === id ? null : id);
  };
  
  const handleEditButtonClick = (apiKey: ApiKey) => {
    setEditingKey(apiKey);
    setIsEditModalOpen(true);
  };
  
  const closeNotification = () => {
    setNotification({ ...notification, show: false });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Notification Banner */}
      <NotificationBanner
        type={notification.type}
        message={notification.message}
        isVisible={notification.show}
        onClose={closeNotification}
        autoHideDuration={5000}
      />
      
      <div className="bg-transparent rounded-lg shadow-sm overflow-hidden mt-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Image 
              src="/api-key-logo.svg" 
              alt="API-Key Logo" 
              width={32} 
              height={32} 
              priority 
              className="h-8 w-auto mr-2"
            />
            <h2 className="text-xl font-semibold text-gray-800">API Keys</h2>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Key
          </button>
        </div>
        
        {/* Description */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            The key is used to authenticate your requests to the <a href="#" className="text-indigo-600 hover:text-indigo-800">Research API</a>. To learn more, see the <a href="#" className="text-indigo-600 hover:text-indigo-800">documentation</a> page.
          </p>
          
          {/* API Keys Table */}
          <ApiKeysTable 
            apiKeys={apiKeys}
            visibleKeyId={visibleKeyId}
            onToggleVisibility={toggleKeyVisibility}
            onCopyKey={copyToClipboard}
            onEditKey={handleEditButtonClick}
            onDeleteKey={handleDeleteKey}
          />
        </div>

        {/* Create API Key Modal */}
        <CreateApiKeyModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateKey={handleCreateKey}
        />

        {/* Edit API Key Modal */}
        <EditApiKeyModal
          isOpen={isEditModalOpen}
          apiKey={editingKey}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditKey}
        />
      </div>
    </div>
  );
} 