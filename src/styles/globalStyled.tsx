import {createGlobalStyle} from "styled-components";
import {theme} from "./Theme";

export const GlobalStyled = createGlobalStyle`
  
  *,
  *::before,
  *::after{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    font-family: "Rubik", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: ${theme.colors.font};
    line-height: 1.2;
    background-color: ${theme.colors.primaryBg};
    
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
  }
  
  a{
    text-decoration: none;
    color: ${theme.colors.font};
  }
 ul {
   list-style: none;
 }
 
 button{
   background-color: unset;
   border: none;
   cursor: pointer;
   color: ${theme.colors.font};
 }
  section:nth-of-type(odd) {
    background-color: ${theme.colors.primaryBg};
  }
  section:nth-of-type(even) {
    background-color: ${theme.colors.mainBg};
  }

  h1 {
    font-weight: 900;
    font-size: 24px;
    text-transform: uppercase;
  }
  h2 {
    //font-family: Josefin Sans;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: 1px;
  }
  h3 {
    //font-family: Josefin Sans;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: 1px;
  }

 p{
   font-size: 14px;
   font-weight: 400;
 }
`

