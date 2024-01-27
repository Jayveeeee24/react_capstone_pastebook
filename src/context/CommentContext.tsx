import axios from "axios";
import { ReactNode, createContext, useContext } from "react";
import { BASE_URL } from "../utils/Config";
import { usePhoto } from "./PhotoContext";

interface CommentContextProps {
    addComment?: (commentContent: string, postId: string) => Promise<any>;
    getComments?: (postId: string) => Promise<any>;
}

interface CommentProviderProps {
    children: ReactNode
}

export const CommentContext = createContext<CommentContextProps>({});

export const useComment = () => {
    return useContext(CommentContext);
}

export const CommentProvider: React.FC<CommentProviderProps> = ({ children }) => {
    const { getPhotoById } = usePhoto();

    const addComment = async (commentContent: string, postId: string) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/comment/add-comment`, {
                commentContent, postId
            });
            return response.data;
        } catch (error: any) {
            return error.response;
        }
    }

    const getComments = async (postId: string) => {
        try {
            const result = await axios.get(`${BASE_URL}/api/comment/get-post-comments/${postId}`);

            if (result && Array.isArray(result.data)) {
                const updatedComments = await Promise.all(
                    result.data.map(async (comment) => {
                        try {
                            const photoId = comment.commenter?.photo?.id;

                            const photo = getPhotoById ? await getPhotoById(photoId) : undefined;
                            if (photo) {
                                return {
                                    ...comment,
                                    commenter: {
                                        ...comment.commenter,
                                        photo: {
                                            ...comment.commenter.photo,
                                            photoImageURL: photo,  // No need for await here
                                        },
                                    },
                                };
                            } else {
                                console.error(`Error fetching photo for album with ID ${photoId}: Photo not found`);
                                return comment;
                            }
                        } catch (error: any) {
                            console.error("Error fetching photo:", error.response);
                            return comment;
                        }
                    })
                );

                return updatedComments;
            } else {
                console.error("Invalid data format:", result.data);
                return [];
            }
        } catch (error: any) {
            console.error("Error fetching comments:", error.response);
            return error.response;
        }
    };


    const contextValue: CommentContextProps = {
        addComment,
        getComments
    }

    return (
        <CommentContext.Provider value={contextValue}>
            {children}
        </CommentContext.Provider>
    );
}