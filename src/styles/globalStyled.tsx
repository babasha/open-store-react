import { createGlobalStyle, css } from "styled-components";
import { theme } from "./Theme";


export const GlobalStyled = createGlobalStyle`
  *, *::before, *::after {
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
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }

  a {
    text-decoration: none;
    color: ${theme.colors.font};
  }

  ul {
    list-style: none;
  }

  button {
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

 

  span {
    font-size: 16px;
    @media (max-width: 1024px) {
    font-size: 14px;
  }
  }

  h1 {
    font-weight: 900;
    font-size: 24px;
    text-transform: uppercase;
    @media (max-width: 1024px) {
    font-size: 22px;
  }
  @media (max-width: 430px) {
    font-size: 18px;
  }
  @media (max-width: 430px) {
    font-size: 16px;
  }
  }

  h2, h3 {
    font-size: 20px;
    font-weight: 700;
    line-height: normal;
    letter-spacing: 1px;
    @media (max-width: 1024px) {
    font-size: 16px;
  }
  }

  h3 {
    font-size: 16px;
    @media (max-width: 1024px) {
    font-size: 14px;
  }
  }

  p {
    font-size: 16px;
    font-weight: 400;

    /* @media (max-width: 1024px) {
    font-size: 14px;
  } */
  @media (max-width: 430px) {
    font-size: 14px;
  }
  @media (max-width: 430px) {
    font-size: 12px;
  }
  }
`;
