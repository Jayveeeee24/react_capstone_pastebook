import { ReactNode, createContext, useContext } from "react";
import { BASE_URL } from "../utils/Config";
import axios from "axios";
import { usePhoto } from "./PhotoContext";

interface PostContextProps {
    addPost?: (postTitle: string, postBody: string, datePosted: Date, userId: string, photoId?: string) => Promise<any>;
    deletePost?: (postId: string) => Promise<any>;
    getNewsfeedPosts?: () => Promise<any>;
    getPostCommentsCount?: (postId: string) => Promise<any>;
    getPostLikesCount?: (postId: string) => Promise<any>;
    getIsPostLiked?: (postId: string) => Promise<any>;
    likePost?: (postId: string, likerId: string) => Promise<any>;
}

interface PostProviderProps {
    children: ReactNode
}

export const PostContext = createContext<PostContextProps>({});

export const usePost = () => {
    return useContext(PostContext);
}

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
    const { getPhotoById } = usePhoto();

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

            if (result && Array.isArray(result.data)) {
                const updatedPosts = await Promise.all(
                    result.data.map(async (post) => {
                        const updatedPost = { ...post, commentsCount: 0, likesCount: 0 };

                        if (updatedPost.photo && updatedPost.photoId) {
                            updatedPost.photo.photoImageURL = getPhotoById ? await getPhotoById(post.photoId) : undefined;
                        }

                        if (updatedPost.poster && updatedPost.poster.photo && updatedPost.poster.photo.photoImageURL) {
                            updatedPost.poster.photo.photoImageURL = getPhotoById ? await getPhotoById(updatedPost.poster.photo.id) : undefined;
                        }

                        if (updatedPost.timeline && updatedPost.timeline.user && updatedPost.timeline.user.photo && updatedPost.timeline.user.photo.photoImageURL) {
                            updatedPost.timeline.user.photo.photoImageURL = getPhotoById ? await getPhotoById(updatedPost.timeline.user.photo.id) : undefined;
                        }

                        const commentsCount = getPostCommentsCount ? await getPostCommentsCount(post.id) : 0;
                        updatedPost.commentsCount = commentsCount;

                        const likesCount = getPostLikesCount ? await getPostLikesCount(post.id) : 0;
                        updatedPost.likesCount = likesCount;

                        return updatedPost;
                    })
                );

                return updatedPosts;
            } else {
                console.error("Invalid data format received from the server");
                return result.data;
            }
        } catch (error: any) {
            return error.response?.data?.result || "An unexpected error occurred";
        }
    };

    const getPostCommentsCount = async (postId: string) => {
        try {
            const result = await axios.get(`${BASE_URL}/api/comment/get-post-comments-count/${postId}`);
            return result.data;
        } catch (error: any) {
            console.log('get post comment error: ' + error);
            return error.response;
        }
    }

    const getPostLikesCount = async (postId: string) => {
        try {
            const result = await axios.get(`${BASE_URL}/api/post/get-post-likes-count/${postId}`);
            return result.data;
        } catch (error: any) {
            console.log('get post likes error: ' + error);
            return error.response;
        }
    }

    const getIsPostLiked = async (postId: string) => {
        try {
            const result = await axios.get(`${BASE_URL}/api/post/is-post-liked/${postId}`);
            return result.data;
        } catch (error: any) {
            console.log('get post likes error: ' + error);
            return error.response;
        }
    }

    const likePost = async (postId: string, likerId: string) =>{
        try {
            const response = await axios.post(`${BASE_URL}/api/post/like-post`, {postId, likerId});
            return response.data;
        } catch (error: any) {
            return error.response;
        }
    }



    const contextValue: PostContextProps = {
        addPost,
        deletePost,
        getNewsfeedPosts,
        getPostCommentsCount,
        getPostLikesCount,
        getIsPostLiked,
        likePost
    }

    return (
        <PostContext.Provider value={contextValue}>
            {children}
        </PostContext.Provider>
    );
}