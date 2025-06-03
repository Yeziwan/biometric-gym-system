import React from 'react';
import { Sidebar } from '../Sidebar';
import { Header } from '../Header';
import './Layout.css';

export const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="content-area">
        <Header />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};
