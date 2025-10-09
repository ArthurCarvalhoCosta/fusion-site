// AlunoInfo.jsx
import React, { useEffect, useRef } from "react";
import CurrentUser from "@/components/CurrentUser/CurrentUser";
import "./AlunoSections.css"; // reaproveita os estilos

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
        // usado para garantir que chamamos refreshUser no máximo uma vez por mudança de user
        const refreshCalledRef = useRef(false);

        useEffect(() => {
          // reset quando o usuário muda
          refreshCalledRef.current = false;
        }, [user && (user._id ?? user.id)]);

        useEffect(() => {
          if (loading) return;
          if (!user) return;

          // define tipo (em lower case) para as regras
          const tipoRaw = (user.tipo ?? user.role ?? user.type ?? "") + "";
          const tipo = tipoRaw.toLowerCase();

          const needsModalidade = (tipo === "aluno" && !user.modalidade);
          const needsPlano = (tipo === "aluno" && !user.plano);
          const needsPTModalidade = ((tipo === "personal trainer" || tipo === "personal" || tipo === "pt") && !user.modalidade);

          const needFetch = needsModalidade || needsPlano || needsPTModalidade;

          if (needFetch && typeof refreshUser === "function" && !refreshCalledRef.current) {
            refreshCalledRef.current = true;
            // chama e ignora retorno
            refreshUser().catch((e) => {
              console.error("AlunoInfo refreshUser error:", e);
            });
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
        const tipo = (user.tipo ?? user.role ?? user.type ?? "").toString();
        const genero = user.genero ?? user.gender ?? "Prefiro não dizer";
        const email = user.email ?? "";
        const cpf = formatCPFMask(user.cpf ?? user.documento ?? "");
        const avatarUrl = user.avatarUrl ?? user.avatar ?? null;
        const modalidade = user.modalidade ?? user.modality ?? "";
        const plano = user.plano ?? user.plan ?? "";

        const isAluno = String(tipo).toLowerCase() === "aluno";
        const isPT =
          String(tipo).toLowerCase() === "personal trainer" ||
          String(tipo).toLowerCase() === "personal" ||
          String(tipo).toLowerCase() === "pt";

        return (
          <main className="settings-wrap aluno-info">
            <h1 className="settings-title">Informações do Aluno</h1>

            <div className="settings-avatar-row" style={{ marginBottom: 16 }}>
              <div className="avatar-box" style={{ width: 120, height: 120 }}>
                {avatarUrl ? (
                  <img className="avatar-img" src={avatarUrl} alt="Avatar" />
                ) : (
                  <div className="avatar-fallback" style={{ fontSize: 40 }}>{(nome || "U").charAt(0).toUpperCase()}</div>
                )}
              </div>
            </div>

            <div className="settings-fields">
              <div className="field">
                <span className="field-label">Nome</span>
                <div className="field-input" style={{ background: "transparent", border: "none", padding: 0 }}>{nome}</div>
              </div>

              <div className="field">
                <span className="field-label">Tipo</span>
                <div className="field-input" style={{ background: "transparent", border: "none", padding: 0 }}>{tipo || "—"}</div>
              </div>

              <div className="field">
                <span className="field-label">Gênero</span>
                <div className="field-input" style={{ background: "transparent", border: "none", padding: 0 }}>{genero}</div>
              </div>

              <div className="field">
                <span className="field-label">Email</span>
                <div className="field-input" style={{ background: "transparent", border: "none", padding: 0 }}>{email}</div>
              </div>

              <div className="field">
                <span className="field-label">CPF</span>
                <div className="field-input" style={{ background: "transparent", border: "none", padding: 0 }}>{cpf}</div>
              </div>

              {isAluno && (
                <>
                  <div className="field">
                    <span className="field-label">Modalidade</span>
                    <div className="field-input" style={{ background: "transparent", border: "none", padding: 0 }}>{modalidade || "—"}</div>
                  </div>

                  <div className="field">
                    <span className="field-label">Plano</span>
                    <div className="field-input" style={{ background: "transparent", border: "none", padding: 0 }}>{plano || "—"}</div>
                  </div>
                </>
              )}

              {isPT && (
                <div className="field">
                  <span className="field-label">Modalidade</span>
                  <div className="field-input" style={{ background: "transparent", border: "none", padding: 0 }}>{modalidade || "—"}</div>
                </div>
              )}
            </div>
          </main>
        );
      }}
    </CurrentUser>
  );
}
  