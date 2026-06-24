import { createBrowserRouter, RouterProvider as DOMRouterProvider } from 'react-router-dom';
import { AppLayout } from '../../widgets/layout/AppLayout';
import NotesPage from '../../pages/Notes/NotesPage';
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children:[

        {
    path: "/",
    element: <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back</p>
    </div>,
  },

        {
    path: "/notes",
    element:<NotesPage/>
    
  },
  {
    path: "/settings",
    element: <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">my Setting</h2>
        <p className="text-muted-foreground">configure AI profiles,billing and system parameter</p>
    </div>,
  }


    ]
  },
  
]);
export function AppRouter() {
  return <DOMRouterProvider router={router} />;
}