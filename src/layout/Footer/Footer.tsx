import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/Theme';

const Footer: React.FC = () => {
  const { t } = useTranslation();


  const handleRedirect = (url: string) => {
    window.open(url, '_blank'); // Открытие документа в новой вкладке
  };
  

  return (
    <FooterContainer>
      <FooterContent>
      


        <FooterLinks>
        <LinkParagraph onClick={() => handleRedirect('https://docs.google.com/document/d/12QGEtJtfFkD540SK1-LK6LI0GAkW6tmqwNaCm-ZzHJI/edit#heading=h.5mtlu7tpglhg')}>
            User Agreement
          </LinkParagraph>
          <LinkParagraph onClick={() => handleRedirect('https://docs.google.com/document/d/1rmPah6C7OyL1lhSZmwnr7gfttWOHJ_aEqVnxxRrjZwU/edit')}>
          Privacy Policy
          </LinkParagraph>
          <LinkParagraph onClick={() => handleRedirect('https://docs.google.com/document/d/1_4KxKOodcaTTsAVcMnU2SPBWC6tPO3b8qx6O8lXDUyU/edit')}>
          Service Provision Agreement 
          </LinkParagraph>
          <LinkParagraph onClick={() => handleRedirect('https://docs.google.com/document/d/1p3wTiD0EJ0r_5cjzYNRNEl_1SHURs7aUxRu_0VuJDzg/edit')}>
          Information on the processing of personal data 
          </LinkParagraph>
        </FooterLinks>
        <FooterText>© {new Date().getFullYear()} enddel.com </FooterText>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;

const FooterContainer = styled.footer`
  background-color: #f8f9fa;
  padding: 20px 0;
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
  gap: 30px;
`;

const FooterText = styled.p`
  color: #6c757d;
  font-size: 14px;
  margin: 0;
`;




const LinkParagraph = styled.p`
  cursor: pointer;
  color: ${theme.colors.font};
  /* text-decoration: underline; */
  &:hover {
    color: #000000;
  }
`;