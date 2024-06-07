import React, { useRef, useState } from 'react';
import styled from "styled-components";
import { FlexWrapper } from '../../components/FlexWrapper';
import LanguageSwitcher from '../../components/LanguageSwitcher/LanguageSwitcher';
import { motion } from 'framer-motion';
import Modal from '../../components/modal/modal';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/Theme';

interface HeaderProps {
  activeTab?: 'products' | 'users' | 'orders';
  setActiveTab?: (tab: 'products' | 'users' | 'orders') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
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
      <FlexWrapper>
        <h1>Open market</h1>
      </FlexWrapper>
      {/* <DateSlider/> */}

      {/* <TextInput  label="First Name"/> */}
      <FlexWrapper justify='center'>
        {setActiveTab && (
          <Nav>
            <NavButton
              onClick={() => setActiveTab('products')}
              active={activeTab === 'products'}
            >
              Список товаров
            </NavButton>
            <NavButton
              onClick={() => setActiveTab('users')}
              active={activeTab === 'users'}
            >
              Список клиентов
            </NavButton>
            <NavButton
              onClick={() => setActiveTab('orders')}
              active={activeTab === 'orders'}
            >
              Список заказов
            </NavButton>
          </Nav>
        )}
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
  background: rgba(255, 255, 255, 0.7);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  padding: 20px 20px;
  border-radius: 30px;
  margin: 15px 0px;
`;

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

const Nav = styled.nav`
  display: flex;
  gap: 10px;
`;

const NavButton = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: ${props => (props.active ? '#007bff' : '#ccc')};
  color: white;
  cursor: pointer;
  &:hover {
    background-color: ${props => (props.active ? '#0056b3' : '#aaa')};
  }
`;
