import React, { useState } from 'react';
import { Plus, User, X } from 'lucide-react';
import MemberList from '../../components/Member/MemberList';
import FingerprintEnrollment from '../../components/Fingerprint/FingerprintEnrollment';
import { createMember, updateMember } from '../../services/memberService';

const MemberManage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    status: 'active'
  });

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 打开编辑表单
  const handleEdit = (member) => {
    setCurrentMember(member);
    setFormData({
      name: member.name,
      phone: member.phone,
      email: member.email,
      status: member.status
    });
    setShowEditForm(true);
  };

  // 打开指纹录入表单
  const handleEnrollFingerprint = (memberId) => {
    setSelectedMemberId(memberId);
    setShowEnrollForm(true);
  };

  // 提交新增会员表单
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMember(formData);
      setShowAddForm(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        status: 'active'
      });
      // 刷新会员列表
      window.location.reload();
    } catch (error) {
      console.error('添加会员失败:', error);
      alert('添加会员失败，请重试');
    }
  };

  // 提交编辑会员表单
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMember(currentMember.id, formData);
      setShowEditForm(false);
      setCurrentMember(null);
      // 刷新会员列表
      window.location.reload();
    } catch (error) {
      console.error('更新会员失败:', error);
      alert('更新会员失败，请重试');
    }
  };

  // 指纹录入完成
  const handleEnrollmentComplete = () => {
    setShowEnrollForm(false);
    setSelectedMemberId(null);
    // 刷新会员列表
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">会员管理</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-1" />
          添加会员
        </button>
      </div>

      {/* 会员列表 */}
      <MemberList 
        onEdit={handleEdit} 
        onEnrollFingerprint={handleEnrollFingerprint} 
      />

      {/* 添加会员表单 */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">添加会员</h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    会员姓名
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    手机号码
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    电子邮箱
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    状态
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">活跃</option>
                    <option value="inactive">禁用</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <User className="h-5 w-5 mr-1" />
                  添加会员
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 编辑会员表单 */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">编辑会员</h3>
              <button 
                onClick={() => setShowEditForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    会员姓名
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    手机号码
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    电子邮箱
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    状态
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">活跃</option>
                    <option value="inactive">禁用</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <User className="h-5 w-5 mr-1" />
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 指纹录入表单 */}
      {showEnrollForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">指纹录入</h3>
              <button 
                onClick={() => setShowEnrollForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FingerprintEnrollment 
              memberId={selectedMemberId} 
              onComplete={handleEnrollmentComplete} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManage;
