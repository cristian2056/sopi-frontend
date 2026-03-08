// src/app/routes.jsx
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { RequireAuth, PublicRoute } from "../components/auth/AuthGuards";

import AppLayout    from "../components/layout/AppLayout.jsx";
import Dashboard    from "../pages/Dashboard";
import MarcasPage   from "../pages/Marcas/MarcasPage";
import LoginPage    from "../pages/Login/LoginPage";
import EquiposPage  from "../pages/Equipo/EquiposPage";
import EquipoDetalle from "../pages/Equipo/EquipoDetalle";
import PersonalPage  from "../pages/Personal/PersonalPage";
import PersonaDetalle from "../pages/Personal/PersonaDetalle";



export const router = createBrowserRouter([

  {
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <LoginPage /> },
    ],
  },

  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          { index: true,     element: <Dashboard /> },
          { path: "marcas",  element: <MarcasPage /> },
          { path: "equipos", element: <EquiposPage /> },
          { path: "equipos/:id", element: <EquipoDetalle /> },
          { path: "personal", element: <PersonalPage /> },
          { path: "personal/:id", element: <PersonaDetalle /> },
          { path: "personal/:id", element: <PersonaDetalle /> },
        ],
      },
    ],
  },

]);