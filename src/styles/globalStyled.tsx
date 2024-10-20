import { createGlobalStyle } from "styled-components";
import { theme } from "./Theme";

interface GlobalStyledProps {
  isOpen: boolean;
}

export const GlobalStyled = createGlobalStyle<GlobalStyledProps>`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: "inter-variable", sans-serif; /* Измененный шрифт */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: ${theme.colors.font};
    line-height: 1.2;
    background-color: ${theme.colors.primaryBg};
    overflow: ${(props) => (props.isOpen ? 'hidden' : 'auto')};
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
    font-variation-settings: "wght" 600; /* Пример изменения веса */
    font-size: 24px;
    text-transform: uppercase;
    @media (max-width: 1024px) {
      font-size: 22px;
    }
    @media (max-width: 430px) {
      font-size: 18px;
    }
  }

  h2, h3 {
    font-variation-settings: "wght" 500;
    font-size: 20px;
    /* font-weight: 700; */
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
    font-variation-settings: "wght" 400;

    font-size: 16px;
    @media (max-width: 430px) {
      font-size: 14px;
    }
    @media (max-width: 430px) {
      font-size: 12px;
    }
  }

  /* Убираем синий цвет при клике на мобильных устройствах */
  * {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0); 
  }
`;
