import styled from "styled-components";
import { theme } from "../styles/Theme";

type  FlexWrapperPropsType = {
    direction?: string
    justify?: string
    align?: string
    wrap?: string
    width?: string
    top?: string
    bg?: string
    radius?: any 
    bottom?: string  
}

export  const FlexWrapper = styled.div<FlexWrapperPropsType>`
    display: flex;

  flex-direction: ${props => props.direction || 'row'};
  align-items:  ${props => props.align || 'stretch'};
  justify-content: ${props => props.justify || 'flex-start'};
  flex-wrap: ${props => props.wrap || "nowrap"};
  width: ${props => props.width || "auto" };
  haight: 100%;
  margin-top: ${props => props.top || "auto" };
  margin-bottom: ${props => props.bottom || "auto" };
  background-color: ${props => props.bg || "auto" };
  border-radius: ${props => props.radius || "auto"};

`