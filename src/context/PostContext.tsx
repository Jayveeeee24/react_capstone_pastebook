import { ReactNode, createContext, useContext } from "react";
import { BASE_URL } from "../utils/Config";
import axios from "axios";

interface PostContextProps {
    addPost?: (postTitle: string, postBody: string, datePosted: Date, userId: string, photoId?: string) => Promise<any>;
    deletePost?: (postId: string) => Promise<any>;
    getNewsfeedPosts?: () => {};
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

    const getNewsfeedPosts = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/api/timeline/get-newsfeed-posts`);

            return result.data;
            // if (result && Array.isArray(result.data)) {
            //     const updatedAlbums = await Promise.all(
            //         result.data.map(async (item: { firstPhoto: any }) => {
            //             try {
            //                 const photoId = item.firstPhoto.id;
            //                 if (photoId == '00000000-0000-0000-0000-000000000000') {
            //                     return item;
            //                 }

            //                 const photo = getPhotoById ? await getPhotoById(item.firstPhoto.id) : undefined;
            //                 if (photo) {
            //                     return {
            //                         ...item,
            //                         firstPhoto: {
            //                             ...item.firstPhoto,
            //                             photo: await photo,
            //                         },
            //                     };
            //                 } else {
            //                     console.error(`Error fetching photo for album with ID ${photoId}: Photo not found`);
            //                     return item;
            //                 }
            //             } catch (error: any) {
            //                 console.error("Error fetching photo:", error);
            //                 return item;
            //             }
            //         })
            //     );

            //     return updatedAlbums;
            // } else {
            //     console.error("Invalid data format:", result.data);
            //     return [];
            // }
        } catch (error: any) {
            return error.response?.data?.result || "An unexpected error occurred";
        }
    }


    const contextValue: PostContextProps = {
        addPost,
        deletePost,
        getNewsfeedPosts
    }

    return (
        <PostContext.Provider value={contextValue}>
            {children}
        </PostContext.Provider>
    );
}