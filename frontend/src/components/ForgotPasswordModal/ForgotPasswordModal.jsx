// src/components/ForgotPasswordModal/ForgotPasswordModal.jsx
import React, { useState } from "react";
import "./Modal.css";

export default function ForgotPasswordModal({ open, onClose, apiBase = "http://localhost:5000", onSent }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`${apiBase}/api/auth/recuperar-senha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) setMsg(data.message || "Erro ao enviar");
      else {
        setMsg("Código enviado — verifique seu e-mail");
        if (typeof onSent === "function") onSent(email); // notifica que enviou
      }
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
        <h3>Recuperar senha</h3>
        <form onSubmit={handleSubmit}>
          <label>E-mail</label>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <button type="submit" disabled={loading}>{loading ? "Enviando..." : "Enviar código"}</button>
        </form>
        {msg && <p className="modal-msg">{msg}</p>}
      </div>
    </div>
  );
}
