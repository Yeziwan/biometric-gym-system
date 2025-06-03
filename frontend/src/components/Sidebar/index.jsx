import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, UserPlus, Scan, HardDrive, Users } from 'lucide-react';
import './Sidebar.css';

export const Sidebar = () => {
  const navItems = [
    { path: '/', icon: <Home size={20} />, label: '仪表盘' },
    { path: '/enrollment', icon: <UserPlus size={20} />, label: '注册' },
    { path: '/recognition', icon: <Scan size={20} />, label: '识别' },
    { path: '/devices', icon: <HardDrive size={20} />, label: '设备管理' },
    { path: '/members', icon: <Users size={20} />, label: '会员管理' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">生物识别健身系统</h2>
      </div>
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.path} className="nav-item">
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <p>ZKTeco K40 生物识别系统</p>
      </div>
    </aside>
  );
};
