import { HeaderContainer, Logo, NavMenu, MenuItem, ProfileIcon } from './Header'
import logoImg from '../../assets/img/logo.png'

export const Header = () => {
  return (
    <HeaderContainer>
      <Logo>
          <img
            src={logoImg}
            alt="Logo Fusion"
            style={{
              width: '48px',
              height: '48px',
            }}
          />
      </Logo>
      <NavMenu>
        <MenuItem active>Início</MenuItem>
        <MenuItem>Treino</MenuItem>
        <MenuItem>Diferenciais</MenuItem>
        <MenuItem>Como Funciona</MenuItem>
        <MenuItem>Resultados</MenuItem>
        <MenuItem>Contato</MenuItem>
        <MenuItem>Começar</MenuItem>
      </NavMenu>
      <ProfileIcon />
    </HeaderContainer>
  )
}
