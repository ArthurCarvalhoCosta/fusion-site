// Contact.jsx
import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { FaCheck } from "react-icons/fa";
import gmailIcon from "@/assets/icons/gmail.ico";
import "./Contact.css";

export const Contact = () => {
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [sending, setSending] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: "",
  });

  // pegar user do localStorage (ou 'usuario')
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user") || localStorage.getItem("usuario");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setFormData((prev) => ({ ...prev, email: parsed.email || "" }));
      }
    } catch (err) {
      // ignore parse errors
    }
  }, []);

  // open form: se não logado mostra erro e redireciona para /login
  const openForm = useCallback(() => {
    if (!user) {
      showError("Você precisa estar logado para enviar um email.");
      setTimeout(() => (window.location.href = "/login"), 1500);
      return;
    }
    setShowForm(true);
  }, [user]);

  // mensagem de erro pop-up superior
  const showError = (msg) => {
    setErrorMsg(msg);
    window.setTimeout(() => setErrorMsg(""), 2200);
  };

  // envia email (chama seu backend em /api/email/send)
  const sendEmail = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);

    // backend espera { email, subject, message }
    const payload = {
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    try {
      const res = await fetch(`${process.env.VITE_BACKEND_URL || process.env.VITE_BACKEND_URL_DEV}/api/email/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Email enviado com sucesso!");
        setShowForm(false);
      } else {
        const err = await res.json().catch(() => null);
        showError(err?.message || "Erro ao enviar email.");
      }
    } catch (err) {
      console.error(err);
      showError("Erro inesperado ao enviar email.");
    } finally {
      setSending(false);
    }
  };

  // bloquear scroll quando modal aberto
  useEffect(() => {
    if (showForm) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev || "";
      };
    }
  }, [showForm]);

  // fechar modal com ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setShowForm(false);
    };
    if (showForm) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showForm]);

  // backdrop+modal via portal — garante que fique acima do header e centrado
  const modal = showForm ? createPortal(
    <div
      className="email-modal-backdrop"
      role="dialog"
      aria-modal="true"
      onMouseDown={(ev) => {
        // clique no backdrop fecha (mas clique dentro do modal NÃO fecha)
        if (ev.target === ev.currentTarget) setShowForm(false);
      }}
    >
      <div className="email-modal" onMouseDown={(ev) => ev.stopPropagation()}>
        <h3>Enviar Email</h3>

        <form onSubmit={sendEmail} className="email-form" autoComplete="off">
          <label>Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <label>Assunto</label>
          <input
            type="text"
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />

          <label>Mensagem</label>
          <textarea
            required
            rows={6}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />

          <div className="email-form-actions">
            <button type="submit" className="form-send-btn" disabled={sending}>
              {sending ? "Enviando..." : "Enviar"}
            </button>

            <button
              type="button"
              className="form-cancel-btn"
              onClick={() => setShowForm(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <section className="contact-section" id="Contact">
      {/* popup de erro no topo (sempre acima do header) */}
      {errorMsg && <div className="contact-error-popup">{errorMsg}</div>}

      <div className="section-title">
        <span className="background-number">04</span>
        <h2>
          Entre em <br />
          <span className="highlight">Contato</span>
        </h2>
      </div>

      <div className="contact-content">
        <div className="contact-left">
          <h3>Fale diretamente com a nossa equipe</h3>
          <p>
            Agora você pode entrar em contato conosco através do email! Estamos prontos
            para ajudar em dúvidas, planos e qualquer informação que precisar.
          </p>

          <ul className="benefits-list">
            <li><FaCheck className="check-icon" /> Atendimento rápido</li>
            <li><FaCheck className="check-icon" /> Tire dúvidas sobre planos</li>
            <li><FaCheck className="check-icon" /> Comunicação direta</li>
          </ul>
        </div>

        <div className="contact-right">
          <h4>Entre em contato por email!</h4>

          <img src={gmailIcon} alt="Gmail Icon" className="bot-icon" />

          <button className="contact-button" onClick={openForm}>
            Enviar Email
          </button>
        </div>
      </div>

      {modal}
    </section>
  );
};

export default Contact;
