import { ReactNode, createContext, useContext } from "react";
import { BASE_URL } from "../utils/Config";
import axios from "axios";
import { usePhoto } from "./PhotoContext";


interface FriendContextProps {
    getAllFriends?: (userId: string) => Promise<any>;
}

interface FriendProviderProps {
    children: ReactNode;
}

export const FriendContext = createContext<FriendContextProps>({});

export const useFriend = () => {
    return useContext(FriendContext);
}

export const FriendProvider: React.FC<FriendProviderProps> = ({ children }) => {
    const {getPhotoById} = usePhoto();

    const getAllFriends = async (userId: string) => {
        try {
            const result = await axios.get(`${BASE_URL}/api/friend/get-all-friends/${userId}`);
    
            if (result && Array.isArray(result.data)) {
                const updatedFriends = await Promise.all(
                    result.data.map(async (item: any) => {
                        try {
                            const photoId = item.photoId;
                            const photo = getPhotoById ? await getPhotoById(photoId) : undefined;
    
                            if (photo) {
                                return {
                                    ...item,
                                    photo: {
                                        ...item.photo,
                                        photoImageURL: photo,
                                    },
                                };
                            } else {
                                console.error(`Error fetching photo for friend with ID ${item.id}: Photo not found`);
                                return item; 
                            }
                        } catch (error: any) {
                            console.error("Error fetching photo:", error);
                            return item; 
                        }
                    })
                );
    
                return updatedFriends;
            } else {
                console.error("Invalid data format:", result.data);
                return [];
            }
        } catch (error: any) {
            console.error("Error fetching friends:", error.response?.data?.result || "An unexpected error occurred");
            return [];
        }
    };
    

    const contextValue: FriendContextProps = {
        getAllFriends
    }

    return (
        <FriendContext.Provider value={contextValue}>
            {children}
        </FriendContext.Provider>
    );
}