import React from "react";

import Carousel from "../../../components/LoginCarousel/LoginCarousel";
import LoginForm from "../../../components/LoginForm/LoginForm";
import "./TypeLogin.css";

const LoginAdmin = () => {
  return (
    <div className="login-page">
      {/* Lado esquerdo - Carousel */}
      <div className="login-carousel">
        <Carousel />
      </div>

      {/* Lado direito - Formulário */}
      <div className="login-form">
      <LoginForm
        userType="Admin"
        apiBase={process.env.VITE_BACKEND_URL || process.env.VITE_BACKEND_URL_DEV}
        apiPath="/api/auth/login"
        redirectTo="/admin/dashboard"
      />
      </div>
    </div>
  );
};

export default LoginAdmin;