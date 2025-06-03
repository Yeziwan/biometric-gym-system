import React from 'react';
import { Bell, Settings, User } from 'lucide-react';
import './Header.css';

export const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="page-title">生物识别健身系统</h1>
      </div>
      <div className="header-right">
        <button className="header-icon-button">
          <Bell size={20} />
        </button>
        <button className="header-icon-button">
          <Settings size={20} />
        </button>
        <div className="user-profile">
          <div className="user-avatar">
            <User size={20} />
          </div>
          <span className="user-name">管理员</span>
        </div>
      </div>
    </header>
  );
};
