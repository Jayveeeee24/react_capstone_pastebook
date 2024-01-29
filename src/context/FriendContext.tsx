import { ReactNode, createContext, useContext } from "react";
import { BASE_URL, Storage } from "../utils/Config";
import axios from "axios";
import { usePhoto } from "./PhotoContext";


interface FriendContextProps {
    getAllFriends?: (userId: string) => Promise<any>;
    getIsPosterFriend?: (posterId: string, userId: string) => Promise<any>;
    getAllFriendsByUserId?: (userId: string) => Promise<any>;
    getAllSearchUsers?: (name: string) => Promise<any>;
}

interface FriendProviderProps {
    children: ReactNode;
}

export const FriendContext = createContext<FriendContextProps>({});

export const useFriend = () => {
    return useContext(FriendContext);
}

export const FriendProvider: React.FC<FriendProviderProps> = ({ children }) => {
    const { getPhotoById } = usePhoto();

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

    const getIsPosterFriend = async (posterId: string, userId: string) => {
        try {
            const result = await axios.post(`${BASE_URL}/api/friend/get-friend-exist`, { receiverId: posterId, senderId: userId });
            return result.data;
        } catch (error: any) {
            console.log('get poster friend error: ' + error);
            return error.response;
        }
    }

    const getAllFriendsByUserId = async (userId: string) => {
        try {
            const result = await axios.get(`${BASE_URL}/api/friend/get-all-friends/${userId}`);


            if (result && Array.isArray(result.data)) {
                const updatedFriends = await Promise.all(
                    result.data.map(async (friend) => {
                        try {
                            const photoId = friend.photo.id;

                            const photo = getPhotoById ? await getPhotoById(friend.photo.id) : undefined;
                            if (photo) {
                                return {
                                    ...friend,
                                    photo: {
                                        ...friend.photo,
                                        photoImageURL: await photo,
                                    },
                                };
                            } else {
                                console.error(`Error fetching photo for album with ID ${photoId}: Photo not found`);
                                return friend;
                            }
                        } catch (error: any) {
                            console.error("Error fetching photo:", error);
                            return friend;
                        }
                    })
                );

                return updatedFriends;
            } else {
                console.error("Invalid data format:", result.data);
                return [];
            }
        } catch (error: any) {
            return error.response || "An unexpected error occurred";
        }
    }

    const getAllSearchUsers = async (name: string) => {
        try {
            const result = await axios.get(`${BASE_URL}/api/profile/search-users/${name}`);

            // return result.data;
            if (result && Array.isArray(result.data)) {
                const updatedSearch = await Promise.all(
                    result.data.map(async (search) => {
                        try {
                            const photoId = search.photo.id;

                            const photo = getPhotoById ? await getPhotoById(search.photo.id) : undefined;
                            if (photo) {
                                return {
                                    ...search,
                                    photo: {
                                        ...search.photo,
                                        photoImageURL: await photo,
                                    },
                                };
                            } else {
                                console.error(`Error fetching photo for album with ID ${photoId}: Photo not found`);
                                return search;
                            }
                        } catch (error: any) {
                            console.error("Error fetching photo:", error);
                            return search;
                        }
                    })
                );

                return updatedSearch;
            } else {
                console.error("Invalid data format:", result.data);
                return [];
            }
        } catch (error: any) {
            return error.response;
        }
    }

    const contextValue: FriendContextProps = {
        getAllFriends,
        getIsPosterFriend,
        getAllFriendsByUserId,
        getAllSearchUsers
    }

    return (
        <FriendContext.Provider value={contextValue}>
            {children}
        </FriendContext.Provider>
    );
}