import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './Pages/Home/Home.jsx';
import ChooseLogin from './Pages/Login/ChooseLogin.jsx';
import LoginAdmin from './Pages/Login/TypeLogin/LoginAdmin.jsx';
import LoginTrainer from './Pages/Login/TypeLogin/LoginTrainer.jsx';
import LoginStudent from './Pages/Login/TypeLogin/LoginStudent.jsx';

import UsersList from './Pages/Admin/UsersList.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<ChooseLogin />} />
        <Route path="/login/Admin" element={<LoginAdmin />} />
        <Route path="/login/Trainer" element={<LoginTrainer />} />
        <Route path="/login/Student" element={<LoginStudent />} />
        <Route path="/Users" element={<UsersList />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
