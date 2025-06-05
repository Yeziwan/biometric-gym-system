import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  Fingerprint, 
  Monitor, 
  Settings, 
  Activity, 
  Shield, 
  Search,
  User,
  LogOut,
  Building,
  Clock,
  Calendar,
  UserPlus
} from 'lucide-react';

export const Layout = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Fingerprint className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">ZKTeco K40 Biometric System</h1>
            </div>
            <div className="flex items-center">
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                <User className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                <Settings className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 侧边导航 */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <nav className="space-y-1">
                <Link
                  to="/"
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                    isActive('/')
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Activity className="h-5 w-5 mr-3" />
                  Dashboard
                </Link>
                <Link
                  to="/recognition"
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                    isActive('/recognition')
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Search className="h-5 w-5 mr-3" />
                  Recognition Records
                </Link>
                <Link
                  to="/members"
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                    isActive('/members')
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Users className="h-5 w-5 mr-3" />
                  Member Management
                </Link>
                <Link
                  to="/devices"
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                    isActive('/devices')
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Monitor className="h-5 w-5 mr-3" />
                  Device Management
                </Link>
                <Link
                  to="/branches"
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                    isActive('/branches')
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Building className="h-5 w-5 mr-3" />
                  Branch Management
                </Link>
                <Link
                  to="/access-control"
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                    isActive('/access-control')
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Shield className="h-5 w-5 mr-3" />
                  Access Control
                </Link>
                <Link
                  to="/attendance"
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                    isActive('/attendance')
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Clock className="h-5 w-5 mr-3" />
                  Attendance Management
                </Link>
                <Link
                  to="/settings"
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                    isActive('/settings')
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  System Settings
                </Link>
              </nav>
            </div>
          </div>
          
          {/* 主内容区 */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
