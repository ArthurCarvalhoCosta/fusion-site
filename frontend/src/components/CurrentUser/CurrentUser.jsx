// CurrentUser.jsx
import React, { useState, useEffect, useCallback } from "react";

const API_BASE = "http://localhost:5000";

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
      const u = normalize(data.user ?? data.cliente ?? data);
      if (u) {
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
    loadUser();
  }, [loadUser]);

  const refreshUser = useCallback(() => fetchMe(), [fetchMe]);

  return typeof children === "function"
    ? children({ user, loading, refreshUser })
    : null;
}
