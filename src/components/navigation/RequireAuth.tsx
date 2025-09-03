import { useEffect } from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { userStore } from "../../stores/userStore";
import { isTokenExpired } from "../../utils/auth";

interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation();
  const { user, token, isAuthenticated, logout, authenticate } = userStore();

  useEffect(() => {
    if (!isAuthenticated || !user || !token) {
      const storedData = localStorage.getItem("legal-app-storage");
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          const storedState = parsedData.state;

          if (storedState && storedState.user && storedState.token) {
            if (!isTokenExpired(storedState.token)) {
              authenticate(storedState.user, storedState.token);
            } else {
              logout();
            }
          }
        } catch (e) {
          console.error("Error parsing stored auth data", e);
          logout();
        }
      }
    } else if (token && isTokenExpired(token)) {
      logout();
    }
  }, [isAuthenticated, user, token, authenticate, logout]);

  if (!userStore.getState().isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
