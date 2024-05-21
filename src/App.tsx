import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HomePage  } from './page/shop';
import { AdminPanel } from './page/AdminPanel';


export function App() {
  return (
    // <Router basename="/open-store-react">
    <Main>
      <Routes>
        <Route path="/open-store-react"      element={<HomePage  /> }/>
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Main>
    // </Router>
  );
}

const Main = styled.div``;
