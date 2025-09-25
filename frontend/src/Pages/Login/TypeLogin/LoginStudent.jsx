import React from "react";
import { FcGoogle } from "react-icons/fc";

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
          apiBase="http://localhost:5000"
          apiPath="/api/auth/login"
          redirectTo="/Student/dashboard"
        />

        <div className="divider">
          <span>ou entre com</span>
        </div>

        <div className="google-login">
          <button type="button" className="google-btn">
            <FcGoogle className="google-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginStudent;