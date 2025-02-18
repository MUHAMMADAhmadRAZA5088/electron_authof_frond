import React, { useState } from 'react';
import { 
  Settings, Check, Trash, Plus, Search, Edit2, X, 
  FolderClosed, Lock, Code, Database 
} from 'lucide-react';

const EnvironmentManagementPanel = ({ 
  environments, 
  activeEnvironment, 
  onEnvChange, 
  onAddEnv, 
  onDeleteEnv, 
  onUpdateEnv, 
  onClose 
}) => {
  const [newEnv, setNewEnv] = useState({ name: '', variables: {} });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEnv, setEditingEnv] = useState(null);
  const [newVariableName, setNewVariableName] = useState('');
  const [newVariableValue, setNewVariableValue] = useState('');

  const filteredEnvironments = environments.filter(env => 
    env.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEnvironment = () => {
    if (newEnv.name.trim()) {
      onAddEnv(newEnv);
      setNewEnv({ name: '', variables: {} });
    }
  };

  const handleAddVariable = (env) => {
    if (newVariableName.trim() && newVariableValue.trim()) {
      const updatedEnv = {
        ...env,
        variables: {
          ...env.variables,
          [newVariableName]: newVariableValue
        }
      };
      onUpdateEnv(updatedEnv);
      setNewVariableName('');
      setNewVariableValue('');
    }
  };

  const handleRemoveVariable = (env, variableName) => {
    const { [variableName]: removedVar, ...remainingVars } = env.variables;
    const updatedEnv = { ...env, variables: remainingVars };
    onUpdateEnv(updatedEnv);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Settings className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Environment Management
          </h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search environments..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-700 
                         border border-gray-200 dark:border-gray-600 rounded-md
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="New Environment Name"
              className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 
                         border border-gray-200 dark:border-gray-600 rounded-md
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newEnv.name}
              onChange={(e) => setNewEnv({ ...newEnv, name: e.target.value })}
            />
            <button
              onClick={handleAddEnvironment}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 
                         hover:bg-blue-600 rounded-md transition-colors"
            >
              <Plus className="w-4 h-4 mr-2 inline" /> Add
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredEnvironments.map((env) => (
            <div 
              key={env.id} 
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Database className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                    {env.name}
                  </h3>
                  {activeEnvironment?.id === env.id && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEnvChange(env)}
                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
                  >
                    <Check className="w-4 h-4 text-green-500" />
                  </button>
                  <button
                    onClick={() => onDeleteEnv(env.id)}
                    className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md"
                  >
                    <Trash className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {Object.entries(env.variables || {}).map(([key, value]) => (
                  <div 
                    key={key} 
                    className="flex items-center justify-between bg-white dark:bg-gray-800 
                               p-2 rounded-md border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{key}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{value}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveVariable(env, key)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md"
                    >
                      <Trash className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}

                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Variable Name"
                    className="flex-1 px-2 py-1 text-sm bg-white dark:bg-gray-800 
                               border border-gray-200 dark:border-gray-600 rounded-md"
                    value={newVariableName}
                    onChange={(e) => setNewVariableName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Variable Value"
                    className="flex-1 px-2 py-1 text-sm bg-white dark:bg-gray-800 
                               border border-gray-200 dark:border-gray-600 rounded-md"
                    value={newVariableValue}
                    onChange={(e) => setNewVariableValue(e.target.value)}
                  />
                  <button
                    onClick={() => handleAddVariable(env)}
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded-md"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnvironmentManagementPanel;