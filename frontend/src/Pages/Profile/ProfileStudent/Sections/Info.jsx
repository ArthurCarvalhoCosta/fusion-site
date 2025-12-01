// src/Pages/AlunoSettings/AlunoInfo.jsx
import React, { useEffect, useRef } from "react";
import CurrentUser from "@/components/CurrentUser/CurrentUser";
import Avatar from "@/components/Avatar/Avatar";
import "./Sections.css";

function formatCPFMask(v) {
  if (!v) return "";
  const only = v.replace(/\D/g, "");
  let out = only;
  out = out.replace(/(\d{3})(\d)/, "$1.$2");
  out = out.replace(/(\d{3})(\d)/, "$1.$2");
  out = out.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return out;
}

export default function AlunoInfo() {
  return (
    <CurrentUser>
      {({ user, loading, refreshUser }) => {
        const refreshCalledRef = useRef(false);

        useEffect(() => {
          refreshCalledRef.current = false;
        }, [user && (user._id ?? user.id)]);

        useEffect(() => {
          if (loading || !user) return;
          const tipoRaw = (user.tipo ?? user.role ?? user.type ?? "") + "";
          const tipo = tipoRaw.toLowerCase();
          const needsModalidade = (tipo === "aluno" && !user.modalidade);
          const needsPlano = (tipo === "aluno" && !user.plano);
          const needsPTModalidade =
            (["personal trainer", "personal", "pt"].includes(tipo) &&
              !user.modalidade);

          if (
            (needsModalidade || needsPlano || needsPTModalidade) &&
            typeof refreshUser === "function" &&
            !refreshCalledRef.current
          ) {
            refreshCalledRef.current = true;
            refreshUser().catch((e) =>
              console.error("AlunoInfo refreshUser error:", e)
            );
          }
        }, [loading, user, refreshUser]);

        if (loading) {
          return (
            <div className="settings-wrap aluno-info">
              <h2 className="settings-subtitle">Carregando informações...</h2>
            </div>
          );
        }

        if (!user) {
          return (
            <div className="settings-wrap aluno-info">
              <h2 className="settings-subtitle">Usuário não encontrado</h2>
            </div>
          );
        }

        const nome = user.nome ?? user.name ?? "";
        const tipo = user.tipo ?? user.role ?? user.type ?? "";
        const genero = user.genero ?? user.gender ?? "Prefiro não dizer";
        const email = user.email ?? "";
        const cpf = formatCPFMask(user.cpf ?? user.documento ?? "");
        const modalidade = user.modalidade ?? "";
        const plano = user.plano ?? "";
        const avatarUrl = user.avatarUrl ?? user.avatar ?? "";

        const isAluno = String(tipo).toLowerCase() === "aluno";
        const isPT = ["personal trainer", "personal", "pt"].includes(
          String(tipo).toLowerCase()
        );

        const avatarSrc = avatarUrl
          ? avatarUrl.startsWith("/uploads")
            ? `${process.env.BACKEND_URL || "http://localhost:5000"}${avatarUrl}`
            : avatarUrl
          : null;

        const firstLetter = nome ? nome.charAt(0).toUpperCase() : "U";

        return (
          <main className="settings-wrap aluno-info">
            <h1 className="settings-title">Informações do Aluno</h1>

            <div className="settings-avatar-row" style={{ marginBottom: 16 }}>
              <div className="avatar-box" style={{ width: 120, height: 120, borderRadius: 16, backgroundColor: "#efefef" }}>
                <Avatar user={{ nome, avatarUrl }} size={120} />
              </div>
            </div>

            <div className="settings-fields">
              <div className="field">
                <span className="field-label">Nome</span>
                <div>{nome}</div>
              </div>

              <div className="field">
                <span className="field-label">Tipo</span>
                <div>{tipo || "—"}</div>
              </div>

              <div className="field">
                <span className="field-label">Gênero</span>
                <div>{genero}</div>
              </div>

              <div className="field">
                <span className="field-label">Email</span>
                <div>{email}</div>
              </div>

              <div className="field">
                <span className="field-label">CPF</span>
                <div>{cpf}</div>
              </div>

              {isAluno && (
                <>
                  <div className="field">
                    <span className="field-label">Modalidade</span>
                    <div>{modalidade || "—"}</div>
                  </div>

                  <div className="field">
                    <span className="field-label">Plano</span>
                    <div>{plano || "—"}</div>
                  </div>
                </>
              )}

              {isPT && (
                <div className="field">
                  <span className="field-label">Modalidade</span>
                  <div className="field-input">{modalidade || "—"}</div>
                </div>
              )}
            </div>
          </main>
        );
      }}
    </CurrentUser>
  );
}
