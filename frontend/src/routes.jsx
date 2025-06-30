import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './AppLayout';
import ProtectedRoute from './components/ProtectedRoute';


import Homes from './pages/Homes';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Homes /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'profile', element: <Profile /> },
          { path: 'settings', element: <Settings /> }
        ]
      }
    ]
  }
]);

export default router;
