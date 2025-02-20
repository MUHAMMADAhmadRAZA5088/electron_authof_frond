import React, { useState, useEffect } from 'react';
import { Clock, Search, Calendar, MoreVertical, Weight, Link2, X } from 'lucide-react';

const RequestHistoryPanel = ({ collections = [], openRequestInTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [requestHistories, setRequestHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const fetchRequestHistory = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      setIsLoading(true);
      try {
        const response = await fetch(`http://203.161.50.28:5001/api/request-history/${userId}`);
        const data = await response.json();
        
        if (data.success) {
          setRequestHistories(data.requestHistories);
        }
      } catch (error) {
        console.error('Failed to fetch request history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequestHistory();
  }, []);

  const filteredHistory = requestHistories.filter(request => {
    if (!searchQuery) return true;
    
    return (
      request?.url?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request?.method?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request?.apiName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request?.folderName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getMethodColor = (method) => {
    switch (method?.toUpperCase()) {
      case 'GET':
        return 'bg-green-600';
      case 'POST':
        return 'bg-blue-500';
      case 'PUT':
        return 'bg-yellow-500';
      case 'PATCH':
        return 'bg-purple-500';
      case 'DELETE':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleShowDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleOpenInTab = (request) => {
    if (openRequestInTab && request) {
      openRequestInTab(request);
    }
  };


  const DetailsModal = ({ request, onClose }) => {
    if (!request) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto m-4">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold dark:text-white">Request Details</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Headers Section */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h4 className="font-medium mb-2 dark:text-white">Request Headers</h4>
              {request.requestDetails?.headers?.map((header, index) => (
                <div key={index} className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">{header.key}:</span> {header.value}
                </div>
              ))}
            </div>

            {/* Query Params Section */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h4 className="font-medium mb-2 dark:text-white">Query Parameters</h4>
              {request.requestDetails?.queryParams?.map((param, index) => (
                <div key={index} className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">{param.key}:</span> {param.value}
                </div>
              ))}
            </div>

            {/* Body Section */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h4 className="font-medium mb-2 dark:text-white">Request Body</h4>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(request.requestDetails?.body, null, 2)}
                </pre>
              </div>
            </div>

            {/* Auth Section */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h4 className="font-medium mb-2 dark:text-white">Authentication</h4>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Type: {request.requestDetails?.auth?.type || 'None'}
              </div>
            </div>

            {/* Response Section */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h4 className="font-medium mb-2 dark:text-white">Response</h4>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(request.responseDetails, null, 2)}
                </pre>
              </div>
            </div>

            {/* Settings Section */}
            <div>
              <h4 className="font-medium mb-2 dark:text-white">Settings</h4>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <div>Follow Redirects: {request.settings?.followRedirects ? 'Yes' : 'No'}</div>
                <div>SSL Verification: {request.settings?.sslVerification ? 'Yes' : 'No'}</div>
                <div>Timeout: {request.settings?.timeout}ms</div>
                <div>Response Size Limit: {request.settings?.responseSizeLimit}MB</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Request History</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by URL, method, collection, or request name..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                     bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p className="text-lg">No request history found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
         ) : (
          filteredHistory.map((request, index) => (
            <div
              key={`${request?.apiId}-${request?.timestamp}-${index}`}
              className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 
                        ${request?.success ? '' : 'bg-red-50 dark:bg-red-900/20'} cursor-pointer`}
              onClick={() => handleOpenInTab(request)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getMethodColor(request?.method)}`}>
                    {request?.method}
                  </span>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <Link2 className="w-4 h-4" />
                    <span className="truncate max-w-md">{request?.url}</span>
                  </div>
                </div>
                <button 
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                  onClick={() => handleShowDetails(request)}
                >
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              
              <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">{request?.folderName}</span>
                <span className="mx-2">•</span>
                <span>{request?.apiName}</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(request?.timestamp).toLocaleTimeString()}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Weight className="w-4 h-4" />
                  <span>{request?.responseTime}ms</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{((request?.responseSize || 0) / 1024).toFixed(2)} KB</span>
                </div>
                
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium
                              ${request?.success ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' : 
                                               'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'}`}>
                  <span>{request?.status} {request?.success ? 'Success' : 'Failed'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {showDetailsModal && (
        <DetailsModal 
          request={selectedRequest} 
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedRequest(null);
          }} 
        />
      )}
    </div>
  );
};

export default RequestHistoryPanel;