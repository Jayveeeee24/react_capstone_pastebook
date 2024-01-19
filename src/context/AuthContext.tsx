import axios from 'axios';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { BASE_URL, Colors, Storage } from '../utils/Config';
import { ActivityIndicator } from 'react-native-paper';
import { View } from 'react-native';

interface AuthContextProps {
  authState?: boolean
  loading?: boolean;
  register?: (firstName: string, lastName: string, email: string, password: string, birthdate: Date, sex: string, phoneNumber: string) => Promise<any>;
  login?: (email: string, password: string) => Promise<any>,
  logout?: () => Promise<any>,
  validate?: () => Promise<any>
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = Storage.getString('userToken');

        if (token) {
          axios.defaults.headers.common['Authorization'] = token;

          try {
            const isTokenValid = await validate();

            if (isTokenValid) {
              setAuthState(true);
            } else {
              console.error("Token validation failed:", isTokenValid.msg);
            }
          } catch (error: any) {
            console.error("Error while validating token:", error.message);
          }
        }
      } catch (error) {
        console.error('Error loading token:', error);
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  const validate = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/authentication/validate-token`, {});
      return response.data;
    } catch (e) {
      return { error: true, msg: (e as any).response?.data?.msg || 'Unknown error' };
    }
  };

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
      Storage.set('userToken', JSON.stringify(result.data.token));

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
      Storage.clearAll();
      setAuthState(false);

      await axios.post(`${BASE_URL}/api/authentication/logout`, {});

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
    loading,
    register,
    login,
    logout,
    validate
  };

  return (
    <AuthContext.Provider
      value={contextValue}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primaryBrand} />
        </View>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
