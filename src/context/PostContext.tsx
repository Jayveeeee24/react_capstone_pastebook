import { ReactNode, createContext, useContext } from "react";
import { BASE_URL } from "../utils/Config";
import axios from "axios";

interface PostContextProps {
    addPost?: (postTitle: string, postBody: string, datePosted: Date, userId: string, photoId?: string) => Promise<any>;
    deletePost?: (postId: string) => Promise<any>;
}

interface PostProviderProps {
    children: ReactNode
}

export const PostContext = createContext<PostContextProps>({});

export const usePost = () => {
    return useContext(PostContext);
}

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {

    const addPost = async (postTitle: string, postBody: string, datePosted: Date, userId: string, photoId?: string) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/post/add-post`, {
                postTitle, postBody, datePosted, photoId, userId,
            });
            return response.data;
        } catch (error: any) {
            return error.response;
        }
    }

    const deletePost = async (postId: string) => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/post/delete-post/${postId}`);
            return response.data;
        } catch (error: any) {
            return error.response;
        }
    }


    const contextValue: PostContextProps = {
        addPost,
        deletePost
    }

    return (
        <PostContext.Provider value={contextValue}>
            {children}
        </PostContext.Provider>
    );
}