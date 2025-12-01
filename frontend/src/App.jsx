import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './Pages/Home/Home.jsx';
import ChooseLogin from './Pages/Login/ChooseLogin.jsx';
import LoginAdmin from './Pages/Login/TypeLogin/LoginAdmin.jsx';
import LoginTrainer from './Pages/Login/TypeLogin/LoginTrainer.jsx';
import LoginStudent from './Pages/Login/TypeLogin/LoginStudent.jsx';
import About from './Pages/About/About.jsx';
import ProfileStudent from './Pages/Profile/ProfileStudent/ProfileStudent.jsx';
import ProfileAdmin from './Pages/Profile/ProfileAdmin/ProfileAdmin.jsx';
import ProfilePersonal from './Pages/Profile/ProfilePersonal/ProfilePersonal.jsx';
import WeeklyWorkout from './Pages/WeeklyWorkout/WeeklyWorkout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<ChooseLogin />} />
        <Route path="/login/admin" element={<LoginAdmin />} />
        <Route path="/login/trainer" element={<LoginTrainer />} />
        <Route path="/login/student" element={<LoginStudent />} />
        <Route path="/profile/student" element={<ProfileStudent />} />
        <Route path="/profile/Admin" element={<ProfileAdmin />} />
        <Route path="/profile/Personal" element={<ProfilePersonal />} />
        <Route path="/weeklyworkout" element={<WeeklyWorkout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
