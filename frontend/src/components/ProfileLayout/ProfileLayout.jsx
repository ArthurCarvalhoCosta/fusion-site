import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./ProfileLayout.css";

export default function ProfileLayout({
  active,
  setActive,
  sections,
  children,
  onLogout,
}) {
  const navigate = useNavigate();

  return (
    <div className="profile-page">

      {/* Lateral */}
      <aside className="left-col">
        <header className="left-header">
          <button
            className="back-btn"
            aria-label="Voltar para tela inicial"
            onClick={() => navigate("/")}
          >
            <FaArrowLeft size={20} color="white" />
          </button>

          <h1>Acesso Rápido</h1>
        </header>

        <nav className="left-nav">
          {sections.map((sec) => (
            <button
              key={sec.id}
              className={`left-nav-link ${
                active === sec.id ? "active" : ""
              }`}
              onClick={() => setActive(sec.id)}
            >
              {sec.label}
            </button>
          ))}
        </nav>

        {/* BOTÃO DE LOGOUT */}
        <button className="logout-btn" onClick={onLogout}>
          Sair da Conta
        </button>
      </aside>

      {/* Área direita */}
      <main className="right-area">
        <div className="right-card">{children}</div>
      </main>
    </div>
  );
}
