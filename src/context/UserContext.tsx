import { ReactNode, createContext, useContext } from "react";
import { BASE_URL } from "../utils/Config";
import axios from "axios";


interface UserContextProps {
    changeEmail?: (email: string) => Promise<any>;
    checkCurrentPassword?: (currentPassword: string) => Promise<any>;
    changePassword?: (newPassword: string) => Promise<any>;
}

interface UserProviderProps {
    children: ReactNode;
}

export const UserContext = createContext<UserContextProps>({});

export const useUser = () => {
    return useContext(UserContext);
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {

    const changeEmail = async (email: string) => {
        try {
            const result = await axios
                .put(`${BASE_URL}/api/profile/edit-email/${email}`);

            return result.data;
        } catch (error: any) {
            return error.response.data.result;
        }
    }

    const changePassword = async (password: string) => {
        try {
            const result = await axios
                .put(`${BASE_URL}/api/profile/edit-password/${password}`);
            return result.data;
        } catch (error: any) {
            console.log('check current password error: ' + error);
            return error.response.data.result;
        }
    }

    const checkCurrentPassword = async (currentPassword: string) => {
        try {
            const result = await axios.post(`${BASE_URL}/api/profile/check-password/${currentPassword}`);
            return result.data;
        } catch (error: any) {
            console.log('check current password error: ' + error);
            return error.response.data.result;
        }
    }

    const contextValue: UserContextProps = {
        changeEmail,
        checkCurrentPassword,
        changePassword
    };

    return (
        <UserContext.Provider
            value={contextValue}>
            {children}
        </UserContext.Provider>
    );
}



