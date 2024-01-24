import { ReactNode, createContext, useContext } from "react";


interface FriendContextProps{

}

interface FriendProviderProps{
    children: ReactNode;
}

export const FriendContext = createContext<FriendContextProps>({});

export const useFriend = () => {
    return useContext(FriendContext);
} 

export const FriendProvider: React.FC<FriendProviderProps> = ({children}) => {
    

    const contextValue: FriendContextProps = {

    }

    return(
        <FriendContext.Provider  value={contextValue}>
            {children}
        </FriendContext.Provider>
    );
}