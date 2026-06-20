import { configurePlatformApi, getKeycloak, getValidToken as getValidTokenShared } from '@platform-system/api-client';

const getEnv = (key: string): string => {
  return (window as unknown as Record<string, Record<string, string>>).__ENV__?.[key] || import.meta.env[key] || '';
};

const accountAppUrl = getEnv('VITE_PUBLIC_ACCOUNT_URL');

configurePlatformApi({
  baseURL: getEnv('VITE_API_URL'),
  keycloak: {
    url: getEnv('VITE_KEYCLOAK_URL'),
    realm: getEnv('VITE_KEYCLOAK_REALM'),
    clientId: getEnv('VITE_KEYCLOAK_CLIENT_ID'),
    redirectUri: accountAppUrl || (typeof window !== 'undefined' ? window.location.origin : undefined),
  },
  onUnauthorized: () => {
    const kc = getKeycloak();
    if (kc) {
      kc.logout({ redirectUri: accountAppUrl || window.location.origin });
    }
  }
});

export const keycloak = getKeycloak()!;

export const getValidToken = getValidTokenShared;
