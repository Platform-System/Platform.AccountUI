import React from 'react';
import { Spinner } from '@platform-system/design-ui';
import { keycloak } from './keycloak';
import { AuthContext, type AuthUser } from './auth-context';

const getEnv = (key: string): string => {
  return (window as unknown as Record<string, Record<string, string>>).__ENV__?.[key] || import.meta.env[key] || '';
};

const accountAppUrl = getEnv('VITE_PUBLIC_ACCOUNT_URL');

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [token, setToken] = React.useState<string | undefined>(undefined);
  const [user, setUser] = React.useState<AuthUser>(null);

  React.useEffect(() => {
    let isActive = true;
    const timeoutId = window.setTimeout(() => {
      if (!isActive) {
        return;
      }
      console.error('🔑 Keycloak initialization timed out in AuthProvider.');
      setIsInitialized(true);
    }, 8000);

    keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false,
      pkceMethod: 'S256',
    })
      .then((authenticated) => {
        if (!isActive) {
          return;
        }

        const nextUser: AuthUser = keycloak.tokenParsed
          ? {
              ...keycloak.idTokenParsed,
              ...keycloak.tokenParsed,
            }
          : null;

        setIsAuthenticated(authenticated);
        setToken(keycloak.token);
        setUser(nextUser);
        setIsInitialized(true);
      })
      .catch((error) => {
        if (!isActive) {
          return;
        }
        console.error('🔑 Keycloak initialization failed in AuthProvider:', error);
        setIsInitialized(true);
      })
      .finally(() => {
        window.clearTimeout(timeoutId);
      });

    return () => {
      isActive = false;
      window.clearTimeout(timeoutId);
    };
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="spinner-accent h-10 w-10" />
          <p className="text-sm font-medium text-muted-foreground">Đang xác thực thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isInitialized, 
      user,
      logout: () => keycloak.logout({ redirectUri: accountAppUrl || window.location.origin }),
      token,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
