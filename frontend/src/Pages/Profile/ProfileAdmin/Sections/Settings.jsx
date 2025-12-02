import React, { useEffect, useState } from "react";
import CurrentUser from "@/components/CurrentUser/CurrentUser";
import Avatar from "@/components/Avatar/Avatar";
import "./Sections.css";

const API_BASE = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL_DEV;

function formatCPFMask(v) {
  if (!v) return "";
  const only = v.replace(/\D/g, "");
  let out = only;
  out = out.replace(/(\d{3})(\d)/, "$1.$2");
  out = out.replace(/(\d{3})(\d)/, "$1.$2");
  out = out.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return out;
}

export default function AdminSettings() {
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [form, setForm] = useState({
    id: null,
    nome: "",
    genero: "Prefiro não dizer",
    email: "",
    cpf: "",
    avatarUrl: null,
  });
  const [popup, setPopup] = useState({ message: "", type: "" });

  const showPopup = (type, message, duration = 3000) => {
    setPopup({ type, message });
    setTimeout(() => setPopup({ type: "", message: "" }), duration);
  };

  const updateField = (key, value) => setForm((s) => ({ ...s, [key]: value }));

  const handleSalvar = async (e, refreshUser) => {
    e.preventDefault();
    setLoadingLocal(true);
    try {
      if (!form.id) throw new Error("ID do usuário não encontrado");

      const token = localStorage.getItem("token") || null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const payload = {
        nome: form.nome,
        genero: form.genero,
        email: form.email,
        cpf: (form.cpf || "").replace(/\D/g, ""),
        avatarUrl: form.avatarUrl, // apenas o fallback
      };

      const res = await fetch(`${API_BASE}/api/users/${form.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao salvar alterações");

      const updated = await res.json();
      const updatedUser = updated.user ?? updated.cliente ?? updated ?? null;

      if (updatedUser) {
        const avatarNormalized = (updatedUser.avatarUrl && String(updatedUser.avatarUrl).startsWith("/uploads"))
          ? `${API_BASE}${updatedUser.avatarUrl}?t=${Date.now()}`
          : updatedUser.avatarUrl ?? "";
        const finalUser = { ...updatedUser, avatarUrl: avatarNormalized };
        try {
          localStorage.setItem("user", JSON.stringify(finalUser));
          localStorage.setItem("usuario", JSON.stringify(finalUser));
        } catch {}
      }

      setForm((s) => ({
        ...s,
        cpf: formatCPFMask(payload.cpf),
        avatarUrl: payload.avatarUrl,
      }));

      showPopup("success", "Dados atualizados com sucesso");

      if (typeof refreshUser === "function") await refreshUser();
    } catch (err) {
      console.error(err);
      showPopup("error", err.message ?? "Erro ao salvar");
    } finally {
      setLoadingLocal(false);
    }
  };

  return (
    <CurrentUser>
      {({ user, loading, refreshUser }) => {
        useEffect(() => {
          if (user) {
            setForm({
              id: user._id ?? user.id ?? null,
              nome: user.nome ?? user.name ?? "",
              genero: user.genero ?? user.gender ?? "Prefiro não dizer",
              email: user.email ?? "",
              cpf: user.cpf ?? "",
              avatarUrl: user.avatarUrl ?? user.avatar ?? null,
            });
          }
        }, [user]);

        const isLoading = loading || loadingLocal;

        return (
          <main className="settings-wrap">
            <h1 className="settings-title">Configurações da Conta</h1>
            <h2 className="settings-subtitle">Editar Perfil</h2>

            {popup.message && (
              <div
                className={`settings-popup ${popup.type === "success" ? "success" : "error"}`}
              >
                {popup.message}
              </div>
            )}

            <form className="settings-form" onSubmit={(e) => handleSalvar(e, refreshUser)}>
              <div className="settings-avatar-row">
                <div className="avatar-box" style={{ width: 120, height: 120, borderRadius: 16, backgroundColor: "#efefef" }}>
                  <Avatar user={{ nome: form.nome, avatarUrl: form.avatarUrl }} size={120} />
                </div>
              </div>

              <div className="settings-fields">
                <label className="field">
                  <span className="field-label">Nome</span>
                  <input
                    className="field-input"
                    type="text"
                    value={form.nome}
                    onChange={(e) => updateField("nome", e.target.value)}
                  />
                </label>

                <label className="field">
                  <span className="field-label">Gênero</span>
                  <select
                    className="field-input-select"
                    value={form.genero}
                    onChange={(e) => updateField("genero", e.target.value)}
                  >
                    <option>Prefiro não dizer</option>
                    <option>Masculino</option>
                    <option>Feminino</option>
                  </select>
                </label>

                <label className="field">
                  <span className="field-label">Email</span>
                  <input
                    className="field-input"
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </label>

                <label className="field">
                  <span className="field-label">CPF</span>
                  <input
                    className="field-input"
                    type="text"
                    value={form.cpf}
                    onChange={(e) => updateField("cpf", e.target.value)}
                    maxLength={14}
                  />
                </label>
              </div>

              <div className="settings-actions">
                <button type="submit" className="btn-save" disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar"}
                </button>

                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    if (user) {
                      setForm({
                        id: user._id ?? user.id ?? null,
                        nome: user.nome ?? user.name ?? "",
                        genero: user.genero ?? user.gender ?? "Prefiro não dizer",
                        email: user.email ?? "",
                        cpf: user.cpf ?? "",
                        avatarUrl: user.avatarUrl ?? user.avatar ?? null,
                      });
                    }
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </main>
        );
      }}
    </CurrentUser>
  );
}
