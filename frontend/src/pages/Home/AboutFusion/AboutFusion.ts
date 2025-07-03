import styled from 'styled-components'

export const AboutContainer = styled.section`
  background-color: #ff3322;
  color: f3f3f3;
  text-align: center;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
`

export const Description = styled.p`
  max-width: 1000px;
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`

export const ReadMoreButton = styled.button`
  background-color: #f3f3f3;
  color: #ff3322;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  padding: 1rem 2.4rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #f3f3f3;
  }
`
