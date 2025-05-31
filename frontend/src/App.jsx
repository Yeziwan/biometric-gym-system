import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Enrollment from './pages/Enrollment/Enrollment';
import Recognition from './pages/Recognition/Recognition';
import DeviceManage from './pages/DeviceManage/DeviceManage';
import MemberManage from './pages/MemberManage/MemberManage';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/enrollment" element={<Enrollment />} />
          <Route path="/recognition" element={<Recognition />} />
          <Route path="/devices" element={<DeviceManage />} />
          <Route path="/members" element={<MemberManage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
