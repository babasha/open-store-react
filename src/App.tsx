// import React, { useState } from 'react';
// import styled from 'styled-components';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { Shop } from './page/shop';
// import { AdminPanel } from './page/AdminPanel';
// import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher';
// import ProtectedRoute from './layout/Protect/ProtectedRoute';
// import Login from './layout/autoeization/Login';


// export function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   return (
//     // <Router>
//     <>
//       <Routes>
//         <Route path="/" element={<Shop />} />
//         <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute isAuthenticated={isAuthenticated}>
//               <AdminPanel />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </>
//     // </Router>
//   );
// }

// export default App;

import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Shop } from './page/shop';
import AdminPanel from './page/AdminPanel';
import Login from './layout/autoeization/Login';
import ProtectedRoute from './layout/Protect/ProtectedRoute';
import { AuthProvider } from './layout/autoeization/AuthContext';

export function App() {
  return (
    <AuthProvider>
        <Main>
          <Routes>
            <Route path="/" element={<Shop />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Main>
    </AuthProvider>
  );
}

const Main = styled.div``;

export default App;
