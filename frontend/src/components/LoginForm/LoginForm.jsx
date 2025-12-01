// frontend/src/components/LoginForm/LoginForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

import EyeOpenIcon from "@/assets/icons/olho-aberto.svg";
import EyeClosedIcon from "@/assets/icons/olho-fechado.svg";

import ForgotPasswordModal from "../ForgotPassword/ForgotPasswordModal";
import ResetPasswordModal from "../ForgotPassword/ResetPasswordModal";

export default function LoginForm({
  apiBase = process.env.BACKEND_URL || "http://localhost:5000",
  apiPath = "/api/auth/login",
  redirectTo = "/",
  userType = "Aluno",
  onSuccess,
}) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [mostrarMensagem, setMostrarMensagem] = useState(false);
  const [loading, setLoading] = useState(false);

  const [openForgot, setOpenForgot] = useState(false);
  const [openReset, setOpenReset] = useState(false);
  const [presetEmail, setPresetEmail] = useState("");

  const navigate = useNavigate();

  // 🔴 Mensagem de erro
  const mostrarErro = (texto) => {
    setMensagem(texto);
    setMostrarMensagem(true);
    setTimeout(() => setMostrarMensagem(false), 3000);
  };

  // 🟢 Mensagem de sucesso
  const mostrarSucesso = (texto) => {
    setMensagem(`sucesso: ${texto}`);
    setMostrarMensagem(true);
    setTimeout(() => setMostrarMensagem(false), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensagem("");
    setMostrarMensagem(false);
    setLoading(true);

    try {
      const res = await fetch(`${apiBase}${apiPath}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha, userType }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        mostrarErro(data.erro || data.message || "Erro desconhecido");
      } else {
        mostrarSucesso("Login realizado com sucesso!");

        const rawUser = data.cliente ?? data.user ?? {};

        let avatarUrl = rawUser.avatarUrl ?? rawUser.avatar ?? "";
        if (avatarUrl && avatarUrl.startsWith("/uploads")) {
          avatarUrl = `${apiBase.replace(/\/$/, "")}${avatarUrl}`;
        }
        if (!avatarUrl) avatarUrl = "";

        const userToStore = {
          _id: rawUser._id ?? rawUser.id,
          nome: rawUser.nome ?? rawUser.name ?? "",
          email: rawUser.email ?? "",
          tipo: rawUser.tipo ?? rawUser.role ?? rawUser.type ?? "",
          cpf: rawUser.cpf ?? rawUser.documento ?? "",
          modalidade: rawUser.modalidade ?? rawUser.modality ?? "",
          plano: rawUser.plano ?? rawUser.plan ?? "",
          avatarUrl,
          ...rawUser,
        };

        try {
          localStorage.setItem("usuario", JSON.stringify(userToStore));
          localStorage.setItem("user", JSON.stringify(userToStore));
          if (userToStore._id) localStorage.setItem("userId", userToStore._id);
          if (userToStore.email) localStorage.setItem("userEmail", userToStore.email);
        } catch (err) {
          console.warn("Erro ao gravar localStorage:", err);
        }

        if (data.token) {
          try {
            localStorage.setItem("token", data.token);
          } catch (err) {
            console.warn("Erro ao gravar token:", err);
          }
        }

        if (typeof onSuccess === "function") onSuccess(data);
        else navigate(redirectTo);
      }
    } catch (err) {
      console.error("Erro ao conectar com o backend:", err);
      mostrarErro("Não foi possível conectar ao servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForgot = (e) => {
    if (e) e.preventDefault();
    setOpenForgot(true);
  };

  const handleKodSent = (sentEmail) => {
    setOpenForgot(false);
    setPresetEmail(sentEmail || "");
    setOpenReset(true);
  };

  return (
    <div className={`login-form-component ${userType.toLowerCase()}`}>
      <h2>Entrar como {userType}</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />

        <div className="password-wrapper">
          <input
            type={mostrarSenha ? "text" : "password"}
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
          >
            <img
              src={mostrarSenha ? EyeClosedIcon : EyeOpenIcon}
              alt={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            />
          </button>
        </div>

        <div className="login-options">
          <label className="checkbox">
            <input type="checkbox" />
            <span className="checkbox-box" aria-hidden="true"></span>
            Lembrar de mim
          </label>

          <a href="#" onClick={handleOpenForgot} className="forgot-link">
            Esqueci minha senha
          </a>
        </div>

        <button type="submit" disabled={loading} className="submit">
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {mensagem && (
          <div
            className={`mensagem ${mostrarMensagem ? "entrar" : "sair"} ${
              mensagem.includes("sucesso") ? "sucesso" : "erro"
            }`}
          >
            {mensagem.replace("sucesso: ", "")}
          </div>
        )}
      </form>

      <ForgotPasswordModal
        open={openForgot}
        onClose={() => setOpenForgot(false)}
        apiBase={apiBase}
        onSent={(emailSent) => handleKodSent(emailSent)}
      />

      <ResetPasswordModal
        open={openReset}
        onClose={() => setOpenReset(false)}
        apiBase={apiBase}
        presetEmail={presetEmail}
      />
    </div>
  );
}
