import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "@/application/pages/auth/login/Login";
import Register from "@/application/pages/auth/register/Register";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { PublicRoute } from "../components/auth/PublicRoute";

const Router = () => {
  const router = createBrowserRouter([
    {
      element: <PublicRoute />,
      children: [
        {
          index: true,
          element: <Login />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
      ],
    },
    {
      element: <ProtectedRoute />,
      children: [{ path: "/dashboard", element: <Dashboard /> }],
    },
  ]);

  return (
    <Suspense>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default Router;
