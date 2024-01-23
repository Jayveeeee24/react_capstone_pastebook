import axios from "axios";
import { ReactNode, createContext, useContext } from "react";
import { BASE_URL } from "../utils/Config";


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
            return result.data;
        } catch (error: any) {
            return error.response.data.result;
        }
    }

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
