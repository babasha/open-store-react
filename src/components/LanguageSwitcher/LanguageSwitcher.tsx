import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { theme } from '../../styles/Theme';

interface LanguageSwitcherProps {
  onLanguageChange: (lng: string) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ onLanguageChange }) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    onLanguageChange(lng);
    i18n.changeLanguage(lng);
  };

  return (
    <LanguageSwitcherInner>
      <LanguageSwitcherBtn onClick={() => changeLanguage('en')}>English</LanguageSwitcherBtn>
      <LanguageSwitcherBtn onClick={() => changeLanguage('ru')}>Русский</LanguageSwitcherBtn>
      <LanguageSwitcherBtn onClick={() => changeLanguage('geo')}>Georgian</LanguageSwitcherBtn>
    </LanguageSwitcherInner> 
  );
};





const LanguageSwitcherBtn = styled.button`
/* margin: 20px; */
/* height: 20px; */
transition: 0.2s;
margin: 10px;   
 /* width: 100%; */
&:hover {
    /* background-color: ${theme.colors.primaryBg}; */
  }
`
const LanguageSwitcherInner = styled.button`
display:flex;
/* align-items: center; */
/* flex-wrap: nowrap; */
flex-direction: column;
justify-content: center;
/* width: 50px; */


`
export default LanguageSwitcher;
