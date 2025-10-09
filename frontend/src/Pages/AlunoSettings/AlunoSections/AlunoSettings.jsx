// src/Pages/AlunoSettings/AlunoSettings.jsx
import React, { useEffect, useState } from "react";
import CurrentUser from "@/components/CurrentUser/CurrentUser";
import Avatar from "@/components/Avatar/Avatar";
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
    avatarFile: null,
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

      let avatarUrlFinal = form.avatarUrl;

      // Caso queira fazer upload aqui em salvar (opcional)
      if (form.avatarFile) {
        const formData = new FormData();
        formData.append("avatar", form.avatarFile);
        const res = await fetch(`${API_BASE}/api/users/${form.id}/avatar`, {
          method: "POST",
          headers,
          body: formData,
        });
        if (!res.ok) throw new Error("Erro ao enviar avatar");
        const data = await res.json();
        avatarUrlFinal = data.avatarUrl
          ? (data.avatarUrl.startsWith("/uploads") ? `${API_BASE}${data.avatarUrl}` : data.avatarUrl)
          : avatarUrlFinal;
        // cache-bust
        if (avatarUrlFinal) avatarUrlFinal = `${avatarUrlFinal}?t=${Date.now()}`;
      }

      const payload = {
        nome: form.nome,
        genero: form.genero,
        email: form.email,
        cpf: (form.cpf || "").replace(/\D/g, ""),
        avatarUrl: avatarUrlFinal,
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

      // Se backend não retornar o user atualizado, ao menos atualizamos localStorage com o payload
      if (updatedUser) {
        // preferir dados do backend, mas normalizar avatar se necessário
        const avatarNormalized = (updatedUser.avatarUrl && String(updatedUser.avatarUrl).startsWith("/uploads"))
          ? `${API_BASE}${updatedUser.avatarUrl}?t=${Date.now()}`
          : (updatedUser.avatarUrl ? `${updatedUser.avatarUrl}?t=${Date.now()}` : (avatarUrlFinal || ""));
        const finalUser = { ...updatedUser, avatarUrl: avatarNormalized };
        try {
          localStorage.setItem("user", JSON.stringify(finalUser));
          localStorage.setItem("usuario", JSON.stringify(finalUser));
        } catch {}
      } else {
        // fallback: atualiza localStorage com dados locais que editamos
        try {
          const raw = localStorage.getItem("user") || localStorage.getItem("usuario");
          if (raw) {
            const parsed = JSON.parse(raw);
            const merged = {
              ...parsed,
              nome: payload.nome,
              genero: payload.genero,
              email: payload.email,
              cpf: payload.cpf,
              avatarUrl: avatarUrlFinal || parsed.avatarUrl || "",
            };
            localStorage.setItem("user", JSON.stringify(merged));
            localStorage.setItem("usuario", JSON.stringify(merged));
          }
        } catch {}
      }

      // Atualiza componente local (form) com valores finais
      setForm((s) => ({
        ...s,
        cpf: formatCPFMask(payload.cpf),
        avatarUrl: avatarUrlFinal,
        avatarFile: null,
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
              cpf: user.cpf ?? "", // CurrentUser já formata para exibição
              avatarUrl: user.avatarUrl ?? user.avatar ?? null,
              avatarFile: null,
            });
          }
        }, [user]);

        const isLoading = loading || loadingLocal;
        const firstLetter = form.nome ? form.nome.charAt(0).toUpperCase() : "U";

        const avatarSrc = form.avatarUrl
          ? String(form.avatarUrl).startsWith("/uploads")
            ? `${API_BASE}${form.avatarUrl}`
            : form.avatarUrl
          : null;

        // ---------- SUBSTITUIÇÃO das funções: upload / remove ----------
        async function handleAvatarUpload(e, refreshUserLocal) {
          const file = e.target.files?.[0];
          if (!file || !form.id) return;

          // preview local imediato
          const reader = new FileReader();
          reader.onload = () => {
            updateField("avatarUrl", reader.result);
            updateField("avatarFile", file);
          };
          reader.readAsDataURL(file);

          // upload
          try {
            const formData = new FormData();
            formData.append("avatar", file);
            const token = localStorage.getItem("token") || null;
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const res = await fetch(`${API_BASE}/api/users/${form.id}/avatar`, {
              method: "POST",
              headers,
              body: formData,
            });
            if (!res.ok) throw new Error("Erro no upload do avatar");
            const data = await res.json();

            let newAvatarUrl = data.avatarUrl ?? data.avatar ?? null;
            if (newAvatarUrl && newAvatarUrl.startsWith("/uploads")) {
              newAvatarUrl = `${API_BASE}${newAvatarUrl}`;
            }

            if (newAvatarUrl) newAvatarUrl = `${newAvatarUrl}?t=${Date.now()}`;

            updateField("avatarUrl", newAvatarUrl);
            updateField("avatarFile", null);

            // atualiza localStorage user
            try {
              const raw = localStorage.getItem("user") || localStorage.getItem("usuario");
              if (raw) {
                const parsed = JSON.parse(raw);
                parsed.avatarUrl = newAvatarUrl;
                localStorage.setItem("user", JSON.stringify(parsed));
                localStorage.setItem("usuario", JSON.stringify(parsed));
              }
            } catch (err) {}

            if (typeof refreshUserLocal === "function") await refreshUserLocal();
            showPopup("success", "Foto atualizada");
          } catch (err) {
            console.error("Erro ao enviar avatar:", err);
            showPopup("error", "Falha ao enviar imagem");
          }
        }

        async function handleAvatarRemove(refreshUserLocal) {
          if (!form.id) return;
          try {
            const token = localStorage.getItem("token") || null;
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const res = await fetch(`${API_BASE}/api/users/${form.id}/avatar`, {
              method: "DELETE",
              headers,
              credentials: "include",
            });
            if (!res.ok) {
              const errB = await res.json().catch(() => null);
              throw new Error(errB?.message ?? "Falha ao remover avatar");
            }

            // limpar avatar localmente (mostrar inicial)
            updateField("avatarUrl", null);
            updateField("avatarFile", null);

            // atualiza localStorage user se existir
            try {
              const raw = localStorage.getItem("user") || localStorage.getItem("usuario");
              if (raw) {
                const parsed = JSON.parse(raw);
                parsed.avatarUrl = "";
                localStorage.setItem("user", JSON.stringify(parsed));
                localStorage.setItem("usuario", JSON.stringify(parsed));
              }
            } catch (err) {}

            if (typeof refreshUserLocal === "function") await refreshUserLocal();
            showPopup("success", "Foto removida");
          } catch (err) {
            console.error("Erro ao remover avatar:", err);
            showPopup("error", "Erro ao remover foto");
          }
        }
        // ----------------------------------------------------------------

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
                <div className="avatar-box">
                  <Avatar user={{ nome: form.nome, avatarUrl: form.avatarUrl }} size={120} />
                </div>
                <div className="avatar-controls">
                  <label className="btn-upload">
                    Alterar foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleAvatarUpload(e, refreshUser)}
                    />
                  </label>

                  <button
                    className="btn-remove-photo"
                    type="button"
                    onClick={() => handleAvatarRemove(refreshUser)}
                  >
                    Remover foto
                  </button>
                </div>
              </div>

              {/* Campos */}
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
                        avatarFile: null,
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
