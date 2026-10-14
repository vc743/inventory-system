import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "@/application/pages/auth/login/Login";
import Register from "@/application/pages/auth/register/Register";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { Products } from "../pages/products/Products";
import { Categories } from "../pages/categories/Categories";
import { Movements } from "../pages/movements/Movements";
import { Alerts } from "../pages/alerts/Alerts";
import { Reports } from "../pages/reports/Reports";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { PublicRoute } from "../components/auth/PublicRoute";
import Layout from "../layouts/Layout";

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
      children: [
        {
          element: <Layout />,
          children: [
            { path: "/dashboard", element: <Dashboard /> },
            { path: "/products", element: <Products /> },
            { path: "/categories", element: <Categories /> },
            { path: "/movements", element: <Movements /> },
            { path: "/alerts", element: <Alerts /> },
            { path: "/reports", element: <Reports /> },
          ],
        },
      ],
    },
  ]);

  return (
    <Suspense>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default Router;
