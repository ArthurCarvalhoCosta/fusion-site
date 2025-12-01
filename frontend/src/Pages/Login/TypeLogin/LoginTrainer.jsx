import React from "react";

import Carousel from "../../../components/LoginCarousel/LoginCarousel";
import LoginForm from "../../../components/LoginForm/LoginForm";
import "./TypeLogin.css";

const LoginTrainer = () => {
  return (
    <div className="login-page">
      {/* Lado esquerdo - Carousel */}
      <div className="login-carousel">
        <Carousel />
      </div>

      {/* Lado direito - Formulário */}
      <div className="login-form">
      <LoginForm
        userType="Personal Trainer"
        apiBase={process.env.BACKEND_URL || "http://localhost:5000"}
        apiPath="/api/auth/login"
        redirectTo="/Trainer/dashboard"
      />
      </div>
    </div>
  );
};

export default LoginTrainer;