// src/components/ResetPasswordModal/ResetPasswordModal.jsx
import React, { useState, useEffect } from "react";
import "./Modal.css";

export default function ResetPasswordModal({ open, onClose, apiBase = "http://localhost:5000", presetEmail }) {
  const [email, setEmail] = useState(presetEmail || "");
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setEmail(presetEmail || "");
  }, [presetEmail]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`${apiBase}/api/auth/reset-senha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo, novaSenha }),
      });
      const data = await res.json();
      if (!res.ok) setMsg(data.message || "Erro ao resetar");
      else setMsg("Senha alterada com sucesso. Faça login com a nova senha.");
    } catch (err) {
      console.error(err);
      setMsg("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>Redefinir senha</h3>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <label>Código</label>
          <input type="text" value={codigo} onChange={e=>setCodigo(e.target.value)} required />
          <label>Nova senha</label>
          <input type="password" value={novaSenha} onChange={e=>setNovaSenha(e.target.value)} required />
          <button type="submit" disabled={loading}>{loading ? "Aguarde..." : "Alterar senha"}</button>
        </form>
        {msg && <p className="modal-msg">{msg}</p>}
      </div>
    </div>
  );
}
