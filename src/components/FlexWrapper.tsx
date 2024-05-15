import styled from "styled-components";

type  FlexWrapperPropsType = {
    direction?: string
    justify?: string
    align?: string
    wrap?: string
    width?: string
    top?: string
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

`