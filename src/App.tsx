import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Shop } from './styles/shop';
import { AdminPanel } from './page/AdminPanel';

export function App() {
  return (
    <Main>
      <Routes>
        <Route
          path="/"   element={<Shop /> }   />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Main>
  );
}

const Main = styled.div``;
