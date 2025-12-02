import React, { useState, useEffect } from "react";
import PinInput from "./PinInput.jsx";
import "./Modal.css";

import EyeOpenIcon from "@/assets/icons/olho-aberto.svg";
import EyeClosedIcon from "@/assets/icons/olho-fechado.svg";

export default function ResetPasswordModal({ open, onClose, apiBase = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL_DEV, presetEmail }) {
  const [codigo, setCodigo] = useState("");
  const [codigoValidado, setCodigoValidado] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmSenha, setMostrarConfirmSenha] = useState(false);

  useEffect(() => {
    setCodigo("");
    setCodigoValidado(false);
    setNovaSenha("");
    setConfirmarSenha("");
    setAlertMsg("");
    setMostrarNovaSenha(false);
    setMostrarConfirmSenha(false);
  }, [presetEmail, open]);

  useEffect(() => {
    if (alertMsg) {
      const t = setTimeout(() => setAlertMsg(""), 4000);
      return () => clearTimeout(t);
    }
  }, [alertMsg]);

  const validarCodigo = async (incomingCode) => {
    const codeToUse = (incomingCode || codigo || "").replace(/\D/g, "").trim();

    if (!codeToUse) return setAlertMsg("Preencha o código para validar");
    if (!presetEmail) return setAlertMsg("Email não informado");

    setLoading(true);
    setAlertMsg("");

    try {
      const res = await fetch(`${apiBase}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: presetEmail, codigo: codeToUse }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCodigoValidado(true);
        setAlertMsg("Código validado! Agora insira sua nova senha.");
      } else {
        setCodigoValidado(false);
        setAlertMsg(data.message || "Código inválido");
      }
    } catch (err) {
      console.error("validarCodigo err:", err);
      setCodigoValidado(false);
      setAlertMsg("Erro ao conectar");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!codigoValidado) return setAlertMsg("Valide o código antes");
    if (!novaSenha || !confirmarSenha) return setAlertMsg("Preencha todos os campos");
    if (novaSenha !== confirmarSenha) return setAlertMsg("As senhas não coincidem");

    setLoading(true);
    setAlertMsg("");

    try {
      const res = await fetch(`${apiBase}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: presetEmail,
          codigo: codigo.replace(/\D/g, ""),
          novaSenha,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setAlertMsg(data.message || "Erro ao resetar senha");
      } else {
        setAlertMsg("Senha alterada com sucesso!");

        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      console.error("reset-senha err:", err);
      setAlertMsg("Erro ao conectar");
    } finally {
      setLoading(false);
    }
  };

  const isBtnDisabled =
    !codigoValidado ||
    !novaSenha ||
    !confirmarSenha ||
    novaSenha !== confirmarSenha;

  if (!open) return null;

  return (
    <>
      {alertMsg && (
        <div className="modal-top-alert entrar">
          {alertMsg}
        </div>
      )}

      <div className="modal-overlay" role="dialog" aria-modal="true">
        <div className="modal-content">
          <button className="modal-close" onClick={onClose}>×</button>

          <h3>Redefinir senha</h3>

          <form onSubmit={handleSubmit}>
            <label>Código</label>
            <PinInput
              length={6}
              value={codigo}
              onChange={setCodigo}
              onComplete={(full) => validarCodigo(full)}
            />

            {codigoValidado && (
              <>
                <label>Nova senha</label>
                <div className="password-wrapper">
                  <input
                    type={mostrarNovaSenha ? "text" : "password"}
                    value={novaSenha}
                    onChange={e => setNovaSenha(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                  >
                    <img src={mostrarNovaSenha ? EyeClosedIcon : EyeOpenIcon} />
                  </button>
                </div>

                <label>Confirmar senha</label>
                <div className="password-wrapper">
                  <input
                    type={mostrarConfirmSenha ? "text" : "password"}
                    value={confirmarSenha}
                    onChange={e => setConfirmarSenha(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setMostrarConfirmSenha(!mostrarConfirmSenha)}
                  >
                    <img src={mostrarConfirmSenha ? EyeClosedIcon : EyeOpenIcon} />
                  </button>
                </div>
              </>
            )}

            <button type="submit" disabled={loading || isBtnDisabled}>
              {loading ? "Aguarde..." : "Alterar senha"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
