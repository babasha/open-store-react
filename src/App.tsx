import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HomePage  } from './page/shop';
import { AdminPanel } from './page/AdminPanel';


export function App() {
  return (
    <Main>
      <Routes>
        <Route path="/"      element={<HomePage  /> }/>
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Main>
  );
}

const Main = styled.div``;
