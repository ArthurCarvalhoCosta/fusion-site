import styled from 'styled-components'
import bgImage from '../../../assets/img/hero.png' // ajuste o caminho se necessário

export const HeroContainer = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  background-image: url(${bgImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

export const ContentWrapper = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
`

export const RightContent = styled.div`
  background-color: #333;
  color: white;
  height: 124vh;
  width: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 85%, 50% 95%, 0 85%);
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 2;
`

export const Title = styled.h1`
  font-size: 3.2rem;
  font-weight: normal;
  margin-bottom: 1rem;
  color: f3f3f3;
`

export const Description = styled.p`
  font-size: 1.2rem;
  width: 520px;
  margin-bottom: 2rem;
  color: #f3f3f3;
`

export const CTAButton = styled.button`
  width: 240px; height: 64px;
  background-color: #ff3322;
  color: white;
  font-weight: bold;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: #e63323;
  }
`
