// AlunoSettings.jsx
import React, { useEffect, useState } from "react";
import CurrentUser from "@/components/CurrentUser/CurrentUser";
import "./AlunoSections.css";

const API_BASE = "http://localhost:5000";

function formatCPFMask(v) {
  if (!v) return "";
  const only = v.replace(/\D/g, "");
  let out = only;
  out = out.replace(/(\d{3})(\d)/, "$1.$2");
  out = out.replace(/(\d{3})(\d)/, "$1.$2");
  out = out.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return out;
}

export default function AlunoSettings() {
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [form, setForm] = useState({
    id: null,
    nome: "",
    genero: "Prefiro não dizer",
    email: "",
    cpf: "",
    avatarUrl: null,
    avatarBase64: null,
  });
  const [popup, setPopup] = useState({ message: "", type: "" });

  const showPopup = (type, message, duration = 3000) => {
    setPopup({ type, message });
    setTimeout(() => setPopup({ type: "", message: "" }), duration);
  };

  const updateField = (key, value) => setForm((s) => ({ ...s, [key]: value }));

  const handleAvatarChange = (evt) => {
    const file = evt.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateField("avatarUrl", reader.result);
      updateField("avatarBase64", reader.result.split(",")[1] ?? reader.result);
    };
    reader.readAsDataURL(file);
  };

  // PUT para atualizar usuário; refreshUser virá do CurrentUser
  const handleSalvar = async (e, refreshUser) => {
    e.preventDefault();
    setLoadingLocal(true);

    try {
      if (!form.id) throw new Error("ID do usuário não encontrado");

      const payload = {
        nome: form.nome,
        genero: form.genero,
        email: form.email,
        cpf: (form.cpf || "").replace(/\D/g, ""),
        avatarBase64: form.avatarBase64 ?? undefined,
      };

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("accessToken") ||
        null;

      const headers = {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      };

      const res = await fetch(`${API_BASE}/api/users/${form.id}`, {
        method: "PUT",
        credentials: "include",
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.message ?? `Erro ${res.status}`);
      }

      const data = await res.json().catch(() => null);
      const updated = data.user ?? data.cliente ?? data ?? null;

      if (updated) {
        // atualiza local form imediatamente
        setForm({
          id: updated._id ?? updated.id,
          nome: updated.nome ?? "",
          genero: updated.genero ?? "Prefiro não dizer",
          email: updated.email ?? "",
          cpf: formatCPFMask(updated.cpf ?? ""),
          avatarUrl: updated.avatarUrl ?? updated.avatar ?? null,
          avatarBase64: null,
        });

        // salva localStorage
        try {
          const toSave = {
            id: updated._id ?? updated.id,
            nome: updated.nome,
            genero: updated.genero ?? "Prefiro não dizer",
            email: updated.email,
            cpf: updated.cpf ?? "",
            avatarUrl: updated.avatarUrl ?? updated.avatar ?? null,
          };
          localStorage.setItem("user", JSON.stringify(toSave));
          localStorage.setItem("usuario", JSON.stringify(toSave));
        } catch {}

        showPopup("success", "Dados salvos com sucesso");

        // atualiza o user global para outras telas
        if (typeof refreshUser === "function") {
          await refreshUser();
        }
      } else {
        showPopup("error", "Resposta inválida do servidor");
      }
    } catch (err) {
      console.error("handleSalvar error:", err);
      showPopup("error", err.message ?? "Erro ao salvar");
    } finally {
      setLoadingLocal(false);
    }
  };

  return (
    <CurrentUser>
      {({ user, loading, refreshUser }) => {
        // sincroniza form quando user muda
        useEffect(() => {
          if (user) {
            setForm({
              id: user._id ?? user.id ?? null,
              nome: user.nome ?? user.name ?? "",
              genero: user.genero ?? user.gender ?? "Prefiro não dizer",
              email: user.email ?? "",
              cpf: formatCPFMask(user.cpf ?? user.documento ?? ""),
              avatarUrl: user.avatarUrl ?? user.avatar ?? null,
              avatarBase64: null,
            });
          }
        }, [user]);

        const isLoading = loading || loadingLocal;

        if (loading) {
          return (
            <div className="settings-wrap">
              <h2 className="settings-subtitle">Editar Perfil</h2>
              <div className="loading">Carregando usuário...</div>
            </div>
          );
        }

        return (
          <main className="settings-wrap">
            <h1 className="settings-title">Configurações da Conta</h1>
            <h2 className="settings-subtitle">Editar Perfil</h2>

            {popup.message && (
              <div className={`settings-popup ${popup.type === "success" ? "success" : "error"}`}>
                {popup.message}
              </div>
            )}

            <form
              className="settings-form"
              onSubmit={(e) => handleSalvar(e, refreshUser)}
            >
              <div className="settings-avatar-row">
                <div className="avatar-box">
                  {form.avatarUrl ? (
                    <img className="avatar-img" src={form.avatarUrl} alt="Avatar" />
                  ) : (
                    <div className="avatar-fallback">{(form.nome || "U").charAt(0).toUpperCase()}</div>
                  )}
                </div>
                <div className="avatar-controls">
                  <label className="btn-upload">
                    Alterar foto
                    <input type="file" accept="image/*" onChange={handleAvatarChange} />
                  </label>
                </div>
              </div>

              <div className="settings-fields">
                <label className="field">
                  <span className="field-label">Nome</span>
                  <input className="field-input" type="text" value={form.nome} onChange={(e) => updateField("nome", e.target.value)} placeholder="Nome completo" />
                </label>

                <label className="field">
                  <span className="field-label">Gênero</span>
                  <select className="field-input-select" value={form.genero} onChange={(e) => updateField("genero", e.target.value)}>
                    <option>Prefiro não dizer</option>
                    <option>Masculino</option>
                    <option>Feminino</option>
                  </select>
                </label>

                <label className="field">
                  <span className="field-label">Email</span>
                  <input className="field-input" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="Endereço de E-mail" />
                </label>

                <label className="field">
                  <span className="field-label">CPF</span>
                  <input className="field-input" type="text" value={form.cpf} onChange={(e) => updateField("cpf", formatCPFMask(e.target.value))} placeholder="Digite o CPF" maxLength={14} />
                </label>
              </div>

              <div className="settings-actions">
                <button type="submit" className="btn-save" disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar"}
                </button>
                <button type="button" className="btn-cancel" onClick={() => {
                  // re-sincroniza com o user atual (sem reload)
                  if (user) {
                    setForm({
                      id: user._id ?? user.id ?? null,
                      nome: user.nome ?? user.name ?? "",
                      genero: user.genero ?? user.gender ?? "Prefiro não dizer",
                      email: user.email ?? "",
                      cpf: formatCPFMask(user.cpf ?? user.documento ?? ""),
                      avatarUrl: user.avatarUrl ?? user.avatar ?? null,
                      avatarBase64: null,
                    });
                  }
                }}>
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
