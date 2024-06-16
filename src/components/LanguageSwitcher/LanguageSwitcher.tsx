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
      <LanguageSwitcherBtn onClick={() => changeLanguage('it')}>Italian</LanguageSwitcherBtn>
      <LanguageSwitcherBtn onClick={() => changeLanguage('pl')}>Poland</LanguageSwitcherBtn>
      <LanguageSwitcherBtn onClick={() => changeLanguage('es')}>Español</LanguageSwitcherBtn>
      <LanguageSwitcherBtn onClick={() => changeLanguage('de')}>Deutsch</LanguageSwitcherBtn>
      <LanguageSwitcherBtn onClick={() => changeLanguage('tr')}>Türkçe</LanguageSwitcherBtn>
      <LanguageSwitcherBtn onClick={() => changeLanguage('he')}>עברית</LanguageSwitcherBtn>
      <LanguageSwitcherBtn onClick={() => changeLanguage('zh')}>中文</LanguageSwitcherBtn>
      <LanguageSwitcherBtn onClick={() => changeLanguage('hi')}>हिंदी</LanguageSwitcherBtn>
    </LanguageSwitcherInner>
  );
};

const LanguageSwitcherBtn = styled.button`
  transition: 0.2s;
  margin: 10px;
  &:hover {
    background-color: ${theme.colors.primaryBg};
    width: 100%;
  }
`;

const LanguageSwitcherInner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export default LanguageSwitcher;
