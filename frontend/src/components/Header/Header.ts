import styled from 'styled-components'

export const HeaderContainer = styled.header`
  position: fixed;
  top: 25px;
  left: 50px; right: 50px;
  background-color: #222;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 64px;
  border-radius: 12px;
  z-index: 1000;
`

export const Logo = styled.div`
  width: 48px;
  height: 48px;
  background: #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

export const NavMenu = styled.nav`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`

export const MenuItem = styled.a<{ active?: boolean }>`
  color: ${({ active }) => (active ? '#ff3322' : 'rgba(255, 255, 255, 0.8)')};
  font-weight: ${({ active }) => (active ? 'bold' : 400)};
  text-decoration: none;
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #ff3322;
  }
`

export const ProfileIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255,255,255,0.3);
`
