import axios from "axios";
import { ReactNode, createContext, useContext } from "react";
import { BASE_URL } from "../utils/Config";
import { Buffer } from "buffer";

interface PhotoContextProps {
    addPhoto?: (formData: FormData) => Promise<any>;
    getPhotoById?: (photoId: string) => Promise<any>;
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
            const response = await axios.post(`${BASE_URL}/api/photo/add-photo`, formData);
            return response.data;
        } catch (error: any) {
            return error.response;
        }
    };

    const getPhotoById = async (photoId: string): Promise<string | undefined> => {
        // try {
        //   const response = await axios.get(`${BASE_URL}/api/photo/get-photo/${photoId}`, {
        //     responseType: 'arraybuffer',
        //     headers: {
        //       Accept: 'image/jpeg',
        //     },
        //   });

        //   const imageData = `data:image/jpeg;base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
        //   return imageData;
        // } catch (error) {
        //   console.error('Error fetching photo:', error);

        //   throw error;
        // }

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



    const contextValue: PhotoContextProps = {
        addPhoto,
        getPhotoById,
    }

    return (
        <PhotoContext.Provider value={contextValue}>
            {children}
        </PhotoContext.Provider>
    );
}