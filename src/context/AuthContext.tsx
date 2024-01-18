import axios from 'axios';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { BASE_URL, Storage } from '../utils/Config';

interface AuthContextProps {
  authState?: boolean
  register?: (firstName: string, lastName: string, email: string, password: string, birthdate: Date, sex: string, phoneNumber: string) => Promise<any>;
  login?: (email: string, password: string) => Promise<any>,
  logout?: () => Promise<any>
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
    const loadToken = async () => {
      try {
        const token = await Storage.getString('userToken');

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
      const result = await axios.post(`${BASE_URL}/api/authentication/login`, {
        email,
        password
      });

      setAuthState(true);

      axios.defaults.headers.common['Authorization'] = result.data.token;
      await Storage.set('userToken', JSON.stringify(result.data.token));

      return result.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.result) {
        return { error: error.response.data.result };
      } else {
        throw error;
      }
    }
  }


  const logout = async () => {
    try {
      await axios.post(`${BASE_URL}/api/authentication/logout`, {});

      await Storage.clearAll();
      setAuthState(false);

      axios.defaults.headers.common['Authorization'] = '';
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };

  const forgot = async () => {
    try {

    } catch (error) {

    }
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
