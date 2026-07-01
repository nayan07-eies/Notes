import { createBrowserRouter, RouterProvider as DOMRouterProvider, Navigate } from 'react-router-dom';
import { AppLayout } from '../../widgets/layout/AppLayout';
import SettingsPage from '../../pages/SettingsPage';
import DashboardPage from '../../pages/DashboardPage';
import { AuthLayout } from '../../widgets/layout/AuthLayout';
import LoginPage from '../../pages/Auth/LoginPage';
import SignupPage from '../../pages/Auth/SignupPage';
import HomePage from '../../pages/HomePage';
import ForgotPasswordPage from '../../pages/Auth/ForgotPasswordPage';
import StudyPage from '@/pages/StudyPage';

const router = createBrowserRouter([
  // THE NEW HOME/LANDING PAGE
  {
    path: "/",
    element: <HomePage />,
  },
  // Authentication Routes
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> }
    ]
  },
  // Main Application Routes (Moved dashboard to /dashboard)
  {
    path: "/dashboard",
    element: <AppLayout />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/dashboard/settings", element: <SettingsPage /> },
      {path: "/dashboard/study", element:<StudyPage />}
    ]
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);
export function AppRouter() {
  return <DOMRouterProvider router={router} />;
}