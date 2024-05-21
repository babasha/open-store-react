import React, { useRef, useState } from 'react';
import styled from "styled-components";
import { FlexWrapper } from '../../components/FlexWrapper';
import LanguageSwitcher from '../../components/LanguageSwitcher/LanguageSwitcher';
import { motion } from 'framer-motion';
import Modal from '../../components/modal/modal';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/Theme';


export const Header: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { i18n } = useTranslation();

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

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
    setIsModalOpen(false);
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
          <p>{currentLanguage.toUpperCase()}</p>
      </Button>
      <Modal 
        isOpen={isModalOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <LanguageSwitcher onLanguageChange={handleLanguageChange} />
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
padding: 20px 20px ;
border-radius: 30px;
margin: 15px 0px;
`



const Button = styled(motion.button)`
  padding: 10px 20px;
  border-radius: 5px;
  color: ${theme.colors.font};
  cursor: pointer;
  transition: background-color 0.4s;

  &:hover {
    background-color: ${theme.colors.primaryBg};
  }
`;