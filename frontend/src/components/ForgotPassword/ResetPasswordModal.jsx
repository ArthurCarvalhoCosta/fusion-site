import React, { useState, useEffect } from "react";
import PinInput from "./PinInput.jsx";
import "./Modal.css";

import EyeOpenIcon from "@/assets/icons/olho-aberto.svg";
import EyeClosedIcon from "@/assets/icons/olho-fechado.svg";

export default function ResetPasswordModal({ open, onClose, apiBase = "http://localhost:5000", presetEmail }) {
  const [codigo, setCodigo] = useState("");
  const [codigoValidado, setCodigoValidado] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  // novos estados apenas para mostrar/ocultar senha
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmSenha, setMostrarConfirmSenha] = useState(false);

  // reset states when modal opens / presetEmail changes
  useEffect(() => {
    setCodigo("");
    setCodigoValidado(false);
    setNovaSenha("");
    setConfirmarSenha("");
    setAlertMsg("");
    setMostrarNovaSenha(false);
    setMostrarConfirmSenha(false);
  }, [presetEmail, open]);

  // auto-dismiss alert
  useEffect(() => {
    if (alertMsg) {
      const t = setTimeout(() => setAlertMsg(""), 4000);
      return () => clearTimeout(t);
    }
  }, [alertMsg]);

  // valida o codigo chamando /reset-senha sem novaSenha (validação-only)
  const validarCodigo = async (incomingCode) => {
    const codeToUse = (incomingCode || codigo || "").replace(/\D/g, "").trim();
    if (!codeToUse) {
      setAlertMsg("Preencha o código para validar");
      return;
    }
    if (!presetEmail) {
      setAlertMsg("Email não informado (reabra o fluxo)");
      return;
    }

    setLoading(true);
    setAlertMsg("");
    try {
      const res = await fetch(`${apiBase}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // NOT sending novaSenha => backend will only validate
        body: JSON.stringify({ email: presetEmail, codigo: codeToUse }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCodigoValidado(true);
        setAlertMsg("Código validado! Agora insira sua nova senha.");
      } else {
        setCodigoValidado(false);
        setAlertMsg(data.message || "Código inválido ou expirado");
      }
    } catch (err) {
      console.error("validarCodigo err:", err);
      setCodigoValidado(false);
      setAlertMsg("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  // envia troca definitiva de senha (com novaSenha presente)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!codigoValidado) return setAlertMsg("Valide o código antes de alterar a senha");
    if (!novaSenha || !confirmarSenha) return setAlertMsg("Preencha todos os campos");
    if (novaSenha !== confirmarSenha) return setAlertMsg("As senhas não coincidem");

    setLoading(true);
    setAlertMsg("");
    const codigoSanitizado = codigo.replace(/\D/g, "").trim();

    try {
      const res = await fetch(`${apiBase}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: presetEmail, codigo: codigoSanitizado, novaSenha }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAlertMsg(data.message || "Erro ao resetar senha");
      } else {
        setAlertMsg("Senha alterada com sucesso! Faça login com a nova senha.");
          setTimeout(() => {
            onClose();
          }, 2000);
      }
    } catch (err) {
      console.error("reset-senha err:", err);
      setAlertMsg("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const isBtnDisabled = !codigoValidado || !novaSenha || !confirmarSenha || novaSenha !== confirmarSenha;

  if (!open) return null;

  return (
    <>
      {alertMsg && <div className="modal-top-alert">{alertMsg}</div>}
      <div className="modal-overlay" role="dialog" aria-modal="true">
        <div className="modal-content">
          <button className="modal-close" onClick={onClose} aria-label="Fechar">×</button>
          <h3>Redefinir senha</h3>

          <form onSubmit={handleSubmit}>
            <label>Código</label>
            <PinInput
              length={6}
              value={codigo}
              onChange={setCodigo}
              onComplete={(full) => {
                // quando PinInput estiver completo, valida
                validarCodigo(full);
              }}
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
                    aria-label={mostrarNovaSenha ? "Ocultar senha" : "Mostrar senha"}
                  >
                    <img
                      src={mostrarNovaSenha ? EyeClosedIcon : EyeOpenIcon}
                      alt={mostrarNovaSenha ? "Ocultar senha" : "Mostrar senha"}
                    />
                  </button>
                </div>

                <label>Confirmar nova senha</label>
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
                    aria-label={mostrarConfirmSenha ? "Ocultar senha" : "Mostrar senha"}
                  >
                    <img
                      src={mostrarConfirmSenha ? EyeClosedIcon : EyeOpenIcon}
                      alt={mostrarConfirmSenha ? "Ocultar senha" : "Mostrar senha"}
                    />
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
