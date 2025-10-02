import React, { useState } from "react";
import "./Modal.css";

export default function ForgotPasswordModal({ open, onClose, apiBase = "http://localhost:5000", onSent }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertMsg("");
    try {
      const res = await fetch(`${apiBase}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: String(email).trim() }),
      });
      const data = await res.json();
      if (!res.ok) setAlertMsg(data.message || "Erro ao enviar código");
      else {
        setAlertMsg("Código enviado — verifique seu e-mail");
        if (typeof onSent === "function") onSent(String(email).trim()); // informa email para abrir o Reset modal
      }
    } catch (err) {
      console.error("ForgotPasswordModal - enviar:", err);
      setAlertMsg("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
      setTimeout(() => setAlertMsg(""), 4000);
    }
  };

  return (
    <>
      {alertMsg && <div className="modal-top-alert">{alertMsg}</div>}
      <div className="modal-overlay" role="dialog" aria-modal="true">
        <div className="modal-content">
          <button className="modal-close" onClick={onClose} aria-label="Fechar">×</button>
          <h3>Recuperar senha</h3>
          <form onSubmit={handleSubmit}>
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar código"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
