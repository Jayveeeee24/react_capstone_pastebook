import axios from 'axios';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { BASE_URL, Colors, Storage } from '../utils/Config';
import { ActivityIndicator } from 'react-native-paper';
import { View } from 'react-native';

interface AuthContextProps {
  authState?: boolean;
  loading?: boolean;
  register?: (firstName: string, lastName: string, email: string, password: string, birthdate: Date, sex: string, phoneNumber: string) => Promise<any>;
  login?: (email: string, password: string) => Promise<any>;
  logout?: () => Promise<any>;
  emailAvailability?: (email: string) => Promise<any>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

  const [authState, setAuthState] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      setLoading(true);
      const token = Storage.getString('userToken');

      if (token) {
        // const cleanedToken = token.replace(/^"(.*)"$/, '$1');
        // axios.interceptors.request.use(request => {
        //   console.log('Starting Request', request);
        //   return request;
        // });
        axios.defaults.headers.common['Authorization'] = token;

        axios.get(`${BASE_URL}/api/authentication/validate-token`)
          .then((response: any) => {
            if (response.data == true) {
              setAuthState(true);
            }
          }).catch((e) => {
            console.log('error: ' + e.response.data.result)
            Storage.clearAll();
            setAuthState(false);
            axios.defaults.headers.common['Authorization'] = '';

          }).finally(() => {
            setLoading(false);
          })
      } else {
        setLoading(false);
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
      Storage.set('userToken', result.data.token);

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
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.result) {
        return { error: error.response.data.result };
      } else {
        throw error;
      }
    }
  };

  const forgot = async () => {

  }

  const emailAvailability = async (email: string) => {
    try {
      const result = await axios.post(`${BASE_URL}/api/authentication/check-email-availability/${email}`);
      return result.data; 
    } catch (e) {
      console.log(e);
      return true; 
    }
  };


  const contextValue: AuthContextProps = {
    authState,
    loading,
    register,
    login,
    logout,
    emailAvailability
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
