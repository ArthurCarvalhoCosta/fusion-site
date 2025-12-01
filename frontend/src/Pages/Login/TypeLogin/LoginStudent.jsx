import React from "react";

import Carousel from "../../../components/LoginCarousel/LoginCarousel";
import LoginForm from "../../../components/LoginForm/LoginForm";
import "./TypeLogin.css";

const LoginStudent = () => {
  return (
    <div className="login-page">
      {/* Lado esquerdo - Carousel */}
      <div className="login-carousel">
        <Carousel />
      </div>

      {/* Lado direito - Formulário */}
      <div className="login-form">
      <LoginForm
        userType="Aluno"
        apiBase={process.env.BACKEND_URL || "http://localhost:5000"}
        apiPath="/api/auth/login"
        redirectTo="/Student/dashboard"
      />
      </div>
    </div>
  );
};

export default LoginStudent;