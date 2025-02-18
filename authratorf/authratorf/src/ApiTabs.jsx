import React, { useState } from 'react';
import { PlusCircle, X, MoreVertical, Trash2, Pencil } from 'lucide-react';

const ApiTabs = ({ collections, activeFolderId, activeApiId, createNewApi, openNewTab, handleDelete }) => {
  const [activeTab, setActiveTab] = useState(activeApiId);

  const allApis = collections.flatMap(folder => 
    folder.apis.map(api => ({
      ...api,
      folderId: folder.id,
      folderName: folder.name
    }))
  );

  const methodColors = {
    GET: '#49cc90',    
    POST: '#61affe',  
    PUT: '#fca130',    
    DELETE: '#f93e3e', 
    PATCH: '#b45dd9'  
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
      
      <div className="flex items-center overflow-x-auto" style={{ height: '40px' }}>
        {allApis.map((api) => (
          <div
            key={api.id}
            onClick={() => {
              setActiveTab(api.id);
              openNewTab(api.folderId, api);
            }}
            className={`
              flex items-center min-w-0 h-full px-4 cursor-pointer group
              ${activeTab === api.id 
                ? 'bg-white dark:bg-gray-800 border-t-2' 
                : 'bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800'}
            `}
            style={{
              borderTopColor: activeTab === api.id ? methodColors[api.method] : 'transparent'
            }}
          >
            
            <span 
              className="mr-2 px-2 py-0.5 rounded text-xs font-mono"
              style={{
                backgroundColor: `${methodColors[api.method]}20`,
                color: methodColors[api.method]
              }}
            >
              {api.method}
            </span>

           
            <span className="truncate text-sm text-gray-700 dark:text-gray-300 max-w-xs">
              {api.name}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(api.folderId, api.id);
              }}
              className="ml-2 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="w-3 h-3 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        ))}
        <button
          onClick={() => createNewApi(activeFolderId)}
          className="flex items-center justify-center h-full px-4 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <PlusCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default ApiTabs;