// src/components/CurrentUser/CurrentUser.jsx
import React, { useState, useEffect, useCallback } from "react";

const API_BASE = process.env.BACKEND_URL || "http://localhost:5000";

export default function CurrentUser({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken") ||
    null;

  const normalize = (u) => {
    if (!u) return null;
    if (u.cliente) u = u.cliente;
    return u;
  };

  const formatCPFMask = (v) => {
    if (v === undefined || v === null) return "";
    const only = String(v || "").replace(/\D/g, "");
    if (!only) return "";
    let out = only;
    out = out.replace(/(\d{3})(\d)/, "$1.$2");
    out = out.replace(/(\d{3})(\d)/, "$1.$2");
    out = out.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return out;
  };

  const normalizeAvatarUrl = (u) => {
    if (!u) return u;
    try {
      const a = u.avatarUrl ?? u.avatar ?? "";
      if (a && String(a).startsWith("/uploads")) {
        u.avatarUrl = `${API_BASE}${a}`;
      } else if (a) {
        u.avatarUrl = a;
      } else {
        u.avatarUrl = "";
      }
    } catch {}
    return u;
  };

  const fetchMe = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return null;
    }

    try {
      const res = await fetch(`${API_BASE}/api/users/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        setLoading(false);
        return null;
      }
      const data = await res.json();
      let u = normalize(data.user ?? data.cliente ?? data);
      if (u) {
        // format CPF and normalize avatar URL
        try {
          u.cpf = formatCPFMask(u.cpf ?? u.documento ?? "");
        } catch {}
        u = normalizeAvatarUrl(u);

        setUser(u);
        try {
          localStorage.setItem("user", JSON.stringify(u));
          localStorage.setItem("usuario", JSON.stringify(u));
        } catch {}
      }
      return u;
    } catch (err) {
      console.error("CurrentUser.fetchMe error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUser = useCallback(async () => {
    setLoading(true);

    // 1) tenta pegar do localStorage
    try {
      const raw = localStorage.getItem("user") || localStorage.getItem("usuario");
      if (raw) {
        try {
          let parsed = JSON.parse(raw);
          parsed = normalize(parsed);
          if (parsed && (parsed._id || parsed.id || parsed.email)) {
            // format CPF and normalize avatar url on parsed object as well
            try {
              parsed.cpf = formatCPFMask(parsed.cpf ?? parsed.documento ?? "");
            } catch {}
            parsed = normalizeAvatarUrl(parsed);

            setUser(parsed);

            // Se estiver faltando campos importantes (modalidade/plano/tipo), tenta buscar o backend em background
            const missingModalidade = parsed.modalidade === undefined;
            const missingPlano = parsed.plano === undefined;
            const missingTipo = parsed.tipo === undefined && parsed.role === undefined && parsed.type === undefined;
            const token = getToken();
            if ((missingModalidade || missingPlano || missingTipo) && token) {
              // busca em background — não bloqueia a UI
              fetchMe().catch((e) => console.error("background fetchMe failed:", e));
            }

            setLoading(false);
            return;
          }
        } catch (e) {
          // parsing falhou -> seguir para fetchMe
        }
      }
    } catch (e) {
      // qualquer erro -> tentar fetchMe
    }

    // 2) fallback: busca no backend
    await fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    // carrega inicialmente
    loadUser();

    // escuta evento para forçar refresh quando outro componente alterar o usuário
    const onUserUpdated = () => {
      fetchMe().catch((e) => console.error("fetchMe on user:updated failed:", e));
    };
    window.addEventListener("user:updated", onUserUpdated);

    return () => {
      window.removeEventListener("user:updated", onUserUpdated);
    };
  }, [loadUser, fetchMe]);

  const refreshUser = useCallback(() => fetchMe(), [fetchMe]);

  return typeof children === "function"
    ? children({ user, loading, refreshUser })
    : null;
}
