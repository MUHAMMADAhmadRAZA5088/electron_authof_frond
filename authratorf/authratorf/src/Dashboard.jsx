import React, { useState, useRef, useEffect } from 'react';
import { Settings,Check, Trash, AlertTriangle, Clock,Send, Folder,Menu, Plus,Search,Edit2, X, ChevronDown, Save ,Sun,Moon, PlusCircle, FolderClosed, Database, Lock, Code, CodeSquare, Circle, ExternalLink, ArrowUpDown, Download, Copy, Trash2, Pencil, MoreVertical, Play, Terminal, FolderCheckIcon, HistoryIcon, Info, MessageSquare, Wifi, KeyRound, Cookie, MousePointer2, Antenna, Rotate3d, TerminalSquare, Dot, MoreHorizontal, LayoutTemplate, DatabaseZapIcon} from 'lucide-react';
import ResponseAnalytics from './ResponseAnalytics';
import logo from "./imgpsh.png"
import EnvironmentManager from './EnvironmentManager';
import RequestHistory from './History';
import CustomDropdown from './CustomDropdown';
import PerformanceTestingPanel from './PerformanceTesting';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import ApiTabs from './ApiTabs';
import Checkbox from './Checkbox';
import RequestHistoryPanel from './History';
import AuthTemplateManager from './AuthTemplateManager';
import EnvironmentManagementPanel from './EnvironmentManager';
import { useCallback } from 'react';
import debounce from 'lodash/debounce';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://203.161.50.28:5001/api';

const createDebouncedUpdate = (updateFn) => {
  return debounce(updateFn, 5000, { maxWait: 5000 });
};

