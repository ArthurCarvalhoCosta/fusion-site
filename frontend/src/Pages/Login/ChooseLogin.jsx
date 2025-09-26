import React from "react";
import { useNavigate } from "react-router-dom";
import "./ChooseLogin.css";

import { Header } from "@/components/Header/Header.jsx";
import { Footer } from "@/components/Footer/Footer.jsx";

import AdminIcon from "@/assets/icons/admin.svg";
import PersonalIcon from "@/assets/icons/trainer.svg";
import AlunoIcon from "@/assets/icons/student.svg";

const ChooseLogin = () => {
  const navigate = useNavigate();

  const types = [
    {
      key: "admin",
      nome: "Administrador",
      descricao:
        "Gerencie usuários, treinos, conteúdos e permissões com total controle.",
      icone: AdminIcon,
      rota: "/login/admin",
    },
    {
      key: "trainer",
      nome: "Personal Trainer",
      descricao: "Acompanhe facilmente treinos e agende sessões com seus alunos.",
      icone: PersonalIcon,
      rota: "/login/trainer",
    },
    {
      key: "student",
      nome: "Aluno",
      descricao:
        "Acesse treinos e acompanhamento para seu desenvolvimento físico.",
      icone: AlunoIcon,
      rota: "/login/student",
    },
  ];

  const handleEnter = (rota) => {
    navigate(rota);
  };

  const handleCardKey = (e, rota) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(rota);
    }
  };

  return (
    <>
      <Header />

      <main className="type-login-page" role="main" aria-labelledby="type-login-title">
        <h1 id="type-login-title">Escolha o tipo de acesso</h1>

        <p className="type-login-desc">
          Selecione abaixo como deseja acessar a plataforma. Cada perfil tem
          funcionalidades específicas voltadas para o seu papel dentro da
          academia.
        </p>

        <section className="type-login-cards" aria-label="Tipos de acesso">
          {types.map((tipo) => (
            <article
              key={tipo.key}
              className={`type-login-card ${tipo.key}`}
              tabIndex={0}
              role="group"
              aria-labelledby={`type-${tipo.key}-title`}
              onKeyDown={(e) => handleCardKey(e, tipo.rota)}
            >
              {/* usando IMG (compatível com seu bundler) */}
              <img
                src={tipo.icone}
                alt={`${tipo.nome} ícone`}
                className="type-login-icon"
                aria-hidden="false"
              />

              <h2 id={`type-${tipo.key}-title`}>{tipo.nome}</h2>

              <p>{tipo.descricao}</p>

              <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <button
                  className="btn-entrar"
                  onClick={() => handleEnter(tipo.rota)}
                  aria-label={`Entrar como ${tipo.nome}`}
                  type="button"
                >
                  Entrar
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ChooseLogin;
