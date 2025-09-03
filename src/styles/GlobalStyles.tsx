import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

  * {
    font-family: 'Roboto', sans-serif;
  }
  
  body, html {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
  }
`;

export default GlobalStyles;
