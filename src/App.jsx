import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import pages
import Dashboard from './pages/Dashboard';
import BoxesPage from './pages/BoxesPage';
import TasksPage from './pages/TasksPage';
import TransportsPage from './pages/TransportsPage';
import TestPage from './pages/TestPage';

// Import layout components
import Layout from './components/layout/Layout';

// Create a theme with the organization's colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#305076', // Dark blue
    },
    secondary: {
      main: '#F8A444', // Orange
    },
    tertiary: {
      main: '#51B5AE', // Teal
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Segoe UI',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/boxes" element={<BoxesPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/transports" element={<TransportsPage />} />
            <Route path="/test" element={<TestPage />} />
          </Routes>
        </Layout>
      </Router>
      <ToastContainer position="bottom-right" />
    </ThemeProvider>
  );
}

export default App;
