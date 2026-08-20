import { createBrowserRouter, Navigate } from "react-router";
import { useApp } from "../app/context/AppContext";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Financeiro from "./pages/Financeiro";
import Cadastro from "./pages/Cadastro";
import Vendas from "./pages/Vendas";
import Compras from "./pages/Compras";
import Configuracoes from "./pages/Configuracoes";
import Usuarios from "./pages/Usuarios";

// ✅ Função para verificar se está logado
function isAuthenticated() {
  const saved = localStorage.getItem("shizen_current_user");
  return !!saved;
}

// ✅ Componente de rota protegida
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// ✅ Componente de redirecionamento baseado no perfil
function DashboardRedirect() {
  const saved = localStorage.getItem("shizen_current_user");
  if (!saved) return <Navigate to="/" replace />;
  
  const user = JSON.parse(saved);
  
  if (user.role === "seller") {
    return <Navigate to="/dashboard/vendas" replace />;
  }
  if (user.role === "stock") {
    return <Navigate to="/dashboard/compras" replace />;
  }
  if (user.role === "financial") {
    return <Navigate to="/dashboard/financeiro" replace />;
  }
  return <Dashboard />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/dashboard",
    Component: Layout,
    children: [
      { 
        index: true, 
        element: (
          <ProtectedRoute>
            <DashboardRedirect />
          </ProtectedRoute>
        )
      },
      { 
        path: "financeiro", 
        element: (
          <ProtectedRoute>
            <Financeiro />
          </ProtectedRoute>
        )
      },
      { 
        path: "cadastro", 
        element: (
          <ProtectedRoute>
            <Cadastro />
          </ProtectedRoute>
        )
      },
      { 
        path: "vendas", 
        element: (
          <ProtectedRoute>
            <Vendas />
          </ProtectedRoute>
        )
      },
      { 
        path: "compras", 
        element: (
          <ProtectedRoute>
            <Compras />
          </ProtectedRoute>
        )
      },
      { 
        path: "configuracoes", 
        element: (
          <ProtectedRoute>
            <Configuracoes />
          </ProtectedRoute>
        )
      },
      { 
        path: "usuarios", 
        element: (
          <ProtectedRoute>
            <Usuarios />
          </ProtectedRoute>
        )
      },
    ],
  },
]);