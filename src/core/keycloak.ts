import { configurePlatformApi, getKeycloak, getValidToken as getValidTokenShared } from '@platform-system/api-client';

const accountAppUrl = import.meta.env.VITE_PUBLIC_ACCOUNT_URL;

configurePlatformApi({
  baseURL: import.meta.env.VITE_API_URL,
  keycloak: {
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
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