const App = () => {
  const [collections, setCollections] = useState([]);
  const [activeFolderId, setActiveFolderId] = useState(null);
  const [dbTemplates, setDbTemplates] = useState([]);
  const [activeApiId, setActiveApiId] = useState(null);
  const [activeTab, setActiveTab] = useState('params');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [openTabs, setOpenTabs] = React.useState([]);
  const [editingName, setEditingName] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [newName, setNewName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [environments, setEnvironments] = useState([]);
  const [activeEnvironment, setActiveEnvironment] = useState(null);
  const [error, setError] = useState(null);
  const [isPerformanceTesting, setIsPerformanceTesting] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('collections');
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(280);
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(70);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeRightSection, setActiveRightSection] = useState('code');
  const navigate = useNavigate ();

  const [isMobile, setIsMobile] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
        
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;
        
        const response = await axios.get(`${API_BASE_URL}/templates/${userId}`);
        if (response.data.success) {
          setDbTemplates(response.data.templates);
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };
  
    fetchTemplates();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mobileMenuItems = [
    { icon: Play, label: 'Runner' },
    { icon: Antenna, label: 'Capture' },
    { icon: MousePointer2, label: 'Auto-Select' },
    { icon: Cookie, label: 'Cookies' },
    { icon: KeyRound, label: 'Vault' },
    { icon: Trash2, label: 'Trash' }
  ];

  
const FooterButton = ({ icon: Icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center space-x-1 hover:text-gray-900 dark:hover:text-gray-300 whitespace-nowrap"
  >
    <Icon className="w-3.5 h-3.5" />
    <span className="hidden sm:inline">{label}</span>
  </button>
);

  const MIN_LEFT_SIDEBAR_WIDTH = 60;
  const MIN_RIGHT_SIDEBAR_WIDTH = 70;
  const MAX_LEFT_SIDEBAR_WIDTH = 400;
  const MAX_RIGHT_SIDEBAR_WIDTH = 70;

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      if (isMobileView) {
        setIsRightSidebarCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);





  const handleLeftResize = (e, { size }) => {
    if (!isMobile) {
      if (size.width <= MIN_LEFT_SIDEBAR_WIDTH) {
        setIsLeftSidebarCollapsed(true);
        setLeftSidebarWidth(MIN_LEFT_SIDEBAR_WIDTH);
      } else {
        setIsLeftSidebarCollapsed(false);
        setLeftSidebarWidth(size.width);
      }
    }
  };


  const handleApiClick = (folderId, api) => {
    openNewTab(folderId, api);
    setIsSidebarOpen(false);
    setIsPerformanceTesting(false);
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  };


  const navigationItems = [
    { id: 'collections', icon: FolderCheckIcon, label: 'Collections' },
    { id: 'environments', icon: Database, label: 'Environments' },
    { id: 'history', icon: HistoryIcon, label: 'History' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'authTemplates', icon: LayoutTemplate, label: 'authTemplates' }
  ];
  const rightNavigationItems = [
    { id: 'code', icon: Code, label: 'Response' },
    { id: 'details', icon:Info, label: 'Details' },
    { id: 'comments', icon: MessageSquare, label: 'Comments' }
  ];

  const handleMobileNavClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileSidebarOpen(false);
  };



  const  renderSidebarContent = () => {
    switch (activeSection) {
      case 'collections':
        return (
          <div className="flex-1">
            {collections.map((folder) => (
              <div key={folder.id} className="p-2">
                <div className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-150 cursor-pointer group">
                  <div 
                    className="flex items-center space-x-2 flex-1 min-w-0"
                    onClick={() => {
                      setActiveFolderId(folder.id);
                      setIsMobileSidebarOpen(false);
                    }}
                  >
                    <FolderClosed className="w-4 h-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                    <span className="truncate font-medium text-gray-800 dark:text-gray-300">
                      {folder.name}
                    </span>
                  </div>
                 
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        createNewApi(folder.id);
                      }}
                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
                    >
                      <PlusCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                    <CustomDropdown trigger={<MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400 z-100" />}>
                  <button
                    onClick={() => {
                      setEditingName(folder.id);
                      setEditingType('collection');
                      setNewName(folder.name);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                  >
                    <Pencil className="w-4 h-4" />
                    <span>Rename</span>
                  </button>
                  <button
                    onClick={() => handleDelete(folder.id)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </CustomDropdown>
                  </div>
                </div>
                
                {folder.apis.map((api) => (
              <div key={api.id} className="relative ml-2 p-2 rounded-lg cursor-pointer group">
                <div
                  className={`flex items-center justify-between space-x-2 min-w-0 ${
                    activeApiId === api.id
                      ? 'bg-blue-100 dark:bg-blue-800 pl-1 pr-1 rounded-lg'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 pl-1 pr-1 rounded-lg'
                  }`}
                  onClick={() => {
                    openNewTab(folder.id, api);
                    setIsSidebarOpen(false);
                    setIsPerformanceTesting(false);
                  }}
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <span className={`flex-shrink-0 px-2 py-0.5 rounded-md text-xs font-semibold tracking-wide ${
                      {
                        GET: 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300',
                        POST: 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300',
                        PUT: 'bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300',
                        DELETE: 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300',
                        PATCH: 'bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300',
                      }[api.method]
                    }`}>
                      {api.method}
                    </span>
                    <span className="truncate text-sm text-gray-700 dark:text-gray-300">
                      {api.name}
                    </span>
                  </div>
                  <CustomDropdown trigger={<MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingName(api.id);
                        setEditingType('api');
                        setNewName(api.name);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <Pencil className="w-4 h-4" />
                      <span>Rename</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(folder.id, api.id);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </CustomDropdown>
                </div>
              </div>
            ))}
              </div>
            ))}
          </div>
        );       
      
      case 'environments':
        return (
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <span>Environment Management</span>
           
            <DatabaseZapIcon className="w-5 h-5" />
        
        </div>
        );
      
      case 'history':
        return (
          <div className="p-4">
            <RequestHistory 
                collections={collections}
  className="w-full"
            />
          </div>
        );
      
      case 'settings':
        return (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span>Dark Mode</span>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-blue-400" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span>Performance Testing</span>
              <button
                onClick={() => setIsPerformanceTesting(!isPerformanceTesting)}
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        );

        case 'authTemplates':
          return (
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span> Auth Template</span>
               
                <LayoutTemplate className="w-5 h-5" />
            
            </div>
          );
    }
  };


  
  const handleEnvironmentChange = (env) => {
    setActiveEnvironment(env);
  };
  
  const handleAddEnvironment = (env) => {
    setEnvironments([...environments, { ...env, id: Date.now() }]);
  };
  
  const handleDeleteEnvironment = (id) => {
    setEnvironments(environments.filter(env => env.id !== id));
  };
  
  const handleUpdateEnvironment = (id, updatedEnv) => {
    setEnvironments(environments.map(env => 
      env.id === id ? { ...env, ...updatedEnv } : env
    ));
  };
  

  

  useEffect(() => {
    setOpenTabs(prevTabs => 
      prevTabs.map(tab => {
        const folder = collections.find(f => f.id === tab.folderId);
        const api = folder?.apis.find(a => a.id === tab.id);
        if (api) {
          return {
            ...tab,
            method: api.method,
            name: api.name
          };
        }
        return tab;
      })
    );
  }, [collections]);

  const [scriptType, setScriptType] = useState('pre-request');
  const [consoleOutput, setConsoleOutput] = useState([]);
 
 


    const closeTab = (apiId) => {
      setOpenTabs(openTabs.filter(tab => tab.id !== apiId));
      if (activeApiId === apiId) {
        
        const index = openTabs.findIndex(tab => tab.id === apiId);
        if (index > 0) {
          setActiveApiId(openTabs[index - 1].id);
          setActiveFolderId(openTabs[index - 1].folderId);
        } else if (openTabs.length > 1) {
          setActiveApiId(openTabs[1].id);
          setActiveFolderId(openTabs[1].folderId);
        } else {
          setActiveApiId(null);
          setActiveFolderId(null);
        }
      }
    };
  
    const openNewTab = (folderId, api) => {
      if (!openTabs.find(tab => tab.id === api.id)) {
        setOpenTabs([...openTabs, { 
          id: api.id, 
          name: api.name, 
          method: api.method,
          folderId: folderId 
        }]);
      }
      setActiveFolderId(folderId);
      setActiveApiId(api.id);
    };
    const toggleDarkMode = () => {
      setIsDarkMode(!isDarkMode);
    };
    useEffect(() => {
      const fetchCollections = async () => {
        try {
          const response = await fetch(`http://203.161.50.28:5001/api/collections/${userId}`);
          const data = await response.json();
          if (data.success) {
            setCollections(data.collections);
          }
        } catch (error) {
          console.error('Error fetching collections:', error);
        }
      };
    
      if (userId) {
        fetchCollections();
      }
    }, [userId]);

    const handleSignOut = () => {
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
      navigate('/');
    }
    
    // Update createNewFolder function
    const createNewFolder = async () => {
      try {
        const response = await fetch('http://203.161.50.28:5001/api/collections', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: `Collection ${collections.length + 1}`,
            userId
          }),
        });
        
        const data = await response.json();
        if (data.success) {
          const newFolder = {
            id: data.collection._id,
            name: data.collection.name,
            apis: [],
          };
          setCollections([...collections, newFolder]);
          setActiveFolderId(newFolder.id);
          setActiveApiId(null);
        }
      } catch (error) {
        console.error('Error creating collection:', error);
      }
    };
    
    // Update createNewApi function
    const createNewApi = async (folderId) => {
      try {
        const response = await fetch('http://203.161.50.28:5001/api/apis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            collectionId: folderId,
            name: 'New Request',
            method: 'GET'
          }),
        });
    
        const data = await response.json();
        if (data.success) {
          const updatedCollections = collections.map((folder) => {
            if (folder.id === folderId) {
              const newApi = {
                id: data.api._id,
                name: data.api.name,
                method: data.api.method,
                url: "",
                headers: [],
                queryParams: [],
                body: {
                  type: "none",
                  content: "",
                  formData: [],
                  urlencoded: [],
                },
                scripts: {
                  preRequest: "",
                  tests: "",
                },
                auth: {
                  type: "none",
                  jwt: { key: "", value: "", pairs: [] },
                  avqJwt: { value: "" },
                },
                responseData: null,
                activeResponseTab: "response-body",
              };
              folder.apis.push(newApi);
              setActiveApiId(newApi.id);
            }
            return folder;
          });
          setCollections(updatedCollections);
        }
      } catch (error) {
        console.error('Error creating API:', error);
      }
    };
    
    // Update handleDelete function
    const handleDelete = async (folderId, apiId = null) => {
      try {
        if (apiId) {
          // Delete API
          const response = await fetch(`http://203.161.50.28:5001/api/apis/${apiId}`, {
            method: 'DELETE',
          });
          
          if (response.ok) {
            const updatedCollections = collections.map(folder => {
              if (folder.id === folderId) {
                return {
                  ...folder,
                  apis: folder.apis.filter(api => api.id !== apiId)
                };
              }
              return folder;
            });
            setCollections(updatedCollections);
            
            if (openTabs.some(tab => tab.id === apiId)) {
              closeTab(apiId);
            }
          }
        } else {
          // Delete Collection
          const response = await fetch(`http://203.161.50.28:5001/api/collections/${folderId}`, {
            method: 'DELETE',
          });
          
          if (response.ok) {
            const updatedCollections = collections.filter(folder => folder.id !== folderId);
            setCollections(updatedCollections);
            
            const tabsToClose = openTabs.filter(tab => tab.folderId === folderId);
            tabsToClose.forEach(tab => closeTab(tab.id));
          }
        }
      } catch (error) {
        console.error('Error deleting:', error);
      }
    };
    
    const debouncedUpdateApi = useCallback(
      createDebouncedUpdate(async (folderId, apiId, updatedData) => {
        try {
          const response = await fetch(`http://203.161.50.28:5001/api/apis/${apiId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
          });
  
          if (!response.ok) {
            throw new Error('Failed to update API');
          }
        } catch (error) {
          console.error('Error updating API:', error);
          // You might want to handle the error state here
          setError('Failed to save changes');
        }
      }),
      [] // Empty dependency array since this function doesn't depend on any props or state
    );
  
    const updateApiState = (folderId, apiId, updatedData) => {
      // Update the UI immediately
      const updatedCollections = collections.map((folder) => {
        if (folder.id === folderId) {
          folder.apis = folder.apis.map((api) =>
            api.id === apiId ? { ...api, ...updatedData } : api
          );
        }
        return folder;
      });
      setCollections(updatedCollections);

      debouncedUpdateApi(folderId, apiId, updatedData);
    };
  
    // Cleanup function to cancel any pending debounced calls
    useEffect(() => {
      return () => {
        debouncedUpdateApi.cancel();
      };
    }, [debouncedUpdateApi]);
    
      const getActiveApi = () => {
        const folder = collections.find(f => f.id === activeFolderId);
        return folder?.apis.find(api => api.id === activeApiId);
      };
    
      const handleSend = async () => {
        const api = getActiveApi();
        const userId = localStorage.getItem('userId');
        if (!api || !userId) return;
      
        const startTime = performance.now();
      
        updateApiState(activeFolderId, activeApiId, {
          isLoading: true,
          responseData: null
        });
        
        try {
          // Properly structure the body based on bodyType
          let processedBody = null;
          if (api.body.type === 'raw') {
            processedBody = {
              type: 'raw',
              content: typeof api.body.content === 'string' 
                ? api.body.content 
                : JSON.stringify(api.body.content)
            };
          } else if (api.body.type === 'formData') {
            processedBody = {
              type: 'formData',
              formData: Array.isArray(api.body.formData) ? api.body.formData : []
            };
          } else if (api.body.type === 'urlencoded') {
            processedBody = {
              type: 'urlencoded',
              urlencoded: Array.isArray(api.body.urlencoded) ? api.body.urlencoded : []
            };
          }
      
          const proxyRequest = {
            method: api.method,
            url: api.url,
            headers: Array.isArray(api.headers) ? [...api.headers] : [],
            bodyType: api.body.type,
            body: processedBody,
            settings: {
              followRedirects: api.settings?.followRedirects ?? true,
              timeout: api.settings?.timeout ?? 0,
              sslVerification: api.settings?.sslVerification ?? true,
              responseSizeLimit: api.settings?.responseSizeLimit ?? 50,
              proxy: api.settings?.enableProxy ? {
                url: api.settings.proxyUrl,
                auth: api.settings.proxyAuth ? {
                  username: api.settings.proxyUsername,
                  password: api.settings.proxyPassword
                } : null
              } : null
            }
          };
      
          // Add authentication headers if needed
          if (api.auth.type === 'config-jwt' && api.auth.jwt?.key && api.auth.jwt?.value) {
            proxyRequest.headers.push({
              key: api.auth.jwt.key,
              value: api.auth.jwt.value
            });
          } else if (api.auth.type === 'avq-jwt' && api.auth.avqJwt?.value) {
            proxyRequest.headers.push({
              key: 'X-AVQ-AUTH',
              value: api.auth.avqJwt.value
            });
          }
      
          try {
            // Ensure the request body is properly stringified
            const stringifiedBody = JSON.stringify(proxyRequest);
            
            const response = await fetch('http://203.161.50.28:5000/api/proxy', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: stringifiedBody
            });
      
            const endTime = performance.now();
            const responseText = await response.text();
            let responseData;
            
            try {
              responseData = JSON.parse(responseText);
            } catch (parseError) {
              responseData = responseText;
            }
      
            // Comprehensive request history object
            const requestMetrics = {
              userId,
              method: api.method,
              url: api.url,
              timestamp: new Date().toISOString(),
              responseTime: Math.round(endTime - startTime),
              status: response.status,
              responseSize: new TextEncoder().encode(responseText).length,
              success: response.status >= 200 && response.status < 300,
              apiName: api.name || 'Unnamed API',
              folderName: collections.find(f => f.id === activeFolderId)?.name || 'Unnamed Folder',
              requestDetails: {
                headers: api.headers,
                body: processedBody, // Use the processed body here too
                queryParams: api.queryParams,
                auth: api.auth
              },
              responseDetails: {
                headers: Object.fromEntries(response.headers),
                body: responseData
              },
              errorContext: null
            };
      
            if (!response.ok) {
              requestMetrics.errorContext = {
                type: response.status >= 500 ? 'Server Error' : 'Client Error',
                message: responseData?.message || 'Unknown error occurred',
                details: responseData
              };
            }
      
            // Save request history
            try {
              await fetch('http://203.161.50.28:5001/api/request-history', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestMetrics)
              });
            } catch (historyError) {
              console.error('Failed to save request history:', historyError);
            }
      
            // Update local state
            updateApiState(activeFolderId, activeApiId, {
              isLoading: false,
              activeResponseTab: 'response-body',
              responseData: {
                ...responseData,
                status: response.status,
                responseTime: requestMetrics.responseTime,
                size: requestMetrics.responseSize,
                headers: Object.fromEntries(response.headers)
              },
               requestHistory: [...(api.requestHistory || []), requestMetrics], // Add this line
              lastRequest: {
                timestamp: requestMetrics.timestamp,
                success: requestMetrics.success,
                method: api.method,
                url: api.url
              }
            });
      
          } catch (networkError) {
            const endTime = performance.now();
            
            // Comprehensive error request history
            const errorMetrics = {
              userId,
              method: api.method,
              url: api.url,
              timestamp: new Date().toISOString(),
              responseTime: Math.round(endTime - startTime),
              status: 0, // Network error
              responseSize: 0,
              success: false,
              apiName: api.name || 'Unnamed API',
              folderName: collections.find(f => f.id === activeFolderId)?.name || 'Unnamed Folder',
              requestDetails: {
                headers: api.headers,
                body: api.body,
                queryParams: api.queryParams,
                auth: api.auth
              },
              errorContext: {
                type: 'Network Error',
                message: networkError.message,
                details: networkError
              }
            };
      
            // Save network error history to database
            try {
              await fetch('http://203.161.50.28:5001/api/request-history', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(errorMetrics)
              });
            } catch (historyError) {
              console.error('Failed to save error history:', historyError);
            }
      
            // Update local state for network error
            updateApiState(activeFolderId, activeApiId, {
              isLoading: false,
              activeResponseTab: 'response-body',
              responseData: {
                error: networkError.message,
                status: 0,
                responseTime: Math.round(endTime - startTime),
                size: 0
              },
              lastRequest: {
                timestamp: errorMetrics.timestamp,
                success: false,
                method: api.method,
                url: api.url
              }
            });
          }
        } catch (unexpectedError) {
          console.error('Unexpected error in handleSend:', unexpectedError);
          
          // Handle any unexpected errors
          updateApiState(activeFolderId, activeApiId, {
            isLoading: false,
            responseData: {
              error: 'An unexpected error occurred',
              status: 500,
              responseTime: 0,
              size: 0
            }
          });
        }
      };

const getStatusText = (status) => {
  const statusMap = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout'
  };
  return statusMap[status] || 'Unknown Status';
};

const getStatusColor = (status) => {
  if (status >= 200 && status < 300) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
  if (status >= 400 && status < 500) return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
  if (status >= 500) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
};

const JsonHighlighter = ({ data }) => {
  const renderValue = (value) => {
    if (typeof value === 'boolean') {
      return <span className="text-orange-500 dark:text-orange-400">{value.toString()}</span>;
    }
    if (typeof value === 'number') {
      return <span className="text-indigo-500 dark:text-indigo-400">{value}</span>;
    }
    if (typeof value === 'string') {
      if (value.match(/^\d{4}-\d{2}-\d{2}T/)) {
        return <span className="text-green-500 dark:text-green-400">"{value}"</span>;
      }
      return <span className="text-teal-500 dark:text-teal-400">"{value}"</span>;
    }
    return value;
  };

  const renderJson = (obj, level = 0) => {
    const indent = '  '.repeat(level);
    
    if (Array.isArray(obj)) {
      return (
        <>
          {'[\n'}
          {obj.map((item, index) => (
            <React.Fragment key={index}>
              {indent}  {renderJson(item, level + 1)}
              {index < obj.length - 1 ? ',' : ''}{'\n'}
            </React.Fragment>
          ))}
          {indent}{']'}
        </>
      );
    }
    
    if (typeof obj === 'object' && obj !== null) {
      return (
        <>
          {'{\n'}
          {Object.entries(obj).map(([key, value], index, arr) => (
            <React.Fragment key={key}>
              {indent}  <span className="text-blue-500 dark:text-blue-400">"{key}"</span>: {renderJson(value, level + 1)}
              {index < arr.length - 1 ? ',' : ''}{'\n'}
            </React.Fragment>
          ))}
          {indent}{'}'}
        </>
      );
    }
    
    return renderValue(obj);
  };

  return (
    <pre className=" font-sans font-semibold text-sm">
      {renderJson(data)}
    </pre>
  );
};

const PrettyJson = ({ data }) => {
  const renderKey = (key) => (
    <span className="text-blue-500 dark:text-blue-400">"{key}"</span>
  );

  const renderValue = (value) => {
    
    if (value === null) {
      return <span className="text-gray-500 dark:text-gray-400">null</span>;
    }
    
  
    if (typeof value === 'boolean') {
      return <span className="text-orange-500 dark:text-orange-400">{String(value)}</span>;
    }
    
    
    if (typeof value === 'number') {
      return <span className="text-indigo-500 dark:text-indigo-400">{value}</span>;
    }
    
    
    if (typeof value === 'string') {
     
      if (value.match(/^\d{4}-\d{2}-\d{2}T/)) {
        return <span className="text-green-500 dark:text-green-400">"{value}"</span>;
      }
    
      if (value === '') {
        return <span className="text-teal-500 dark:text-teal-400">""</span>;
      }
   
      return <span className="text-teal-500 dark:text-teal-400">"{value}"</span>;
    }
    
    return value;
  };

  const renderPrettyJson = (obj, level = 0) => {
    const indent = '  '.repeat(level);
    
    
    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      
      return (
        <span>
          {'[\n'}
          {obj.map((item, index) => (
            <span key={index}>
              {indent}  {renderPrettyJson(item, level + 1)}
              {index < obj.length - 1 ? ',' : ''}{'\n'}
            </span>
          ))}
          {indent}{']'}
        </span>
      );
    }
    
   
    if (typeof obj === 'object' && obj !== null) {
      const entries = Object.entries(obj);
      if (entries.length === 0) return '{}';
      
      return (
        <span>
          {'{\n'}
          {entries.map(([key, value], index) => (
            <span key={key}>
              {indent}  {renderKey(key)}: {renderPrettyJson(value, level + 1)}
              {index < entries.length - 1 ? ',' : ''}{'\n'}
            </span>
          ))}
          {indent}{'}'}
        </span>
      );
    }
    
    
    return renderValue(obj);
  };

  return (
    <pre className="font-sans font-semibold text-sm">
      {renderPrettyJson(data)}
    </pre>
  );
};

const RawView = ({ data }) => {
  const renderValue = (value) => {
    if (typeof value === 'boolean') {
      return <span className="text-orange-500 dark:text-orange-400">{String(value)}</span>;
    }
    if (typeof value === 'number') {
      return <span className="text-indigo-500 dark:text-indigo-400">{value}</span>;
    }
    if (typeof value === 'string') {
      if (value.match(/^\d{4}-\d{2}-\d{2}T/)) {
        return <span className="text-green-500 dark:text-green-400">"{value}"</span>;
      }
      return <span className="text-teal-500 dark:text-teal-400">"{value}"</span>;
    }
    return value;
  };

  const renderRawJson = (obj) => {
    if (Array.isArray(obj)) {
      return (
        <>
          [
          {obj.map((item, index) => (
            <React.Fragment key={index}>
              {renderRawJson(item)}
              {index < obj.length - 1 ? ',' : ''}
            </React.Fragment>
          ))}
          ]
        </>
      );
    }
    
    if (typeof obj === 'object' && obj !== null) {
      return (
        <>
          {'{'}
          {Object.entries(obj).map(([key, value], index, arr) => (
            <React.Fragment key={key}>
              <span className="text-blue-500 dark:text-blue-400">"{key}"</span>
              :
              {renderRawJson(value)}
              {index < arr.length - 1 ? ',' : ''}
            </React.Fragment>
          ))}
          {'}'}
        </>
      );
    }
    
    return renderValue(obj);
  };

  return (
    <pre className="font-sans font-semibold text-sm">
      {renderRawJson(data)}
    </pre>
  );
};
const XMLView = ({ data }) => {
  const formatXML = (xml) => {
    let formatted = '';
    let indent = 0;
    
    
    const getIndent = (level) => '  '.repeat(level);
    
  
    formatted += '<?xml version="1.0" encoding="UTF-8"?>\n';
    
    
    formatted += `${getIndent(indent)}<method>GET</method>\n`;
    
   
    formatted += `${getIndent(indent)}<args/>\n`;
    
    formatted += `${getIndent(indent)}<data>\n`;
    indent++;
    
    formatted += `${getIndent(indent)}<headers>\n`;
    indent++;
    
    if (data.headers) {
      Object.entries(data.headers).forEach(([key, value]) => {
        formatted += `${getIndent(indent)}<${key}>${value}</${key}>\n`;
      });
    }
    
    indent--;
    formatted += `${getIndent(indent)}</headers>\n`;
    
    if (data.path) {
      formatted += `${getIndent(indent)}<path>${data.path}</path>\n`;
    }
    
    if (data.isBase64Encoded !== undefined) {
      formatted += `${getIndent(indent)}<isBase64Encoded>${data.isBase64Encoded}</isBase64Encoded>\n`;
    }
    
    indent--;
    formatted += `${getIndent(indent)}</data>`;
    
    return formatted;
  };

  const renderFormattedXML = (xmlString) => {
    return xmlString.split('\n').map((line, index) => {
      const indent = line.match(/^\s*/)[0].length;
      const lineContent = line.trim();
      
      const colorize = (content) => {
        if (content.startsWith('<?xml')) {
          return (
            <span className="text-gray-500 dark:text-gray-400">{content}</span>
          );
        }
        
        const tagMatch = content.match(/^<\/?([^>]+)>/);
        if (tagMatch) {
          const isClosingTag = content.startsWith('</');
          const isSelfClosingTag = content.endsWith('/>');
          const tagName = tagMatch[1];
          const value = content.slice(tagMatch[0].length, isSelfClosingTag ? -2 : -tagName.length - 3);
          
          return (
            <span>
              <span className="text-blue-600 dark:text-blue-400">{isClosingTag ? '</' : '<'}</span>
              <span className="text-purple-600 dark:text-purple-400">{tagName}</span>
              <span className="text-blue-600 dark:text-blue-400">{isSelfClosingTag ? '/>' : '>'}</span>
              {value && <span className="text-gray-700 dark:text-gray-300">{value}</span>}
              {!isSelfClosingTag && value && (
                <>
                  <span className="text-blue-600 dark:text-blue-400">{'</'}</span>
                  <span className="text-purple-600 dark:text-purple-400">{tagName}</span>
                  <span className="text-blue-600 dark:text-blue-400">{'>'}</span>
                </>
              )}
            </span>
          );
        }
        
        return <span className="text-gray-700 dark:text-gray-300">{content}</span>;
      };

      return (
        <div 
          key={index} 
          className="font-sans font-semibold text-sm leading-6 whitespace-pre"
          style={{ paddingLeft: `${indent}ch` }}
        >
          {colorize(lineContent)}
        </div>
      );
    });
  };

  const xmlString = formatXML(data);
  
  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
      {renderFormattedXML(xmlString)}
    </div>
  );
};
const ResponsePanel = ({ api }) => {
  const [height, setHeight] = useState(384);
  const [isDragging, setIsDragging] = useState(false);
  const [viewFormat, setViewFormat] = useState('highlighted');
  const [copiedHeader, setCopiedHeader] = useState(null);
  const dragRef = useRef(null);
  const startDragY = useRef(0);
  const startHeight = useRef(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    startDragY.current = e.clientY;
    startHeight.current = height;
  };


  const renderLoader = () => (
    <div className="flex items-center justify-center h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4 mt-20">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '100ms'}} />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '200ms'}} />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">Loading response...</p>
      </div>
    </div>
  );
  

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const delta = startDragY.current - e.clientY;
      const newHeight = Math.max(200, Math.min(800, startHeight.current + delta));
      setHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleCopyHeader = async (key, value) => {
    await navigator.clipboard.writeText(`${key}: ${value}`);
    setCopiedHeader(key);
    setTimeout(() => setCopiedHeader(null), 2000);
  };

  const handleDownloadResponse = () => {
    const responseStr = JSON.stringify(api.responseData.data, null, 2);
    const blob = new Blob([responseStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'response.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyResponse = () => {
    let textToCopy;
    switch (viewFormat) {
      case 'pretty':
        textToCopy = JSON.stringify(api.responseData.data, null, 2);
        break;
      case 'raw':
        textToCopy = JSON.stringify(api.responseData.data);
        break;
      case 'xml':
        const xml = require('xml-js');
        textToCopy = xml.js2xml(api.responseData.data, { compact: true, spaces: 2 });
        break;
      default:
        textToCopy = JSON.stringify(api.responseData.data, null, 2);
    }
    navigator.clipboard.writeText(textToCopy);
  };
  const renderResponseContent = () => {
    if (api?.isLoading) {
      return renderLoader();
    }
  
    if (!api?.responseData) {
      return null;
    }
  
    // Enhanced error rendering
    if (api.responseData.error) {
      return (
        <div className="space-y-2">
          <div className="text-red-500 dark:text-red-400 font-medium">
            {api.responseData.error}
          </div>
          {api.responseData.details && (
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              <div className="font-medium mb-1">Error Details:</div>
              {typeof api.responseData.details === 'object' ? (
                <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  {JSON.stringify(api.responseData.details, null, 2)}
                </pre>
              ) : (
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  {api.responseData.details}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
  
    // Only proceed with data rendering if we have data
    if (!api.responseData.data) {
      return null;
    }
  
    switch (viewFormat) {
      case 'highlighted':
        return <JsonHighlighter data={api.responseData.data} />;
      case 'pretty':
        return <PrettyJson data={api.responseData.data} />;
      case 'raw':
        return <RawView data={api.responseData.data} />;
      case 'xml':
        return <XMLView data={api.responseData.data} />;
      default:
        return <JsonHighlighter data={api.responseData.data} />;
    }
  };

  if (!api) return null;

  return (
    <div 
      style={{ height: `${height}px` }}
      className="border-t border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-150"
    >
      <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <div 
            ref={dragRef}
            className="cursor-ns-resize hover:bg-blue-500/10 rounded-full p-1 transition-colors"
            onMouseDown={handleMouseDown}
          >
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Response</h3>
          {api.responseData && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              api.responseData.status < 400 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
            }`}>
              {api.responseData.status}
            </span>
          )}
        </div>
        
        {api.responseData && (
          <div className="flex items-center space-x-6">
            <div className="flex flex-col text-sm text-gray-600 dark:text-gray-300">
              <span>{((api.responseData.size || 0) / 1024).toFixed(1)} KB</span>
              <span>{api.responseData.responseTime}ms</span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleCopyResponse}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Copy Response"
              >
                <Copy className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              <button 
                onClick={handleDownloadResponse}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Download Response"
              >
                <Download className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex px-6 space-x-1">
          {['Body', 'Headers', 'Analytics'].map((tab) => {
            const isActive = api.activeResponseTab === `response-${tab.toLowerCase()}`;
            return (
              <button
                key={tab}
                onClick={() => updateApiState(activeFolderId, activeApiId, { 
                  activeResponseTab: `response-${tab.toLowerCase()}` 
                })}
                className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors relative ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-900'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {api.activeResponseTab === 'response-body' && (
        <div className="flex font-sans space-x-2 p-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'highlighted', label: 'JSON' },
            { id: 'pretty', label: 'Pretty' },
            { id: 'raw', label: 'Raw' },
            { id: 'xml', label: 'XML' }
          ].map((format) => (
            <button
              key={format.id}
              onClick={() => setViewFormat(format.id)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewFormat === format.id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {format.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-auto relative font-sans">
        {(api.isLoading || api.responseData) ? (
          <>
            {api.activeResponseTab === 'response-body' && (
              <div className="p-6 bg-white dark:bg-gray-900 min-h-full font-sans">
                {renderResponseContent()}
              </div>
            )}
            {api.activeResponseTab === 'response-headers' && (
              <div className="p-6 bg-white dark:bg-gray-900">
                {api.isLoading ? renderLoader() : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Header</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Value</th>
                        <th className="w-16"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(api.responseData?.headers || {}).map(([key, value]) => (
                        <tr key={key} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3 px-4 font-sans font-semibold text-sm text-rose-600 dark:text-rose-400">{key}</td>
                          <td className="py-3 px-4 font-sans font-semibold text-sm text-violet-600 dark:text-violet-400">{value}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleCopyHeader(key, value)}
                              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              {copiedHeader === key ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
            {api.activeResponseTab === 'response-analytics' && (
              <div className="h-full">
                {api.isLoading ? renderLoader() : <ResponseAnalytics api={api} />}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-4 text-gray-400 dark:text-gray-500">
            <ExternalLink className="w-12 h-12" />
            <p className="text-sm">Send a request to see the response</p>
          </div>
        )}
      </div>
    </div>
  );
};


      const methodColors = {
        GET: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
        POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
        PUT: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
        DELETE: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
        PATCH: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
      };
    
      const renderRequestPanel = () => {
        const api = getActiveApi();
        if (!api) return null;
      
        // Safe check utility function
        const safeGet = (obj, path) => {
          return path.split('.').reduce((acc, part) => acc && acc[part], obj) ?? null;
        };
      
        const hasParams = () => {
          return Array.isArray(api.queryParams) && 
            api.queryParams.some(param => param?.key || param?.value);
        };
      
        const hasAuth = () => {
          if (!api.auth) return false;
          
          return api.auth.type !== 'none' && (
            api.auth.bearer || 
            safeGet(api.auth, 'basic.username') || 
            safeGet(api.auth, 'basic.password') ||
            api.auth.apiKey
          );
        };
      
        const hasHeaders = () => {
          return Array.isArray(api.headers) && 
            api.headers.some(header => header?.key || header?.value);
        };
      
        const hasScripts = () => {
          return Boolean(
            safeGet(api, 'scripts.preRequest')?.trim() || 
            safeGet(api, 'scripts.tests')?.trim()
          );
        };
      
        const hasBody = () => {
          if (!api.body) return false;
          
          switch (api.body.type) {
            case 'raw':
              return Boolean(api.body.content?.trim());
            case 'formData':
              return Array.isArray(api.body.formData) && 
                api.body.formData.some(item => item?.key?.trim() || item?.value?.trim());
            case 'urlencoded':
              return Array.isArray(api.body.urlencoded) && 
                api.body.urlencoded.some(item => item?.key?.trim() || item?.value?.trim());
            default:
              return false;
          }
        };
      
        const hasSettings = () => {
          if (!api.settings) return false;
          
          const defaultSettings = {
            followRedirects: true,
            sslVerification: true,
            timeout: 0,
            responseSizeLimit: 50,
            saveResponses: true,
            enableProxy: false,
            proxyUrl: '',
            proxyAuth: false,
            proxyUsername: '',
            proxyPassword: ''
          };
      
          return Object.entries(defaultSettings).some(([key, defaultValue]) => {
            const currentValue = api.settings[key];
            return currentValue !== undefined && currentValue !== defaultValue;
          });
        };
      
        const clearConsole = () => {
          setConsoleOutput([]);
        };
      
        const runScript = async () => {
          const script = scriptType === 'pre-request' ? 
            safeGet(api, 'scripts.preRequest') || '' : 
            safeGet(api, 'scripts.tests') || '';
          
          clearConsole();
      
          try {
            const sandbox = {
              pm: {
                environment: new Map(),
                request: {
                  method: api.method || 'GET',
                  url: api.url || '',
                  headers: (api.headers || []).reduce((acc, h) => ({ 
                    ...acc, 
                    [h?.key || '']: h?.value || '' 
                  }), {})
                },
                response: null,
                test: (name, fn) => {
                  try {
                    fn();
                    sandbox.pm.log('✓ ' + name, 'success');
                  } catch (error) {
                    sandbox.pm.log('✗ ' + name + ': ' + error.message, 'error');
                  }
                },
                expect: (value) => ({
                  to: {
                    equal: (expected) => {
                      if (value !== expected) throw new Error(`Expected ${expected} but got ${value}`);
                    },
                    be: {
                      true: () => {
                        if (value !== true) throw new Error(`Expected true but got ${value}`);
                      },
                      false: () => {
                        if (value !== false) throw new Error(`Expected false but got ${value}`);
                      }
                    }
                  }
                }),
                log: (message, type = 'info') => {
                  setConsoleOutput(prev => [...prev, { type, message }]);
                }
              }
            };
      
            if (scriptType === 'test') {
              try {
                const response = await fetch(api.url || '');
                const data = await response.json();
                sandbox.pm.response = {
                  json: () => data,
                  status: response.status,
                  headers: Object.fromEntries(response.headers.entries()),
                  to: {
                    have: {
                      status: (expectedStatus) => {
                        if (response.status !== expectedStatus) {
                          throw new Error(`Expected status ${expectedStatus} but got ${response.status}`);
                        }
                      },
                      header: (headerName) => {
                        if (!response.headers.has(headerName)) {
                          throw new Error(`Expected header ${headerName} to exist`);
                        }
                        return true;
                      }
                    }
                  }
                };
              } catch (error) {
                setConsoleOutput(prev => [...prev, { 
                  type: 'error', 
                  message: `Failed to make API call: ${error.message}` 
                }]);
                return;
              }
            }
      
            const fn = new Function('pm', script);
            fn(sandbox.pm);
      
          } catch (error) {
            setConsoleOutput(prev => [...prev, { 
              type: 'error', 
              message: `Script execution error: ${error.message}` 
            }]);
          }
        };
      

        
        // Update the handleAuthTypeChange function
        const handleAuthTypeChange = async (e) => {
          const value = e.target.value;
          
          if (value.startsWith('template_')) {
            const templateId = value.replace('template_', '');
            const selectedTemplate = dbTemplates.find(t => t._id === templateId);
            
            if (selectedTemplate) {
              updateApiState(activeFolderId, activeApiId, {
                auth: {
                  type: 'config-jwt',
                  jwt: {
                    pairs: selectedTemplate.pairs || []
                  }
                }
              });
            }
          } else {
            updateApiState(activeFolderId, activeApiId, {
              auth: {
                ...api.auth,
                type: value
              }
            });
          }
        };
        
   return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">

    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <select 
        value={api.method}
        onChange={(e) => updateApiState(activeFolderId, activeApiId, { method: e.target.value })}
        className={`px-3 py-2 rounded-md font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${methodColors[api.method]} border-0`}
      >
        <option>GET</option>
        <option>POST</option>
        <option>PUT</option>
        <option>DELETE</option>
        <option>PATCH</option>
      </select>
      
      <div className="flex-1 relative">
        <input
          type="text"
          value={api.url}
          onChange={(e) => updateApiState(activeFolderId, activeApiId, { url: e.target.value })}
          placeholder="Enter request URL"
          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
        />
      </div>

      <button 
        onClick={handleSend}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center space-x-2"
      >
        <Send className="w-4 h-4" />
        <span>Send</span>
      </button>
    </div>
    <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
        {[
  { name: 'Params', icon: Database, hasContent: hasParams() },
  { name: 'Authorization', icon: Lock, hasContent: hasAuth() },
  { name: 'Headers', icon: Code, hasContent: hasHeaders() },
  { name: 'Body', icon: CodeSquare, hasContent: hasBody() },
  { name: 'Scripts', icon: Terminal, hasContent: hasScripts() },
  { name: 'Settings', icon: Settings, hasContent: hasSettings() }
].map(({ name, icon: Icon, hasContent }) => (
  <button
    key={name}
    onClick={() => setActiveTab(name.toLowerCase())}
    className={`relative flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors duration-150 ease-in-out
      ${activeTab === name.toLowerCase()
        ? 'border-b-2 border-blue-500 text-blue-500 dark:text-blue-400'
        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
      }`}
  >
    <Icon className="w-4 h-4" />
    <span>{name}</span>
    {hasContent && (
      <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
    )}
  </button>
))}
        </div>
      </div>

    <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-800">
      {activeTab === 'params' && (
        <div className="space-y-3">
          {api.queryParams.map((param, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="text"
                placeholder="Key"
                value={param.key}
                onChange={(e) => {
                  const newParams = [...api.queryParams];
                  newParams[index].key = e.target.value;
                  updateApiState(activeFolderId, activeApiId, { queryParams: newParams });
                }}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Value"
                value={param.value}
                onChange={(e) => {
                  const newParams = [...api.queryParams];
                  newParams[index].value = e.target.value;
                  updateApiState(activeFolderId, activeApiId, { queryParams: newParams });
                }}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
              <button
                onClick={() => {
                  const newParams = api.queryParams.filter((_, i) => i !== index);
                  updateApiState(activeFolderId, activeApiId, { queryParams: newParams });
                }}
                className="p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors duration-150"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            onClick={() => updateApiState(activeFolderId, activeApiId, {
              queryParams: [...api.queryParams, { key: '', value: '' }]
            })}
            className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors duration-150"
          >
            <Plus className="w-4 h-4" />
            <span>Add Parameter</span>
          </button>
        </div>
      )}
      {activeTab === 'authorization' && (
        <div className="space-y-3">
        <select
  value={api.auth.type}
  onChange={handleAuthTypeChange}
  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
>
  <option value="none">No Auth</option>
  <option value="config-jwt">Config JWT</option>
  <option value="avq-jwt">AVQ JWT</option>
  {dbTemplates.length > 0 && (
    <optgroup label="Saved Templates">
      {dbTemplates.map(template => (
        <option key={template._id} value={`template_${template._id}`}>
          Template: {template.name}
        </option>
      ))}
    </optgroup>
  )}
</select>

      {api.auth.type === 'config-jwt' && (
        <div className="space-y-3">
          <div className="flex space-x-2">
            {api.auth.jwt?.pairs ? (
              // Display template pairs if they exist
              <div className="w-full space-y-2">
                {api.auth.jwt.pairs.map((pair, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Key"
                      value={pair.key || ''}
                      onChange={(e) => {
                        const newPairs = [...api.auth.jwt.pairs];
                        newPairs[index] = { ...pair, key: e.target.value };
                        updateApiState(activeFolderId, activeApiId, {
                          auth: { 
                            ...api.auth, 
                            jwt: { ...api.auth.jwt, pairs: newPairs }
                          }
                        });
                      }}
                      className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={pair.value || ''}
                      onChange={(e) => {
                        const newPairs = [...api.auth.jwt.pairs];
                        newPairs[index] = { ...pair, value: e.target.value };
                        updateApiState(activeFolderId, activeApiId, {
                          auth: { 
                            ...api.auth, 
                            jwt: { ...api.auth.jwt, pairs: newPairs }
                          }
                        });
                      }}
                      className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            ) : (
              // Display single key-value pair if no template is selected
              <>
                <input
                  type="text"
                  placeholder="Key"
                  value={api.auth.jwt?.key || ''}
                  onChange={(e) => updateApiState(activeFolderId, activeApiId, {
                    auth: { 
                      ...api.auth, 
                      jwt: { ...api.auth.jwt, key: e.target.value }
                    }
                  })}
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={api.auth.jwt?.value || ''}
                  onChange={(e) => updateApiState(activeFolderId, activeApiId, {
                    auth: { 
                      ...api.auth, 
                      jwt: { ...api.auth.jwt, value: e.target.value }
                    }
                  })}
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                />
              </>
            )}
          </div>
        </div>
      )}

      {api.auth.type === 'avq-jwt' && (
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Value"
              value={api.auth.avqJwt?.value || ''}
              onChange={(e) => updateApiState(activeFolderId, activeApiId, {
                auth: { 
                  ...api.auth, 
                  avqJwt: { value: e.target.value }
                }
              })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
)}

{activeTab === 'settings' && (
  <div className="space-y-6 p-4">
    {/* Request Settings */}
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Request Settings</h3>
      
      <div className="space-y-3">
        <Checkbox
          label="Follow Redirects"
          checked={api.settings?.followRedirects ?? true}
          onChange={(checked) => updateApiState(activeFolderId, activeApiId, {
            settings: { ...api.settings, followRedirects: checked }
          })}
        />

        <Checkbox
          label="SSL Certificate Verification"
          checked={api.settings?.sslVerification ?? true}
          onChange={(checked) => updateApiState(activeFolderId, activeApiId, {
            settings: { ...api.settings, sslVerification: checked }
          })}
        />

        <div>
          <label className="text-sm font-medium">Request Timeout (ms)</label>
          <input
            type="number"
            value={api.settings?.timeout ?? 0}
            onChange={(e) => updateApiState(activeFolderId, activeApiId, {
              settings: { ...api.settings, timeout: parseInt(e.target.value) }
            })}
            className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
            min="0"
          />
        </div>
      </div>
    </div>

    {/* Response Settings */}
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Response Settings</h3>
      
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium">Response Size Limit (MB)</label>
          <input
            type="number"
            value={api.settings?.responseSizeLimit ?? 50}
            onChange={(e) => updateApiState(activeFolderId, activeApiId, {
              settings: { ...api.settings, responseSizeLimit: parseInt(e.target.value) }
            })}
            className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
            min="1"
          />
        </div>

        <Checkbox
          label="Save Response History"
          checked={api.settings?.saveResponses ?? true}
          onChange={(checked) => updateApiState(activeFolderId, activeApiId, {
            settings: { ...api.settings, saveResponses: checked }
          })}
        />
      </div>
    </div>

    {/* Proxy Settings */}
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Proxy Settings</h3>
      
      <div className="space-y-3">
        <Checkbox
          label="Enable Proxy"
          checked={api.settings?.enableProxy ?? false}
          onChange={(checked) => updateApiState(activeFolderId, activeApiId, {
            settings: { ...api.settings, enableProxy: checked }
          })}
        />

        {api.settings?.enableProxy && (
          <>
            <div>
              <label className="text-sm font-medium">Proxy URL</label>
              <input
                type="text"
                value={api.settings?.proxyUrl ?? ''}
                onChange={(e) => updateApiState(activeFolderId, activeApiId, {
                  settings: { ...api.settings, proxyUrl: e.target.value }
                })}
                placeholder="http://proxy-server:port"
                className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
              />
            </div>

            <Checkbox
              label="Proxy Authentication"
              checked={api.settings?.proxyAuth ?? false}
              onChange={(checked) => updateApiState(activeFolderId, activeApiId, {
                settings: { ...api.settings, proxyAuth: checked }
              })}
            />

            {api.settings?.proxyAuth && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={api.settings?.proxyUsername ?? ''}
                  onChange={(e) => updateApiState(activeFolderId, activeApiId, {
                    settings: { ...api.settings, proxyUsername: e.target.value }
                  })}
                  placeholder="Username"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                />
                <input
                  type="password"
                  value={api.settings?.proxyPassword ?? ''}
                  onChange={(e) => updateApiState(activeFolderId, activeApiId, {
                    settings: { ...api.settings, proxyPassword: e.target.value }
                  })}
                  placeholder="Password"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  </div>
)}

{activeTab === 'headers' && (
  <div className="space-y-3">
    {api.headers.map((header, index) => (
      <div key={index} className="flex space-x-2">
        <input
          type="text"
          placeholder="Key"
          value={header.key}
          onChange={(e) => {
            const newHeaders = [...api.headers];
            newHeaders[index].key = e.target.value;
            updateApiState(activeFolderId, activeApiId, { headers: newHeaders });
          }}
          className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Value"
          value={header.value}
          onChange={(e) => {
            const newHeaders = [...api.headers];
            newHeaders[index].value = e.target.value;
            updateApiState(activeFolderId, activeApiId, { headers: newHeaders });
          }}
          className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
        />
        <button
          onClick={() => {
            const newHeaders = api.headers.filter((_, i) => i !== index);
            updateApiState(activeFolderId, activeApiId, { headers: newHeaders });
          }}
          className="p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors duration-150"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    ))}
    <button
      onClick={() => updateApiState(activeFolderId, activeApiId, {
        headers: [...api.headers, { key: '', value: '' }]
      })}
      className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors duration-150"
    >
      <Plus className="w-4 h-4" />
      <span>Add Header</span>
    </button>
  </div>
)}
{activeTab === 'scripts' && (
  <div className="flex flex-col space-y-2 p-6 font-sans">
 
    <div className="flex space-x-3 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-lg w-fit">
      <button
        onClick={() => setScriptType('pre-request')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          scriptType === 'pre-request'
            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
      >
        Pre-request Script
      </button>
      <button
        onClick={() => setScriptType('test')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          scriptType === 'test'
            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
      >
        Tests
      </button>
    </div>

    <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 ml-3">
            {scriptType === 'pre-request' ? 'Pre-request Script' : 'Test Script'}
          </span>
        </div>
      </div>
      <textarea
        value={scriptType === 'pre-request' ? api.scripts.preRequest : api.scripts.tests}
        onChange={(e) => {
          const newScripts = { ...api.scripts };
          if (scriptType === 'pre-request') {
            newScripts.preRequest = e.target.value;
          } else {
            newScripts.tests = e.target.value;
          }
          updateApiState(activeFolderId, activeApiId, { scripts: newScripts });
        }}
        className="w-full h-64 p-4 font-mono text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none"
        placeholder={scriptType === 'pre-request' 
          ? "// Pre-request script example:\npm.environment.set('timestamp', Date.now());"
          : "// Test script example:\npm.test('Status test', () => {\n  pm.response.to.have.status(200);\n});"
        }
        spellCheck="false"
      />
    </div>

    <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Console</span>
        </div>
        <button
          onClick={clearConsole}
          className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-150"
        >
          Clear Console
        </button>
      </div>
      <div className="h-40 overflow-auto p-4 font-mono text-sm bg-white dark:bg-gray-900">
        {consoleOutput.map((log, index) => (
          <div
            key={index}
            className={`mb-1.5 flex items-start space-x-2 ${
              log.type === 'error'
                ? 'text-red-500 dark:text-red-400'
                : log.type === 'success'
                ? 'text-green-500 dark:text-green-400'
                : 'text-blue-500 dark:text-blue-400'
            }`}
          >
            <span className="select-none">›</span>
            <span className="flex-1">{log.message}</span>
          </div>
        ))}
      </div>
    </div>

    <button
      onClick={runScript}
      className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-150 font-medium text-sm w-full sm:w-auto"
    >
      <Play className="w-4 h-4" />
      <span>Run Script</span>
    </button>
  </div>
)}
{activeTab === 'body' && (
  <div className="space-y-4">
    <select
      value={api.body.type}
      onChange={(e) => updateApiState(activeFolderId, activeApiId, {
        body: { ...api.body, type: e.target.value }
      })}
      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
    >
      <option value="none">None</option>
      <option value="raw">Raw</option>
      <option value="formData">Form Data</option>
      <option value="urlencoded">x-www-form-urlencoded</option>
    </select>

    {api.body.type === 'raw' && (
      <textarea
        value={api.body.content}
        onChange={(e) => updateApiState(activeFolderId, activeApiId, {
          body: { ...api.body, content: e.target.value }
        })}
        placeholder="Enter raw body (JSON, XML, etc.)"
        className="w-full h-64 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
      />
    )}

    {api.body.type === 'formData' && (
      <div className="space-y-3">
        {api.body.formData.map((item, index) => (
          <div key={index} className="flex space-x-2">
            <input
              type="text"
              placeholder="Key"
              value={item.key}
              onChange={(e) => {
                const newFormData = [...api.body.formData];
                newFormData[index].key = e.target.value;
                updateApiState(activeFolderId, activeApiId, {
                  body: { ...api.body, formData: newFormData }
                });
              }}
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Value"
              value={item.value}
              onChange={(e) => {
                const newFormData = [...api.body.formData];
                newFormData[index].value = e.target.value;
                updateApiState(activeFolderId, activeApiId, {
                  body: { ...api.body, formData: newFormData }
                });
              }}
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
            <button
              onClick={() => {
                const newFormData = api.body.formData.filter((_, i) => i !== index);
                updateApiState(activeFolderId, activeApiId, {
                  body: { ...api.body, formData: newFormData }
                });
              }}
              className="p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors duration-150"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
        <button
          onClick={() => updateApiState(activeFolderId, activeApiId, {
            body: {
              ...api.body,
              formData: [...api.body.formData, { key: '', value: '' }]
            }
          })}
          className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors duration-150"
        >
          <Plus className="w-4 h-4" />
          <span>Add Form Field</span>
        </button>
      </div>
    )}

    {api.body.type === 'urlencoded' && (
      <div className="space-y-3">
        {api.body.urlencoded.map((item, index) => (
          <div key={index} className="flex space-x-2">
            <input
              type="text"
              placeholder="Key"
              value={item.key}
              onChange={(e) => {
                const newUrlencoded = [...api.body.urlencoded];
                newUrlencoded[index].key = e.target.value;
                updateApiState(activeFolderId, activeApiId, {
                  body: { ...api.body, urlencoded: newUrlencoded }
                });
              }}
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Value"
              value={item.value}
              onChange={(e) => {
                const newUrlencoded = [...api.body.urlencoded];
                newUrlencoded[index].value = e.target.value;
                updateApiState(activeFolderId, activeApiId, {
                  body: { ...api.body, urlencoded: newUrlencoded }
                });
              }}
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
            <button
              onClick={() => {
                const newUrlencoded = api.body.urlencoded.filter((_, i) => i !== index);
                updateApiState(activeFolderId, activeApiId, {
                  body: { ...api.body, urlencoded: newUrlencoded }
                });
              }}
              className="p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors duration-150"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
        <button
          onClick={() => updateApiState(activeFolderId, activeApiId, {
            body: {
              ...api.body,
              urlencoded: [...api.body.urlencoded, { key: '', value: '' }]
            }
          })}
          className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors duration-150"
        >
          <Plus className="w-4 h-4" />
          <span>Add URL Encoded Field</span>
        </button>
      </div>
    )}
  </div>
)}
        </div>
        <ResponsePanel api={api} />
    </div>
  );
};
return (
  <div className={`h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>

      <header className="h-14 flex-shrink-0 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center">
            {isMobile && (
              <button
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="mr-4"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <img src={logo} alt="Logo" className="h-8" />
          </div>

          <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
          <button
            onClick={createNewFolder}
            className="p-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-md flex items-center"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">New Collection</span>
          </button>
        </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5  text-blue-400" />}
            </button>
            <button
            onClick={handleSignOut}
            className="p-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-md flex items-center"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>
      <ApiTabs 
    collections={collections}
    activeFolderId={activeFolderId}
    activeApiId={activeApiId}
    createNewApi={createNewApi}
    openNewTab={openNewTab}
    handleDelete={handleDelete}
  />

      
      <div className="flex-1 flex overflow-hidden">
     
        {isMobile ? (
         
          <div className={`
            fixed inset-y-0 left-0 z-50 w-64
            ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            transition-transform duration-300 ease-in-out
            bg-gray-50 dark:bg-gray-900
            flex
          `}>
            
           
            <div className="w-14 flex-shrink-0 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    if (item.id === 'collections' || item.id === 'environments' || item.id === 'history' || item.id === 'settings') {
                     
                    } else {
                      setIsMobileSidebarOpen(false);
                    }
                  }}
                  className={`
                    w-full p-3 flex items-center justify-center
                    ${activeSection === item.id ? 'bg-blue-50 dark:bg-blue-900 dark:text-white' : ''}
                    hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white
                  `}
                >
                  <item.icon className="w-5 h-5" />
                </button>
              ))}
            </div>

            
            <div className="flex-1 overflow-y-auto dark:text-white">
              {renderSidebarContent()}
            </div>
          </div>
        ) : (
        <ResizableBox
          width={isLeftSidebarCollapsed ? MIN_LEFT_SIDEBAR_WIDTH : leftSidebarWidth}
          height={Infinity}
          minConstraints={[MIN_LEFT_SIDEBAR_WIDTH, Infinity]}
          maxConstraints={[MAX_LEFT_SIDEBAR_WIDTH, Infinity]}
          onResize={handleLeftResize}
          axis="x"
          handle={
            <div className="w-1 cursor-col-resize hover:bg-blue-500 active:bg-blue-600 ">
              <div className="w-1 h-full bg-gray-200 dark:bg-gray-700" />
            </div>
          }
          className={`
            ${isMobile ? (isMobileSidebarOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden') : 'relative'}
            flex
            bg-gray-50 dark:bg-gray-900
            transform transition-transform duration-300
            ${isLeftSidebarCollapsed ? 'translate-x-0' : ''}
          `}
        >
        
          <div className="w-14 flex-shrink-0 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`
                  w-full p-3 flex items-center justify-center
                  ${activeSection === item.id ? 'bg-blue-50 dark:bg-blue-900 dark:text-white' : ''}
                  hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white
                `}
              >
                <item.icon className="w-5 h-5" />
              </button>
            ))}
          </div>

         
          <div className="flex-1 overflow-y-auto dark:text-white">
            {renderSidebarContent()}
          </div>
        </ResizableBox>
      )}

        {/* Main Panel */}
      {/* Main Panel */}
<main className="flex-1 bg-white dark:bg-gray-800 overflow-auto">
  {activeSection === 'authTemplates' ? (
    <AuthTemplateManager 
      activeFolderId={activeFolderId}
      activeApiId={activeApiId}
      updateApiState={updateApiState} 
    />
  ) : activeSection === 'environments' ? (
    <EnvironmentManagementPanel 
      environments={environments}
      activeEnvironment={activeEnvironment}
      onEnvChange={handleEnvironmentChange}
      onAddEnv={handleAddEnvironment}
      onDeleteEnv={handleDeleteEnvironment}
      onUpdateEnv={handleUpdateEnvironment}
      onClose={() => setActiveSection(null)}
    />
  ) : activeSection === 'history' ? (
    <RequestHistoryPanel 
      collections={collections}
      className="w-full"
    />
  ) : activeFolderId && activeApiId ? (
    isPerformanceTesting ? (
      <PerformanceTestingPanel
        collections={collections}
        activeEnvironment={activeEnvironment}
        onClose={() => setIsPerformanceTesting(false)}
        initialApi={getActiveApi()}
        initialCollection={collections.find(c => c.id === activeFolderId)}
      />
    ) : (
      renderRequestPanel()
    )
  ) : (
    <div className="flex flex-col items-center justify-center h-full">
      <Send className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
      <p className="text-gray-500 dark:text-gray-400">Select a request or create a new one</p>
    </div>
  )}
</main>

        
        {!isMobile && (
          <div className=" bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex">
        
            <div className="w-14 flex-shrink-0 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
              {rightNavigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveRightSection(item.id)}
                  className={`
                    w-full p-3 flex items-center justify-center
                    ${activeRightSection === item.id ? 'bg-blue-50 dark:bg-blue-900  dark:text-white' : ''}
                    hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white
                  `}
                >
                  <item.icon className="w-5 h-5" />
                </button>
              ))}
            </div>

          
          </div>
        )}
      </div>

   
      {isMobile && isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <footer className="h-7 flex-shrink-0 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 relative">
      <div className="flex items-center justify-between h-full px-2 text-xs text-gray-600 dark:text-gray-400">
       
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center space-x-1">
            <Dot className="w-4 h-4 text-green-500" fill="currentColor" />
            <span className="hidden sm:inline">Online</span>
          </div>
          <FooterButton icon={TerminalSquare} label="Console" />
          <FooterButton icon={Rotate3d} label="Postbot" />
        </div>

    
        <div className="flex items-center space-x-2">
         
          <div className="hidden md:flex items-center space-x-2">
            {mobileMenuItems.map((item, index) => (
              <FooterButton key={index} icon={item.icon} label={item.label} />
            ))}
          </div>

        
          <div className="relative md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  {mobileMenuItems.map((item, index) => (
                    <button
                      key={index}
                      className="w-full px-4 py-2 flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center space-x-1 ml-2">
            <Wifi className="w-3.5 h-3.5" />
            <span>45ms</span>
          </div>
        </div>
      </div>
    </footer>
    </div>
    
  );
};

export default App;