import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './core/AuthProvider';
import { AccountLayout } from './layouts/AccountLayout';
import { ProfileScreen } from './features/account/screens/ProfileScreen';
import { WalletScreen } from './features/account/screens/WalletScreen';
import { SecurityScreen } from './features/account/screens/SecurityScreen';
import { ThemeProvider } from '@platform-system/design-ui';
import { RootErrorBoundary } from './core/RootErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <RootErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<AccountLayout />}>
                  <Route path="/" element={<Navigate to="/profile" replace />} />
                  <Route path="/profile" element={<ProfileScreen />} />
                  <Route path="/wallet" element={<WalletScreen />} />
                  <Route path="/security" element={<SecurityScreen />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </QueryClientProvider>
      </RootErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
