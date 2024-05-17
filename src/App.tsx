import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Shop } from './page/shop';
import { AdminPanel } from './page/AdminPanel';
import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher';


export function App() {
  return (
    <Main>
       <LanguageSwitcher />
      <Routes>
        <Route path="/"      element={<Shop /> }/>
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Main>
  );
}

const Main = styled.div``;
