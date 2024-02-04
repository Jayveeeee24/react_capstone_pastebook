import { ReactNode, createContext, useContext } from "react";
import { BASE_URL, MmkvStorage } from "../utils/GlobalConfig";
import axios from "axios";
import { usePhoto } from "./PhotoContext";


interface FriendContextProps {
    getAllFriends?: (userId: string) => Promise<any>;
    getIsPosterFriend?: (posterId: string) => Promise<any>;
    getAllFriendsByUserId?: (userId: string) => Promise<any>;
    getAllSearchUsers?: (name: string) => Promise<any>;
    getAllFriendRequest?: () => Promise<any>;
    acceptFriendRequest?: (requestId: string) => Promise<any>;
    rejectFriendRequest?: (requestId: string) => Promise<any>;
    getFriendRequestsCount?: () => Promise<any>;
    getFriendExist?: (receiverId: string, senderId: string) => Promise<any>;
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

    const getIsPosterFriend = async (posterId: string) => {
        try {
            const result = await axios.get(`${BASE_URL}/api/friend/is-poster-friend/${posterId}`);
            return result;
        } catch (error: any) {
            console.log('get poster friend error: ' + error);
            return Promise.reject(error);
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

    const getAllFriendRequest = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/api/friend/get-all-friend-request`);

            if (result && Array.isArray(result.data)) {
                const updatedFriendRequests = await Promise.all(
                    result.data.map(async (friendRequest) => {
                        const updatedFriendRequest = { ...friendRequest, commentsCount: 0, likesCount: 0, friend: {} };

                        // if (updatedFriendRequest.receiver.photo && updatedFriendRequest.receiver.photo.id) {
                        //     updatedFriendRequest.receiver.photo.photoImageURL = getPhotoById ? await getPhotoById(updatedFriendRequest.receiver.photo.id) : undefined;
                        // }

                        if (updatedFriendRequest.sender.photo && updatedFriendRequest.sender.photo.id) {
                            updatedFriendRequest.sender.photo.photoImageURL = getPhotoById ? await getPhotoById(updatedFriendRequest.sender.photo.id) : undefined;
                        }


                        return updatedFriendRequest;
                    })
                );

                return updatedFriendRequests;
            } else {
                console.error("Invalid data format received from the server");
                return result.data;
            }
        } catch (error: any) {
            console.log('get friend requests error: ' + error);
            return error.response;
        }
    }

    const acceptFriendRequest = async (requestId: string) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/friend/accept-friend/${requestId}`);
            return response.data;
        } catch (error: any) {
            return error.response;
        }
    }

    const rejectFriendRequest = async (requestId: string) => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/friend/reject-friend/${requestId}`);
            return response.data;
        } catch (error: any) {
            return error.response;
        }
    }

    const getFriendRequestsCount = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/api/friend/get-all-friend-request-count`);

            return result.data;
        } catch (error: any) {
            console.log('get friend count error: ' + error);
            return error.response;
        }
    }

    const getFriendExist = async (receiverId: string, senderId: string) => {
        // console.log("receiverId " + receiverId);
        //     // console.log("senderId " + senderId);
        //     // console.log(axios.defaults.headers.common["Authorization"]);
        //     // axios.interceptors.request.use(request => {
        //     //   console.log('Starting Request', request);
        //     //   return request;
        //     // });
        try {
            const result = await axios.post(`${BASE_URL}/api/friend/get-friend-exist`, { receiverId, senderId });
            return result.data;
        } catch (error: any) {
            // console.log('get friend exist error: ' + error);
            return error.response.data;
        }
    }

    const contextValue: FriendContextProps = {
        getAllFriends,
        getIsPosterFriend,
        getAllFriendsByUserId,
        getAllSearchUsers,
        getAllFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
        getFriendRequestsCount,
        getFriendExist
    }

    return (
        <FriendContext.Provider value={contextValue}>
            {children}
        </FriendContext.Provider>
    );
}