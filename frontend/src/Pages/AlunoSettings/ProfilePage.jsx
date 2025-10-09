import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import CurrentUser from "@/components/CurrentUser/CurrentUser";
import AlunoInfo from "./AlunoSections/AlunoInfo";
import AlunoSettings from "./AlunoSections/AlunoSettings";
import "./ProfilePage.css";

export default function ProfilePage() {
  const [active, setActive] = useState("info");
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch (err) {
      console.warn("Erro ao chamar logout backend", err);
    }
    
    localStorage.removeItem("user");
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");

    navigate("/");
  }

  return (
    <CurrentUser>
      {({ user, loading }) => {
        if (loading) {
          return (
            <div className="profile-page">
              <aside className="left-col">
                <header className="left-header">
                  <h1>Acesso Rápido</h1>
                </header>
                <nav className="left-nav">
                  <button className="left-nav-link active">Informações</button>
                  <button className="left-nav-link">Configurações</button>
                </nav>
              </aside>

              <main className="right-area">
                <div className="right-card">
                  <div className="loading">Carregando...</div>
                </div>
              </main>
            </div>
          );
        }

        return (
          <div className="profile-page">
            <aside className="left-col" aria-hidden={false}>
              <header className="left-header">
                <button
                  className="back-btn"
                  aria-label="Voltar para tela inicial"
                  onClick={() => navigate("/")}
                >
                  <FaArrowLeft color="white" size={20} />
                </button>
                <h1>Acesso Rápido</h1>
              </header>

              <nav className="left-nav" aria-label="Acesso rápido">
                <button
                  className={`left-nav-link ${active === "info" ? "active" : ""}`}
                  onClick={() => setActive("info")}
                >
                  Informações
                </button>
                <button
                  className={`left-nav-link ${active === "settings" ? "active" : ""}`}
                  onClick={() => setActive("settings")}
                >
                  Configurações
                </button>
              </nav>

              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </aside>

            <main className="right-area" role="region" aria-live="polite">
              <div className="right-card">
                {active === "info" ? <AlunoInfo /> : <AlunoSettings />}
              </div>
            </main>
          </div>
        );
      }}
    </CurrentUser>
  );
}
