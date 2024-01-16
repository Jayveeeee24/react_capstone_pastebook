import axios from 'axios';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { BASE_URL, storage } from '../utils/config';

interface AuthContextProps {
  authState?: boolean
  register?: (firstName: string, lastName: string, email: string, password: string, birthdate: Date, sex: string, phoneNumber: string) => Promise<any>;
  login?: (email: string, password: string) => Promise<any>,
  logout?: () => void
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextProps>({
});

export const useAuth = () => {
  return useContext(AuthContext);
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

  const [authState, setAuthState] = useState(false);



  useEffect(() => {
    const loadToken = () => {
      try {
        const token = storage.getString('userToken');

        if (token) {
          axios.defaults.headers.common['Authorization'] = token;
          setAuthState(true);
        }
      } catch (error) {
        console.error('Error loading token:', error);
      }
    };

    loadToken();
  }, []);



  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    birthdate: Date,
    sex: string,
    phoneNumber: string
  ) => {
    try {
      return axios
        .post(`${BASE_URL}/api/authentication/register`, {
          firstName,
          lastName,
          email,
          password,
          birthdate,
          sex,
          phoneNumber,
        })
    } catch (e) {
      return { error: true, msg: (e as any).response.data.msg };
    }

  };

  const login = async (email: string, password: string) => {
    try {
      const result = await axios
        .post(`${BASE_URL}/api/authentication/login`, {
          email,
          password
        });

      setAuthState(true);

      axios.defaults.headers.common['Authorization'] = result.data.token;
      await storage.set('userToken', JSON.stringify(result.data.token));

      return result;
    } catch (e) {
      return { error: true, msg: (e as any).response.data.msg };
    }
  }

  const logout = async () => {
    await storage.clearAll();

    axios.defaults.headers.common['Authorization'] = '';

    setAuthState(false);
  }

  const contextValue: AuthContextProps = {
    authState,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider
      value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
