import { ReactNode, createContext, useContext } from "react";
import { BASE_URL, Storage } from "../utils/Config";
import axios from "axios";
import { usePhoto } from "./PhotoContext";
import { useFriend } from "./FriendContext";

interface PostContextProps {
    addPost?: (postTitle: string, postBody: string, datePosted: Date, userId: string, photoId: string) => Promise<any>;
    deletePost?: (postId: string) => Promise<any>;
    getNewsfeedPosts?: () => Promise<any>;
    getPostCommentsCount?: (postId: string) => Promise<any>;
    getPostLikesCount?: (postId: string) => Promise<any>;
    getIsPostLiked?: (postId: string) => Promise<any>;
    likePost?: (postId: string, likerId: string) => Promise<any>;
    editPost?: (postId: string, postTitle: string, postBody: string, photoId: string) => Promise<any>;
    getPostById?: (postId: string) => Promise<any>;
    getMyOwnPosts?: (userId: string) => Promise<any>;
    getOthersPosts?: (userId: string) => Promise<any>;
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
    const { getIsPosterFriend } = useFriend();

    const addPost = async (postTitle: string, postBody: string, datePosted: Date, userId: string, photoId: string) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/post/add-post`, {
                postTitle, postBody, datePosted, photoId, userId,
            });
            return response.data;
        } catch (error: any) {
            return error.response;
        }
    }

    const editPost = async (postId: string, postTitle: string, postBody: string, photoId: string) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/post/update-post`, {
                id: postId, postTitle, postBody, photoId,
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

    const getPostById = async (postId: string) => {
        try {
            const result = await axios.get(`${BASE_URL}/api/post/get-post/${postId}`);

            if (result.data) {
                const photo = getPhotoById ? await getPhotoById(result.data.photo.id) : undefined;
                if (photo) {
                    return {
                        ...result.data,
                        photo: {
                            ...result.data.photo,
                            photoImageURL: await photo,
                        },
                    };
                } else {
                    console.error(`Error fetching photo for album with ID ${result.data.photo.id}: Photo not found`);
                    return result.data;
                }
            }

            return result.data;
        } catch (error: any) {
            console.log('get post by id error: ' + error);
            return error.response;
        }
    }

    const getNewsfeedPosts = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/api/timeline/get-newsfeed-posts`);
            const userId = Storage.getString('userId');


            if (result && Array.isArray(result.data) && result.data.length > 0) {
                const updatedPosts = await Promise.all(
                    result.data.map(async (post) => {
                        const updatedPost = { ...post, commentsCount: 0, likesCount: 0, friend: {} };

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

                        // console.log(post.poster.id);
                        // console.log(userId);
                        if (userId) {
                            const friend = getIsPosterFriend ? await getIsPosterFriend(updatedPost.poster.id, userId) : {};
                            updatedPost.friend = await friend;
                        }

                        return updatedPost;
                    })
                );

                return updatedPosts;
            } else {
                // console.error("Invalid data format received from the server");
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
            console.log('get is post liked error: ' + error.response);
            return error;
        }
    }

    const likePost = async (postId: string, likerId: string) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/post/like-post`, { postId, likerId });
            return response.data;
        } catch (error: any) {
            return error.response;
        }
    }

    const getMyOwnPosts = async (userId: string) => {
        try {
            const result = await axios.get(`${BASE_URL}/api/timeline/get-own-posts/${userId}`);

            if (result && Array.isArray(result.data)) {
                const updatedPosts = await Promise.all(
                    result.data.map(async (post) => {
                        const updatedPost = { ...post, commentsCount: 0, likesCount: 0, friend: {} };

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

                        // console.log(post.poster.id);
                        // console.log(userId);
                        if (userId) {
                            const friend = getIsPosterFriend ? await getIsPosterFriend(updatedPost.poster.id, userId) : {};
                            updatedPost.friend = await friend;
                        }

                        return updatedPost;
                    })
                );

                return updatedPosts;
            } else {
                console.error("Invalid data format received from the server");
                return result.data;
            }
        } catch (error: any) {
            return error || "An unexpected error occurred";
        }
    }

    const getOthersPosts = async (userId: string) => {
        try {
            const result = await axios.get(`${BASE_URL}/api/timeline/get-others-posts/${userId}`);

            // if (result && Array.isArray(result.data)) {
            //     const updatedPosts = await Promise.all(
            //         result.data.map(async (post) => {
            //             const updatedPost = { ...post, commentsCount: 0, likesCount: 0, friend: {} };

            //             if (updatedPost.photo && updatedPost.photoId) {
            //                 updatedPost.photo.photoImageURL = getPhotoById ? await getPhotoById(post.photoId) : undefined;
            //             }

            //             if (updatedPost.poster && updatedPost.poster.photo && updatedPost.poster.photo.photoImageURL) {
            //                 updatedPost.poster.photo.photoImageURL = getPhotoById ? await getPhotoById(updatedPost.poster.photo.id) : undefined;
            //             }

            //             if (updatedPost.timeline && updatedPost.timeline.user && updatedPost.timeline.user.photo && updatedPost.timeline.user.photo.photoImageURL) {
            //                 updatedPost.timeline.user.photo.photoImageURL = getPhotoById ? await getPhotoById(updatedPost.timeline.user.photo.id) : undefined;
            //             }

            //             const commentsCount = getPostCommentsCount ? await getPostCommentsCount(post.id) : 0;
            //             updatedPost.commentsCount = commentsCount;

            //             const likesCount = getPostLikesCount ? await getPostLikesCount(post.id) : 0;
            //             updatedPost.likesCount = likesCount;

            //             // console.log(post.poster.id);
            //             // console.log(userId);
            //             if (userId) {
            //                 const friend = getIsPosterFriend ? await getIsPosterFriend(updatedPost.poster.id, userId) : {};
            //                 updatedPost.friend = await friend;
            //             }

            //             return updatedPost;
            //         })
            //     );

            //     return updatedPosts;
            // } else {
            //     console.error("Invalid data format received from the server");
            //     return result.data;
            // }

            return result.data;
        } catch (error: any) {
            return error.response?.data?.result || "An unexpected error occurred";
        }
    }





    const contextValue: PostContextProps = {
        addPost,
        deletePost,
        getNewsfeedPosts,
        getPostCommentsCount,
        getPostLikesCount,
        getIsPostLiked,
        likePost,
        editPost,
        getPostById,
        getOthersPosts,
        getMyOwnPosts,
    }

    return (
        <PostContext.Provider value={contextValue}>
            {children}
        </PostContext.Provider>
    );
}