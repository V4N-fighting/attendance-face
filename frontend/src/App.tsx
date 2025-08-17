import React, { JSX } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DefaultLayout from './layouts/DefaultLayout';
import { publicRoutes } from './routes';
import AdminLayout from './layouts/AdminLayout';

const layout = 'default';

function App(): JSX.Element {
  return (
    <Router>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  layout === route.layout ? 
                  <DefaultLayout><Page /></DefaultLayout> : 
                  <AdminLayout><Page /></AdminLayout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}



export default App;
