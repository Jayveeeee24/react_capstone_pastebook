import axios from "axios";
import { ReactNode, createContext, useContext } from "react";
import { BASE_URL } from "../utils/Config";
import { usePhoto } from "./PhotoContext";


interface AlbumContextProps {
    getUploadsAlbumId?: () => Promise<any>;
    getAllAlbums?: () => Promise<any>;
    addAlbum?: (albumName: string) => Promise<any>;
    editAlbum?: (albumId: string, albumName: string) => Promise<any>;
    deleteAlbum?: (albumId: string) => Promise<any>;
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
                            const photoId = item.firstPhoto.id;
                            if(photoId == '00000000-0000-0000-0000-000000000000'){
                                return item;
                            }

                            const photo = getPhotoById ? await getPhotoById(item.firstPhoto.id) : undefined;
                            if(photo){
                                return {
                                    ...item,
                                    firstPhoto: {
                                        ...item.firstPhoto,
                                        photo: await photo,
                                    },
                                };
                            }else {
                                console.error(`Error fetching photo for album with ID ${photoId}: Photo not found`);
                                return item;
                            }
                        } catch (error: any) {
                            console.error("Error fetching photo:", error);
                            return item;
                        }
                    })
                );

                return updatedAlbums;
            } else {
                console.error("Invalid data format:", result.data);
                return [];
            }
        } catch (error: any) {
            return error.response?.data?.result || "An unexpected error occurred";
        }
    };

    const addAlbum = async (albumName: string) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/album/add-album`, {albumName});
            return response.data;
        } catch (error: any) {
            return error.response;
        }
    }

    const editAlbum = async (albumId: string, albumName: string) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/album/update-album`, {id: albumId, albumName});
            return response.data;
        } catch (error: any) {
            return error.response;
        }
    }

    const deleteAlbum = async (albumId: string) => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/album/delete-album/${albumId}`);
            return response.data;
        } catch (error: any) {
            return error.response;
        }
    }

    const contextValue: AlbumContextProps = {
        getUploadsAlbumId,
        getAllAlbums,
        addAlbum,
        editAlbum,
        deleteAlbum
    }

    return (
        <AlbumContext.Provider value={contextValue}>
            {children}
        </AlbumContext.Provider>
    );
}
