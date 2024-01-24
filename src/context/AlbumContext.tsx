import axios from "axios";
import { ReactNode, createContext, useContext } from "react";
import { BASE_URL } from "../utils/Config";
import { usePhoto } from "./PhotoContext";


interface AlbumContextProps {
    getUploadsAlbumId?: () => Promise<any>;
    getAllAlbums?: () => Promise<any>;
}

interface AlbumProviderProps {
    children: ReactNode;
}

export const AlbumContext = createContext<AlbumContextProps>({});

export const useAlbum = () => {
    return useContext(AlbumContext);
}

export const AlbumProvider: React.FC<AlbumProviderProps> = ({ children }) => {
    const { getPhotoById } = usePhoto();

    const getUploadsAlbumId = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/api/album/get-uploads-album-id`);
            return result.data;
        } catch (error: any) {
            return error.response.data.result;
        }
    }

    const getAllAlbums = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/api/album/get-mini-album`);

            if (result && Array.isArray(result.data)) {
                const updatedAlbums = await Promise.all(
                    result.data.map(async (item: { firstPhoto: any }) => {
                        try {
                            const photo = getPhotoById? await getPhotoById(item.firstPhoto.id) : undefined;
                            return {
                                ...item,
                                firstPhoto: {
                                    ...item.firstPhoto,
                                    photo: await photo,
                                },
                            };
                        } catch (error) {
                            console.error("Error fetching photo:", error);
                            return item;
                        }
                    })
                );

                return updatedAlbums;
            } else {
                // Handle the case where result.data is not an array
                console.error("Invalid data format:", result.data);
                return [];
            }
        } catch (error: any) {
            return error.response?.data?.result || "An unexpected error occurred";
        }
    };

    const contextValue: AlbumContextProps = {
        getUploadsAlbumId,
        getAllAlbums
    }

    return (
        <AlbumContext.Provider value={contextValue}>
            {children}
        </AlbumContext.Provider>
    );
}
