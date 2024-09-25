import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/Theme';
import { FlexWrapper } from '../../components/FlexWrapper';

const Footer: React.FC = () => {
  const { t } = useTranslation(); // Инициализация функции перевода

  const handleRedirect = (url: string) => {
    window.open(url, '_blank'); // Открытие документа в новой вкладке
  };

  return (
    <FooterContainer>
      <FooterContent>
        <FooterLinks>
          {/* Использование функции t() для перевода */}
          <LinkParagraph onClick={() => handleRedirect('https://docs.google.com/document/d/12QGEtJtfFkD540SK1-LK6LI0GAkW6tmqwNaCm-ZzHJI/pub')}>
            {t('user_agreement')} {/* Перевод "Пользовательское соглашение" */}
          </LinkParagraph>
          <LinkParagraph onClick={() => handleRedirect('https://docs.google.com/document/d/1rmPah6C7OyL1lhSZmwnr7gfttWOHJ_aEqVnxxRrjZwU/pub')}>
            {t('privacy_policy')} {/* Перевод "Политика конфиденциальности" */}
          </LinkParagraph>
          <LinkParagraph onClick={() => handleRedirect('https://docs.google.com/document/d/1_4KxKOodcaTTsAVcMnU2SPBWC6tPO3b8qx6O8lXDUyU/pub')}>
            {t('service_provision_agreement')} {/* Перевод "Договор на оказание услуг" */}
          </LinkParagraph>
          <LinkParagraph onClick={() => handleRedirect('https://docs.google.com/document/d/1p3wTiD0EJ0r_5cjzYNRNEl_1SHURs7aUxRu_0VuJDzg/pub')}>
            {t('data_processing_information')} {/* Перевод "Информация об обработке персональных данных" */}
          </LinkParagraph>
        </FooterLinks>
        <FlexWrapper >
        <FooterText> made in georgia </FooterText>
        <FooterText>   © {new Date().getFullYear()}enddel.com</FooterText>

        </FlexWrapper>
        
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;

const FooterContainer = styled.footer`
  background-color: #f8f9fa;
  padding: 20px 10px;
  margin-top: 15px;
  border-radius: 20px;
  text-align: center;
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FooterLinks = styled.div`
  margin-bottom: 10px;
  display: flex;
  gap: 10px;
  
  @media (max-width: 1024px) {
    font-size: 10px;
  }
`;

const FooterText = styled.p`
  color: #6c757d;
  font-size: 14px;
  margin: 0;
  @media (max-width: 1024px) {
    font-size: 12px;
  }
`;

const LinkParagraph = styled.p`
  cursor: pointer;
  color: ${theme.colors.font};
  &:hover {
    color: #000000;
  }
  
  @media (max-width: 1024px) {
    font-size: 12px;
  }
  @media (max-width: 421px) {
    font-size: 10px;
  }
`;
