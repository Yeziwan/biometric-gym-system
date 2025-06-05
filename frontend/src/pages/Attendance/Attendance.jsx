import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Users, TrendingUp, Download, Search, Filter } from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// 注册ChartJS组件
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Attendance = () => {
  const [activeTab, setActiveTab] = useState('records');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [dailySummary, setDailySummary] = useState(null);
  const [members, setMembers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [recordFilters, setRecordFilters] = useState({
    member_id: '',
    device_id: '',
    start_date: '',
    end_date: '',
    status: ''
  });

  const [statsFilters, setStatsFilters] = useState({
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30天前
    end_date: new Date().toISOString().split('T')[0], // 今天
    member_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchAttendanceRecords(),
        fetchMembers(),
        fetchDevices(),
        fetchDailySummary()
      ]);
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAttendanceRecords = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(recordFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await fetch(`http://localhost:8000/api/attendance/records?${params}`);
      const data = await response.json();
      setAttendanceRecords(data);
    } catch (error) {
      console.error('获取考勤记录失败:', error);
    }
  };

  const fetchAttendanceStats = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(statsFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await fetch(`http://localhost:8000/api/attendance/statistics?${params}`);
      const data = await response.json();
      setAttendanceStats(data);
    } catch (error) {
      console.error('获取考勤统计失败:', error);
    }
  };

  const fetchDailySummary = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/attendance/daily-summary');
      const data = await response.json();
      setDailySummary(data);
    } catch (error) {
      console.error('获取每日汇总失败:', error);
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

  const handleCheckInOut = async (memberId, deviceId, checkType) => {
    try {
      const response = await fetch('http://localhost:8000/api/attendance/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_id: memberId,
          device_id: deviceId,
          check_type: checkType
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert(result.message);
        fetchAttendanceRecords();
        fetchDailySummary();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('签到签退失败:', error);
      alert('操作失败');
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('zh-CN');
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}小时${mins}分钟`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      complete: { bg: 'bg-green-100', text: 'text-green-800', label: '完整' },
      incomplete: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '未完成' },
      abnormal: { bg: 'bg-red-100', text: 'text-red-800', label: '异常' }
    };
    
    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // 生成考勤统计图表数据
  const generateChartData = () => {
    if (!attendanceStats || !attendanceStats.statistics) return null;

    const labels = attendanceStats.statistics.map(stat => stat.member_name);
    const attendanceRates = attendanceStats.statistics.map(stat => stat.attendance_rate);
    const totalHours = attendanceStats.statistics.map(stat => stat.total_hours);

    return {
      labels,
      datasets: [
        {
          label: '出勤率 (%)',
          data: attendanceRates,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          label: '总时长 (小时)',
          data: totalHours,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          yAxisID: 'y1'
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '会员考勤统计',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        max: 100,
        title: {
          display: true,
          text: '出勤率 (%)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: '总时长 (小时)'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">考勤管理</h2>
        <div className="flex gap-2">
          <button
            onClick={() => fetchAttendanceStats()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            生成报表
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            导出数据
          </button>
        </div>
      </div>

      {/* 今日汇总卡片 */}
      {dailySummary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Users className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">今日签到</p>
                <p className="text-2xl font-semibold text-gray-900">{dailySummary.checked_in}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <Clock className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">今日签退</p>
                <p className="text-2xl font-semibold text-gray-900">{dailySummary.checked_out}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">仍在场内</p>
                <p className="text-2xl font-semibold text-gray-900">{dailySummary.still_in}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">平均时长</p>
                <p className="text-2xl font-semibold text-gray-900">{dailySummary.average_duration_hours.toFixed(1)}h</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 标签页 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('records')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'records'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                考勤记录
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab('statistics');
                if (!attendanceStats) fetchAttendanceStats();
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'statistics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                统计分析
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'records' && (
            <div className="space-y-4">
              {/* 过滤器 */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <select
                  value={recordFilters.member_id}
                  onChange={(e) => setRecordFilters({...recordFilters, member_id: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">所有会员</option>
                  {members.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>

                <select
                  value={recordFilters.device_id}
                  onChange={(e) => setRecordFilters({...recordFilters, device_id: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">所有设备</option>
                  {devices.map(device => (
                    <option key={device.id} value={device.id}>{device.name}</option>
                  ))}
                </select>

                <input
                  type="date"
                  value={recordFilters.start_date}
                  onChange={(e) => setRecordFilters({...recordFilters, start_date: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <input
                  type="date"
                  value={recordFilters.end_date}
                  onChange={(e) => setRecordFilters({...recordFilters, end_date: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <select
                  value={recordFilters.status}
                  onChange={(e) => setRecordFilters({...recordFilters, status: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">所有状态</option>
                  <option value="complete">完整</option>
                  <option value="incomplete">未完成</option>
                  <option value="abnormal">异常</option>
                </select>

                <button
                  onClick={fetchAttendanceRecords}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  查询
                </button>
              </div>

              {/* 考勤记录表格 */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        会员
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        日期
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        签到时间
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        签退时间
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        停留时长
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        设备
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
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
                    ) : attendanceRecords.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                          暂无考勤记录
                        </td>
                      </tr>
                    ) : (
                      attendanceRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {record.member_name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {formatDate(record.date)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {record.check_in_time ? formatTime(record.check_in_time) : '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {record.check_out_time ? formatTime(record.check_out_time) : '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {record.duration_minutes ? formatDuration(record.duration_minutes) : '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{record.device_name}</div>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(record.status)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'statistics' && (
            <div className="space-y-6">
              {/* 统计过滤器 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="date"
                  value={statsFilters.start_date}
                  onChange={(e) => setStatsFilters({...statsFilters, start_date: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <input
                  type="date"
                  value={statsFilters.end_date}
                  onChange={(e) => setStatsFilters({...statsFilters, end_date: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <select
                  value={statsFilters.member_id}
                  onChange={(e) => setStatsFilters({...statsFilters, member_id: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">所有会员</option>
                  {members.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>

                <button
                  onClick={fetchAttendanceStats}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  生成统计
                </button>
              </div>

              {/* 统计图表 */}
              {attendanceStats && generateChartData() && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <Bar data={generateChartData()} options={chartOptions} />
                </div>
              )}

              {/* 统计表格 */}
              {attendanceStats && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      考勤统计详情 ({attendanceStats.start_date} 至 {attendanceStats.end_date})
                    </h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            会员
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            总天数
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            出勤天数
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            缺勤天数
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            总时长
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            平均时长
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            出勤率
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {attendanceStats.statistics.map((stat) => (
                          <tr key={stat.member_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {stat.member_name}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{stat.total_days}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{stat.present_days}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{stat.absent_days}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{stat.total_hours}小时</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{stat.average_hours}小时</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{stat.attendance_rate}%</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance; 