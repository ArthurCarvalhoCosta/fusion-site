import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'montserrat', sans-serif;
    background-color: #0;
    color: #f3f3f3;
  }

  button, input, textarea {
    font-family: montserrat;
  }
`
