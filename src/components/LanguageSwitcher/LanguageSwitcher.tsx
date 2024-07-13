import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { theme } from '../../styles/Theme';

interface LanguageSwitcherProps {
  onLanguageChange: (lng: string) => void;
}

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'geo', label: 'Georgian' },
  { code: 'it', label: 'Italian' },
  { code: 'pl', label: 'Poland' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'he', label: 'עברית' },
  { code: 'zh', label: '中文' },
  { code: 'hi', label: 'हिंदी' }
];

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ onLanguageChange }) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    onLanguageChange(lng);
    i18n.changeLanguage(lng);
  };

  return (
    <LanguageSwitcherInner>
      {languages.map(({ code, label }) => (
        <LanguageSwitcherBtn key={code} onClick={() => changeLanguage(code)}>
          {label}
        </LanguageSwitcherBtn>
      ))}
    </LanguageSwitcherInner>
  );
};

const LanguageSwitcherBtn = styled.button`
  transition: 0.2s;
  margin: 10px;
  position: relative;
  &:hover {
    background-color: ${theme.colors.primaryBg};
    width: 100%;
  }
`;

const LanguageSwitcherInner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;

export default LanguageSwitcher;