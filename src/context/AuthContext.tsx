import axios from 'axios';
import React, { createContext, ReactNode, useState } from 'react';
import { BASE_URL, storage } from '../utils/config';

interface AuthContextProps {
  register: (firstName: string, lastName: string, email: string, password: string, birthdate: Date, sex: string, phoneNumber: string) => void;
  userInfo: {};
  isLoading: boolean
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextProps>({
  register: () => { },
  userInfo: {},
  isLoading: false
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const register = (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    birthdate: Date,
    sex: string,
    phoneNumber: string
  ) => {
    setIsLoading(true);
    axios
      .post(`${BASE_URL}/api/authentication/register`, {
        firstName,
        lastName,
        email,
        password,
        birthdate,
        sex,
        phoneNumber,
      })
      .then((response) => {
        let userInfo = response.data;
        setUserInfo(userInfo);
        storage.set('userInfo', JSON.stringify(userInfo));
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(`error ${e}`);
        setIsLoading(false);
      });
  };

  const login = (email: string, password: string) => {
    axios
      .post
  }

  // const contextValue: AuthContextProps = {
  //   register,
  // };

  return (
    <AuthContext.Provider
      value={{ isLoading, userInfo, register }}>
      {children}
    </AuthContext.Provider>
  );
};
