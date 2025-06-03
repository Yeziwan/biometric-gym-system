import { create } from 'zustand';
import { memberAPI } from '../services/api';

const useMemberStore = create((set, get) => ({
  // 状态
  members: [],
  selectedMember: null,
  isLoading: false,
  error: null,
  
  // 获取所有会员
  fetchMembers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await memberAPI.getAllMembers();
      set({ members: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || '获取会员列表失败', 
        isLoading: false 
      });
    }
  },
  
  // 获取单个会员
  fetchMember: async (memberId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await memberAPI.getMember(memberId);
      set({ selectedMember: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || '获取会员详情失败', 
        isLoading: false 
      });
      return null;
    }
  },
  
  // 添加会员
  addMember: async (memberData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await memberAPI.addMember(memberData);
      set(state => ({ 
        members: [...state.members, response.data], 
        isLoading: false 
      }));
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || '添加会员失败', 
        isLoading: false 
      });
      return null;
    }
  },
  
  // 更新会员
  updateMember: async (memberId, memberData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await memberAPI.updateMember(memberId, memberData);
      set(state => ({
        members: state.members.map(member => 
          member.id === memberId ? response.data : member
        ),
        selectedMember: response.data,
        isLoading: false
      }));
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || '更新会员失败', 
        isLoading: false 
      });
      return null;
    }
  },
  
  // 删除会员
  deleteMember: async (memberId) => {
    set({ isLoading: true, error: null });
    try {
      await memberAPI.deleteMember(memberId);
      set(state => ({
        members: state.members.filter(member => member.id !== memberId),
        selectedMember: state.selectedMember?.id === memberId ? null : state.selectedMember,
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || '删除会员失败', 
        isLoading: false 
      });
      return false;
    }
  },
  
  // 注册会员生物特征
  enrollMember: async (enrollData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await memberAPI.enrollMember(enrollData);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || '会员注册失败', 
        isLoading: false 
      });
      return null;
    }
  },
  
  // 选择会员
  selectMember: (memberId) => {
    const member = get().members.find(m => m.id === memberId) || null;
    set({ selectedMember: member });
  },
  
  // 清除错误
  clearError: () => set({ error: null }),
}));

export default useMemberStore;
