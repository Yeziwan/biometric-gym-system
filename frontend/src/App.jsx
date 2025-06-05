import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Enrollment from './pages/Enrollment/Enrollment';
import Recognition from './pages/Recognition/Recognition';
import DeviceManage from './pages/DeviceManage/DeviceManage';
import MemberManage from './pages/MemberManage/MemberManage';
import BranchManage from './pages/BranchManage/BranchManage';
import AccessControl from './pages/AccessControl/AccessControl';
import Attendance from './pages/Attendance/Attendance';

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

          <Route path="/branches" element={<BranchManage />} />
          <Route path="/access-control" element={<AccessControl />} />
          <Route path="/attendance" element={<Attendance />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
