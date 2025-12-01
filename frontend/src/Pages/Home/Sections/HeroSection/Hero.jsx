// HeroSection.jsx
import './Hero.css'
import heroImage from '@/assets/img/hero.png'
import { useNavigate } from 'react-router-dom'

export const HeroSection = () => {
  const navigate = useNavigate()

  // tenta verificar sessão no backend; ajuste o endpoint se necessário.
  async function isLoggedServerSide() {
    try {
      // rota de exemplo: /auth/me ou /api/auth/me — ajuste conforme seu backend
      const res = await fetch('/auth/me', {
        method: 'GET',
        credentials: 'include', // caso use cookie de sessão
        headers: {
          'Accept': 'application/json'
        }
      })
      if (!res.ok) return false
      const data = await res.json()
      // supondo que o backend retorne algo como { user: {...} } se autenticado
      return !!(data && (data.user || data.email || data.id))
    } catch (err) {
      return false
    }
  }

  async function handleStart() {
    // 1) tenta verificar com o backend (mais confiável se usar cookies/sessão)
    const serverOk = await isLoggedServerSide()
    if (serverOk) {
      navigate('/weeklyworkout')
      return
    }

    // 2) fallback simples: token no localStorage (caso você armazene JWT)
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/weeklyworkout')
      return
    }

    // 3) se nada, direciona para login
    navigate('/login')
  }

  return (
    <section
      className="hero-container"
      id="Home"
      aria-label="Seção inicial com chamada para jornada saudável"
    >
      <div className="content-wrapper">
        <div className="right-content">
          <h1 className="title-section">
            Aqui começa sua jornada para uma vida mais saudável!
          </h1>
          <p className="description">
            Crie sua ficha de treino personalizada e alcance seus objetivos com
            precisão. Simples, rápido e do seu jeito.
          </p>
          <button
            className="button"
            type="button"
            onClick={handleStart}
            aria-label="Comece agora sua jornada"
          >
            Comece Agora
          </button>
        </div>
      </div>
    </section>
  )
}
