import React, { useState, useEffect } from 'react';
import { Shield, Clock, Calendar, Users, Monitor, Search, Plus, Edit, Trash2 } from 'lucide-react';

const AccessControl = () => {
  const [activeTab, setActiveTab] = useState('logs');
  const [accessLogs, setAccessLogs] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [members, setMembers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);

  const [logFilters, setLogFilters] = useState({
    member_id: '',
    device_id: '',
    access_type: '',
    status: '',
    search: ''
  });

  const [permissionForm, setPermissionForm] = useState({
    member_id: '',
    device_id: '',
    permission_type: 'full',
    start_time: '',
    end_time: '',
    start_date: '',
    end_date: '',
    days_of_week: '1234567',
    status: 'active'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchAccessLogs(),
        fetchPermissions(),
        fetchMembers(),
        fetchDevices()
      ]);
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccessLogs = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(logFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await fetch(`http://localhost:8000/api/access/logs?${params}`);
      const data = await response.json();
      setAccessLogs(data);
    } catch (error) {
      console.error('获取访问日志失败:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/access/permissions');
      const data = await response.json();
      setPermissions(data);
    } catch (error) {
      console.error('获取权限列表失败:', error);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/members');
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error('获取会员列表失败:', error);
    }
  };

  const fetchDevices = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/devices');
      const data = await response.json();
      setDevices(data);
    } catch (error) {
      console.error('获取设备列表失败:', error);
    }
  };

  const handlePermissionSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingPermission 
        ? `http://localhost:8000/api/access/permissions/${editingPermission.id}`
        : 'http://localhost:8000/api/access/permissions';
      
      const method = editingPermission ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...permissionForm,
          member_id: parseInt(permissionForm.member_id),
          device_id: permissionForm.device_id ? parseInt(permissionForm.device_id) : null
        }),
      });

      if (response.ok) {
        fetchPermissions();
        setShowPermissionModal(false);
        resetPermissionForm();
      } else {
        const error = await response.json();
        alert(error.detail || '操作失败');
      }
    } catch (error) {
      console.error('提交失败:', error);
      alert('操作失败');
    }
  };

  const handleEditPermission = (permission) => {
    setEditingPermission(permission);
    setPermissionForm({
      member_id: permission.member_id.toString(),
      device_id: permission.device_id ? permission.device_id.toString() : '',
      permission_type: permission.permission_type,
      start_time: permission.start_time || '',
      end_time: permission.end_time || '',
      start_date: permission.start_date || '',
      end_date: permission.end_date || '',
      days_of_week: permission.days_of_week,
      status: permission.status
    });
    setShowPermissionModal(true);
  };

  const handleDeletePermission = async (permissionId) => {
    if (window.confirm('确定要删除这个权限吗？')) {
      try {
        const response = await fetch(`http://localhost:8000/api/access/permissions/${permissionId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchPermissions();
        } else {
          const error = await response.json();
          alert(error.detail || '删除失败');
        }
      } catch (error) {
        console.error('删除失败:', error);
        alert('删除失败');
      }
    }
  };

  const resetPermissionForm = () => {
    setPermissionForm({
      member_id: '',
      device_id: '',
      permission_type: 'full',
      start_time: '',
      end_time: '',
      start_date: '',
      end_date: '',
      days_of_week: '1234567',
      status: 'active'
    });
    setEditingPermission(null);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      allowed: { bg: 'bg-green-100', text: 'text-green-800', label: '允许' },
      denied: { bg: 'bg-red-100', text: 'text-red-800', label: '拒绝' }
    };
    
    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getAccessTypeBadge = (type) => {
    const typeConfig = {
      entry: { bg: 'bg-blue-100', text: 'text-blue-800', label: '进入' },
      exit: { bg: 'bg-orange-100', text: 'text-orange-800', label: '离开' }
    };
    
    const config = typeConfig[type] || { bg: 'bg-gray-100', text: 'text-gray-800', label: type };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getDaysOfWeekText = (daysStr) => {
    const dayNames = ['一', '二', '三', '四', '五', '六', '日'];
    const days = daysStr.split('').map(d => dayNames[parseInt(d) - 1]).join('、');
    return `周${days}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">访问控制</h2>
        <button
          onClick={() => {
            resetPermissionForm();
            setShowPermissionModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          添加权限
        </button>
      </div>

      {/* 标签页 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('logs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'logs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                访问日志
              </div>
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'permissions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                访问权限
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'logs' && (
            <div className="space-y-4">
              {/* 过滤器 */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <select
                  value={logFilters.member_id}
                  onChange={(e) => setLogFilters({...logFilters, member_id: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">所有会员</option>
                  {members.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>

                <select
                  value={logFilters.device_id}
                  onChange={(e) => setLogFilters({...logFilters, device_id: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">所有设备</option>
                  {devices.map(device => (
                    <option key={device.id} value={device.id}>{device.name}</option>
                  ))}
                </select>

                <select
                  value={logFilters.access_type}
                  onChange={(e) => setLogFilters({...logFilters, access_type: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">所有类型</option>
                  <option value="entry">进入</option>
                  <option value="exit">离开</option>
                </select>

                <select
                  value={logFilters.status}
                  onChange={(e) => setLogFilters({...logFilters, status: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">所有状态</option>
                  <option value="allowed">允许</option>
                  <option value="denied">拒绝</option>
                </select>

                <button
                  onClick={fetchAccessLogs}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  查询
                </button>
              </div>

              {/* 访问日志表格 */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        会员
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        设备
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        类型
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        时间
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        原因
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                          加载中...
                        </td>
                      </tr>
                    ) : accessLogs.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                          暂无访问日志
                        </td>
                      </tr>
                    ) : (
                      accessLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {log.member_name || '未识别'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{log.device_name}</div>
                          </td>
                          <td className="px-6 py-4">
                            {getAccessTypeBadge(log.access_type)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {formatTime(log.access_time)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(log.status)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500">
                              {log.reason || '-'}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="space-y-4">
              {/* 权限列表表格 */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        会员
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        设备
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        权限类型
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        时间限制
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        日期限制
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                          加载中...
                        </td>
                      </tr>
                    ) : permissions.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                          暂无权限配置
                        </td>
                      </tr>
                    ) : (
                      permissions.map((permission) => (
                        <tr key={permission.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {permission.member_name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {permission.device_name || '所有设备'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {permission.permission_type === 'full' ? '完全访问' : 
                               permission.permission_type === 'time_limited' ? '时间限制' : '区域限制'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {permission.start_time && permission.end_time 
                                ? `${permission.start_time} - ${permission.end_time}`
                                : '无限制'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {getDaysOfWeekText(permission.days_of_week)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {permission.start_date && permission.end_date 
                                ? `${permission.start_date} 至 ${permission.end_date}`
                                : '无限制'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              permission.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {permission.status === 'active' ? '活跃' : '停用'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditPermission(permission)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePermission(permission.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 添加/编辑权限模态框 */}
      {showPermissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingPermission ? '编辑访问权限' : '添加访问权限'}
            </h3>
            
            <form onSubmit={handlePermissionSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    会员 *
                  </label>
                  <select
                    required
                    value={permissionForm.member_id}
                    onChange={(e) => setPermissionForm({...permissionForm, member_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">选择会员</option>
                    {members.map(member => (
                      <option key={member.id} value={member.id}>{member.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    设备
                  </label>
                  <select
                    value={permissionForm.device_id}
                    onChange={(e) => setPermissionForm({...permissionForm, device_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">所有设备</option>
                    {devices.map(device => (
                      <option key={device.id} value={device.id}>{device.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    权限类型
                  </label>
                  <select
                    value={permissionForm.permission_type}
                    onChange={(e) => setPermissionForm({...permissionForm, permission_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="full">完全访问</option>
                    <option value="time_limited">时间限制</option>
                    <option value="area_limited">区域限制</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    状态
                  </label>
                  <select
                    value={permissionForm.status}
                    onChange={(e) => setPermissionForm({...permissionForm, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">活跃</option>
                    <option value="inactive">停用</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    开始时间
                  </label>
                  <input
                    type="time"
                    value={permissionForm.start_time}
                    onChange={(e) => setPermissionForm({...permissionForm, start_time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    结束时间
                  </label>
                  <input
                    type="time"
                    value={permissionForm.end_time}
                    onChange={(e) => setPermissionForm({...permissionForm, end_time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    开始日期
                  </label>
                  <input
                    type="date"
                    value={permissionForm.start_date}
                    onChange={(e) => setPermissionForm({...permissionForm, start_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    结束日期
                  </label>
                  <input
                    type="date"
                    value={permissionForm.end_date}
                    onChange={(e) => setPermissionForm({...permissionForm, end_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  允许访问的星期
                </label>
                <div className="flex gap-2">
                  {['一', '二', '三', '四', '五', '六', '日'].map((day, index) => {
                    const dayValue = (index + 1).toString();
                    const isSelected = permissionForm.days_of_week.includes(dayValue);
                    
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          const days = permissionForm.days_of_week;
                          const newDays = isSelected 
                            ? days.replace(dayValue, '')
                            : days + dayValue;
                          setPermissionForm({...permissionForm, days_of_week: newDays.split('').sort().join('')});
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          isSelected 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        周{day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPermissionModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingPermission ? '更新' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessControl; 