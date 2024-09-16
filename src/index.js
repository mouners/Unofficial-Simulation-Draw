import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import AboutPage from './pages/AboutPage';
import DrawPage from './pages/DrawPage';
import Layout from './pages/Layout';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Layout>
        <Routes>
          <Route index element={<App />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="draw" element={<DrawPage />} />
        </Routes>
      </Layout>
        
    </Router>
  </React.StrictMode>
);
