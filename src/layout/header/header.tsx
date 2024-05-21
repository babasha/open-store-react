import React, { useRef, useState } from 'react';
// import {Logo} from "../../components/logo/logo";
// import {Menu} from "../../components/logo/menu";
import styled from "styled-components";
import { FlexWrapper } from '../../components/FlexWrapper';
import { Container } from '../../components/Container';
import LanguageSwitcher from '../../components/LanguageSwitcher/LanguageSwitcher';
import { motion } from 'framer-motion';
import Modal from '../../components/modal/modal';
// import {Container} from "../../components/Container";
// import {FlexWrapper} from "../../components/FlexWrapper";

 export const Header: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsModalOpen(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setIsModalOpen(false);
    }, 300);
  };
    return (
        <StyledHeader>
            <FlexWrapper >  
               <h1>Open market</h1>
              </FlexWrapper>
                 <FlexWrapper justify='center'>
      <Button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
      </Button>
      <Modal 
        isOpen={isModalOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <LanguageSwitcher />
      </Modal>
    </FlexWrapper>


        </StyledHeader>
    );
};


const StyledHeader = styled.header`
  display: flex;
justify-content: space-between;
  /* background-color: rgba(31,31,32, 0.9); */
  background: rgba(255, 255, 255, .7);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
padding: 20px 0 ;
border-radius: 30px;
margin: 15px 0px;
`



const Button = styled(motion.button)`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #6200ee;
  color: white;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #3700b3;
  }
`;