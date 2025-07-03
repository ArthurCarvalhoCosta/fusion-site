import {
  HeroContainer,
  ContentWrapper,
  RightContent,
  Title,
  Description,
  CTAButton
} from './Hero'

export const HeroSection = () => {
  return (
    <HeroContainer>
      <ContentWrapper>
        <RightContent>
          <Title>Aqui começa sua jornada para uma vida mais saudável!</Title>
          <Description>
            Crie sua ficha de treino personalizada e alcance seus objetivos com precisão.
            Simples, rápido e do seu jeito.
          </Description>
          <CTAButton>Comece Agora</CTAButton>
        </RightContent>
      </ContentWrapper>
    </HeroContainer>
  )
}
