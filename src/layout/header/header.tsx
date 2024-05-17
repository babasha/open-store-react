import React from 'react';
// import {Logo} from "../../components/logo/logo";
// import {Menu} from "../../components/logo/menu";
import styled from "styled-components";
import { FlexWrapper } from '../../components/FlexWrapper';
import { Container } from '../../components/Container';
// import {Container} from "../../components/Container";
// import {FlexWrapper} from "../../components/FlexWrapper";

const items = ["Home", "Skills", "Works", "Testimony", "Contact",]
export const Header = () => {
    return (
        <StyledHeader>
            <FlexWrapper >
          
            </FlexWrapper>
            <Container>
               <h1>Open market</h1>
            </Container>
        </StyledHeader>
    );
};

const StyledHeader = styled.header`
  /* background-color: rgba(31,31,32, 0.9); */
  background: rgba(255, 255, 255, .7);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
padding: 20px 0 ;
border-radius: 30px;
margin: 15px 0px;


  /* position: fixed; */
  /* top: 0; */
  /* left: 0; */
  /* right: 0; */
  /* z-index: 99999; */
`