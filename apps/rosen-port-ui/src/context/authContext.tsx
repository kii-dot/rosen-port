import { useState } from 'react';
import { createContainer } from 'unstated-next';

interface AuthData {
  token: string;
  // Add other relevant auth data here
}

function useAuth(initialState: AuthData | null = null) {
  const [authData, setAuthData] = useState<AuthData | null>({ token: 'gorillaToken' });

  const login = (data: AuthData) => {
    // Perform login operations
    setAuthData(data);
  };

  const logout = () => {
    // Perform logout operations
    setAuthData(null);
  };

  return { authData, login, logout };
}

export const AuthContainer = createContainer(useAuth);
