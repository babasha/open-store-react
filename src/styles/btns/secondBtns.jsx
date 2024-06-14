import styled from "styled-components";
import { theme } from "../Theme";



export const EditButton = styled.button`
  color: ${theme.button.buttonActive};
  cursor: pointer;
  transition: color 0.2s ; 
  &:hover{
     color:${theme.button.buttonHover}
  }
`;

