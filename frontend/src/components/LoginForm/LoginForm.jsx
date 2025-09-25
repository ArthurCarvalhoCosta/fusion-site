import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

import EyeOpenIcon from "../../assets/icons/olho-aberto.svg";
import EyeClosedIcon from "../../assets/icons/olho-fechado.svg";

export default function LoginForm({
  apiBase = "http://localhost:5000",
  apiPath = "/api/auth/login",
  redirectTo = "/",
  userType = "Aluno", // novo
  onSuccess,
}) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [mostrarMensagem, setMostrarMensagem] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const mostrarErro = (texto) => {
    setMensagem(texto);
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

      const data = await res.json();

      if (!res.ok) {
        mostrarErro(data.erro || data.message || "Erro desconhecido");
      } else {
        localStorage.setItem("usuario", JSON.stringify(data.cliente ?? data.user ?? {}));
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
          <a href="/reset-password" className="forgot-link">Esqueci minha senha</a>
        </div>

        <button type="submit" disabled={loading} className="submit">
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {mensagem && (
          <div className={`mensagem ${mostrarMensagem ? "entrar" : "sair"}`}>
            {mensagem}
          </div>
        )}
      </form>
    </div>
  );
}
