import axios from "axios";
import { ReactNode, createContext, useContext } from "react";
import { BASE_URL } from "../utils/GlobalConfig";
import { Buffer } from "buffer";

interface PhotoContextProps {
    addPhoto?: (formData: FormData) => Promise<any>;
    getPhotoById?: (photoId: string) => Promise<any>;
    getAllPhotos?: (albumId: string) => Promise<any>;
}

interface PhotoProviderProps {
    children: ReactNode;
}

export const PhotoContext = createContext<PhotoContextProps>({});

export const usePhoto = () => {
    return useContext(PhotoContext);
}

export const PhotoProvider: React.FC<PhotoProviderProps> = ({ children }) => {

    const addPhoto = async (formData: FormData) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/photo/add-photo`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return response.data;
        } catch (error: any) {
            return error.response;
        }
    };

    const getPhotoById = async (photoId: string): Promise<string | undefined> => {
        try {
            const response = await axios.get(`${BASE_URL}/api/photo/get-photo/${photoId}`, {
                responseType: 'arraybuffer',
                headers: {
                    Accept: 'image/jpeg',
                },
            });
            const imageData = `data:image/jpeg;base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
            return imageData;
        } catch (error) {
            console.error('Error fetching photo:', error);

            throw error;
        }

    };

    const getAllPhotos = async (albumId: string) => {
        try {
            const result = await axios.get(`${BASE_URL}/api/album/get-all-photos/${albumId}`);

            if (result && Array.isArray(result.data)) {
                const updatedPhotos = await Promise.all(
                    result.data.map(async (item: any) => {
                        try {

                            const photo = getPhotoById ? await getPhotoById(item.id) : undefined;
                            if (photo) {
                                return {
                                    ...item,
                                    photo: photo,
                                    
                                };
                            } else {
                                return item;
                            }
                        } catch (error: any) {
                            console.error("Error fetching photo:", error);
                            return item;
                        }
                    })
                );

                return updatedPhotos;
            } else {
                console.error("Invalid data format:", result.data);
                return [];
            }
        } catch (error: any) {
            return error.response;
        }
    };

    const contextValue: PhotoContextProps = {
        addPhoto,
        getPhotoById,
        getAllPhotos
    }

    return (
        <PhotoContext.Provider value={contextValue}>
            {children}
        </PhotoContext.Provider>
    );
}