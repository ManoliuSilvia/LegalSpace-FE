import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Layout } from "./components/navigation/Layout";
import Dashboard from "./pages/Dashboard";
import SubmitCasePage from "./pages/SubmitCasePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { RequireAuth } from "./components/navigation/RequireAuth";
import MyCases from "./pages/MyCases";
import LawyersPage from "./pages/LawyersPage";
import AvailableCases from "./pages/AvailableCases";
import Settings from "./pages/Settings";
import UsersPage from "./pages/UsersPage";
import Chat from "./pages/Chat";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Auth routes - no layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes with layout - wrapped in RequireAuth */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="submit-case" element={<SubmitCasePage />} />
          <Route path="my-cases" element={<MyCases />} />
          <Route path="lawyers" element={<LawyersPage />} />
          <Route path="cases" element={<AvailableCases />} />
          <Route path="chats" element={<Chat />} />
          <Route path="chat/:receiverId" element={<Chat />} />
          <Route path="settings" element={<Settings />} />
          <Route path="users" element={<UsersPage />} />
        </Route>

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
