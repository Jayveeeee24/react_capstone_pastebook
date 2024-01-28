import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Card, } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Images } from "../utils/Images";
import ReadMore from 'react-native-read-more-text';
import { useEffect, useState } from "react";
import { usePost } from "../context/PostContext";
import { Colors, Storage, convertToRelativeTime } from "../utils/Config";

interface IndividualPostProps {
    post: any;
    setIsBottomSheetVisible: (isTrue: boolean) => void,
    setSelectedPostId: (postId: string) => void;
    setSelectedPoster: (post: {}) => void;
    onGetComments: (postId: string) => Promise<any>;
    getPosts: () => void;
    navigation: any;
    route: any;
}

export const IndividualPost: React.FC<IndividualPostProps> = ({ post, getPosts, onGetComments, setSelectedPostId, setSelectedPoster, setIsBottomSheetVisible, navigation, route }) => {
    const { getIsPostLiked, likePost } = usePost();

    const width = Dimensions.get('window').width;
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        isPostLiked();
    }, [post, isLiked]);

    const onLikePost = async () => {
        const userId = Storage.getString('userId');
        if (userId) {
            try {
                const result = likePost ? await likePost(post.id, userId) : undefined;
                if (result) {
                    isPostLiked();
                    getPosts();
                }
            } catch (error: any) {
                console.error("Error fetching like:", error.response);
            }
        }
    }

    const isPostLiked = async () => {
        try {
            const result = getIsPostLiked ? await getIsPostLiked(post.id) : undefined;
            setIsLiked(result);
        } catch (error: any) {
            console.error("Error fetching like:", error.response);
        }
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => { }}>
                        <View style={styles.avatarContainer}>
                            <Card style={styles.avatarCard}>
                                <Card.Cover resizeMode="cover" source={post.poster && post.poster.photo && post.poster.photo.photoImageURL ? { uri: post.poster.photo.photoImageURL } : Images.sample_avatar_neutral} style={styles.avatarImage} />
                            </Card>
                            <Text style={[styles.avatarText, styles.text]}>
                                {post.poster && post.poster.firstName ? (
                                    `${post.poster.firstName.toLowerCase().replace(/\s/g, '')}.${post.poster.lastName.toLowerCase()}` +
                                    (post.poster.id === post.timeline.userId
                                        ? ''
                                        : ` @ ${post.timeline.user && post.timeline.user.firstName ? post.timeline.user.firstName.toLowerCase().replace(/\s/g, '') : ''}.${post.timeline.user && post.timeline.user.lastName ? post.timeline.user.lastName.toLowerCase() : ''}`)
                                ) : ''}

                            </Text>

                        </View>
                    </TouchableOpacity>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <TouchableOpacity style={{ backgroundColor: 'lightgray', borderRadius: 5, paddingHorizontal: 14, paddingVertical: 5 }}>
                            <Text style={[styles.text, { fontWeight: '500' }]}>Follow</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { }}>
                            <MaterialCommunityIcons name="dots-vertical" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.postImageContainer}>
                    <Image
                        source={post && post.photo && post.photo.photoImageURL ? { uri: post.photo.photoImageURL } : Images.sample_avatar_neutral}
                        resizeMode="cover"
                        style={[styles.postImage, { width: width, height: width }]} />
                </View>


                <View style={{ flexDirection: "column" }}>
                    <View style={styles.footerButtonContainer}>
                        <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
                            <TouchableOpacity onPress={onLikePost}>
                                <MaterialCommunityIcons name={isLiked ? "cards-heart" : "cards-heart-outline"} size={30} color={isLiked ? Colors.danger : "black"} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setSelectedPoster(post.poster);
                                setSelectedPostId(post.id);
                                onGetComments(post.id);
                                setIsBottomSheetVisible(true);
                            }}>
                                <MaterialCommunityIcons name="comment-outline" size={26} color="black" />
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.text]}>{convertToRelativeTime(post.datePosted)}</Text>
                    </View>

                    <View style={{ flexDirection: "column", marginStart: 12, gap: 2, marginBottom: 10 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('Likes')}>
                            <Text style={[{ fontWeight: "500", color: 'black', display: post.likesCount > 0 ? 'flex' : 'none' }]}>{post.likesCount} likes</Text>
                        </TouchableOpacity>

                        <ReadMore
                            numberOfLines={2}
                            renderTruncatedFooter={(handlePress: () => void) => <Text style={[styles.text, { fontWeight: '700' }]} onPress={handlePress}>See more</Text>}
                            renderRevealedFooter={(handlePress: () => void) => <Text style={[styles.text, { fontWeight: '500' }]} onPress={handlePress}>See less</Text>}
                            onReady={() => { }}>
                            <Text style={[styles.text, { fontWeight: "900" }]}>{post.postTitle}</Text>
                            <Text> </Text>
                            <Text style={styles.text}>{post.postBody}</Text>
                        </ReadMore>


                        <TouchableOpacity onPress={() => {
                            setSelectedPoster(post.poster);
                            setSelectedPostId(post.id);
                            onGetComments(post.id);
                            setIsBottomSheetVisible(true);
                        }}>
                            <Text style={{ color: 'gray', display: post.commentsCount > 0 ? 'flex' : 'none' }}>View all {post.commentsCount} comments</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        color: 'black'!,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        width: '100%'
    },
    avatarContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    avatarCard: {
        borderRadius: 15,
        width: 30,
        height: 30
    },
    avatarImage: {
        height: '100%',
        borderRadius: 50
    },
    avatarText: {
        fontSize: 14,
        marginStart: 10,
        fontWeight: '500'
    },
    postImageContainer: {
        flexDirection: 'row',
        width: '100%'
    },
    postImage: {
        width: '100%',
        height: 350,
        aspectRatio: 1
    },
    footerButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 15,
        alignItems: "center",
        width: '100%',
    },


});
