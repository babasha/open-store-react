import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

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

transition: 0.2s;
margin: 10px;   

&:hover {
  
  }
`
const LanguageSwitcherInner = styled.button`
display:flex;

flex-direction: column;
justify-content: center;
`
export default LanguageSwitcher;
