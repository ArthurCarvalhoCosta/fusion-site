import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Carousel from "./Carousel/Carousel";
import "./Login.css";

import { FcGoogle } from "react-icons/fc";
import EyeOpenIcon from "../../assets/img/olho-aberto.svg";
import EyeClosedIcon from "../../assets/img/olho-fechado.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [mostrarMensagem, setMostrarMensagem] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensagem("");
    setMostrarMensagem(false);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 🔑 aqui corrigimos: backend espera "senha"
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        mostrarErro(data.erro || data.message || "Erro desconhecido");
      } else {
        // salva usuário no localStorage
        localStorage.setItem("usuario", JSON.stringify(data.cliente));
        navigate("/");
      }
    } catch (err) {
      console.error("Erro ao conectar com o backend:", err);
      mostrarErro("Não foi possível conectar ao servidor");
    } finally {
      setLoading(false);
    }
  };

  const mostrarErro = (texto) => {
    setMensagem(texto);
    setMostrarMensagem(true);
    setTimeout(() => setMostrarMensagem(false), 3000);
  };

  return (
    <div className="login-page">
      {/* Lado esquerdo - Carousel */}
      <div className="login-carousel">
        <Carousel />
      </div>

      {/* Lado direito - Formulário */}
      <div className="login-form">
        <h2>Entre em sua conta</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-wrapper">
            <input
              type={mostrarSenha ? "text" : "password"}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
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

            <a href="/reset-password">Esqueci minha senha</a>
          </div>

          <button type="submit" disabled={loading} className="submit">
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {mensagem && (
            <div className={`mensagem ${mostrarMensagem ? "entrar" : "sair"}`}>
              {mensagem}
            </div>
          )}

          <div className="divider">
            <span>ou entre com</span>
          </div>

          <div className="google-login">
            <button type="button" className="google-btn">
              <FcGoogle className="google-icon" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;