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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensagem("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        setMensagem(data.erro || "Erro desconhecido");
      } else {
        localStorage.setItem("usuario", JSON.stringify(data.cliente));
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao conectar com o servidor");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-carousel">
        <Carousel />
      </div>
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
            <label>
              <input type="checkbox" /> Lembrar de mim
            </label>
            <a href="/reset-password">Esqueci minha senha</a>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {mensagem && <p className="mensagem">{mensagem}</p>}

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
