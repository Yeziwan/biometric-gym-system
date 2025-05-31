import React, { useState, useEffect } from 'react';
import { User, Edit, Trash2, Fingerprint, Search, Plus } from 'lucide-react';
import { fetchMembers, deleteMember } from '../../services/memberService';

const MemberList = ({ onEdit, onEnrollFingerprint }) => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // 加载会员列表
  useEffect(() => {
    const loadMembers = async () => {
      setIsLoading(true);
      try {
        const data = await fetchMembers();
        setMembers(data);
      } catch (error) {
        console.error('获取会员列表失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMembers();
  }, []);

  // 处理删除会员
  const handleDelete = async (memberId) => {
    try {
      await deleteMember(memberId);
      setMembers(members.filter(member => member.id !== memberId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('删除会员失败:', error);
      alert('删除会员失败，请重试');
    }
  };

  // 过滤会员列表
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">会员列表</h3>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="搜索会员..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                会员信息
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                联系方式
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                指纹数量
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                最后识别
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
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  加载中...
                </td>
              </tr>
            ) : filteredMembers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  没有找到会员
                </td>
              </tr>
            ) : (
              filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">ID: {member.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{member.phone}</div>
                    <div className="text-sm text-gray-500">{member.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{member.fingerprint_count || 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {member.last_recognition ? new Date(member.last_recognition).toLocaleString('zh-CN') : '未识别'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {member.status === 'active' ? '活跃' : '禁用'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2 justify-end">
                      <button 
                        onClick={() => onEdit(member)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="编辑会员"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEnrollFingerprint(member.id)}
                        className="text-green-600 hover:text-green-900"
                        title="录入指纹"
                      >
                        <Fingerprint className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => setShowDeleteConfirm(member.id)}
                        className="text-red-600 hover:text-red-900"
                        title="删除会员"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* 删除确认对话框 */}
                    {showDeleteConfirm === member.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                        <p className="px-4 py-2 text-sm text-gray-700">确定要删除吗？</p>
                        <div className="flex justify-end px-4 py-2 space-x-2">
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
                          >
                            取消
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberList;
