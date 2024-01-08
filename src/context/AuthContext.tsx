import React, { createContext, useState, ReactNode } from 'react';

interface AuthContextProps {
  test: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextProps>({test: 'Test Value'});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [test, setTest] = useState('Test Value');

  const contextValue: AuthContextProps = {
    test,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};