import './Header.css'
import logoImg from '../../assets/img/logo.png'

export const Header = () => {
  return (
    <header className="header-container">
      <div className="logo">
        <img
          src={logoImg}
          alt="Logo Fusion"
          style={{ width: '48px', height: '48px' }}
        />
      </div>

      <nav className="nav-menu">
        <span className="menu-item active">Início</span>
        <span className="menu-item">Treino</span>
        <span className="menu-item">Diferenciais</span>
        <span className="menu-item">Como Funciona</span>
        <span className="menu-item">Resultados</span>
        <span className="menu-item">Contato</span>
        <span className="menu-item">Começar</span>
      </nav>

      <div className="profile-icon" />
    </header>
  )
}
