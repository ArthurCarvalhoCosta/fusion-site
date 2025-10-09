// ProfilePage.jsx
import React, { useState } from "react";
import CurrentUser from "@/components/CurrentUser/CurrentUser";
import AlunoInfo from "./AlunoSections/AlunoInfo";
import AlunoSettings from "./AlunoSections/AlunoSettings";
import "./ProfilePage.css";

export default function ProfilePage() {
  const [active, setActive] = useState("info"); // 'info' | 'settings'

  return (
    <CurrentUser>
      {({ user, loading }) => {
        if (loading) {
          return (
            <div className="profile-page">
              <aside className="left-col">
                <div className="left-title">Acesso Rápido</div>
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
              <div className="left-title">Acesso Rápido</div>

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
