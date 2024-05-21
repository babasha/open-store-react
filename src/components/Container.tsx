import styled from "styled-components";

type  ContainerType = {
      width?: any
      maxwidth ?: number
}
export const Container = styled.div<ContainerType>`
max-width: ${props => props.maxwidth || '1440px'};
width: ${props => props.width || '100%'};
  min-height: 100%;
  margin: 0 auto;
  padding: 0 15px;
`