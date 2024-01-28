import { ActivityIndicator, FlatList, Image, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { UserAvatar } from "../../components/customComponents/UserAvatar";
import { Images } from "../../utils/Images";
import { IndividualPost } from "../../components/IndividualPost";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFriend } from "../../context/FriendContext";
import { Colors, Storage } from "../../utils/Config";
import { useFocusEffect } from "@react-navigation/native";
import { useUser } from "../../context/UserContext";
import { usePhoto } from "../../context/PhotoContext";
import BottomSheet from "@gorhom/bottom-sheet";
import { usePost } from "../../context/PostContext";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { IndividualComment } from "../../components/IndividualComment";
import { useComment } from "../../context/CommentContext";
import { useToast } from "react-native-toast-notifications";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Modal } from "react-native-paper";

interface HomeTabProps {
    navigation: any;
    route: any;
}

export const HomeTab: React.FC<HomeTabProps> = ({ navigation, route }) => {
    const toast = useToast();
    const { getAllFriends, getIsPosterFriend } = useFriend();
    const { getProfile } = useUser();
    const { getPhotoById } = usePhoto();
    const { getNewsfeedPosts, deletePost } = usePost();
    const { addComment, getComments } = useComment();

    const [isScrollLoading, setIsScrollLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [profilePicture, setProfilePicture] = useState<any>();
    const [userId, setUserId] = useState('');

    const [friends, setFriends] = useState<any>([]);
    const [posts, setPosts] = useState<any>([]);
    const [comments, setComments] = useState<any>([]);


    const [selectedPostId, setSelectedPostId] = useState('');
    const [selectedPoster, setSelectedPoster] = useState<any>();
    const [commentContent, setCommentContent] = useState('');

    useFocusEffect(() => {
        loadProfile();
    })

    useEffect(() => {
        setIsLoading(true);
        getFriends();
        getPosts();
    }, []);

    //Bottom sheets
    const commentBottomSheetRef = useRef<BottomSheet>(null);
    const [isCommentBottomSheetVisible, setIsCommentBottomSheetVisible] = useState(false);
    const snapPoints = useMemo(() => ['45%', '95%'], []);
    const handleCommentSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            setIsCommentBottomSheetVisible(false);
        }
    }, []);

    const optionsRef = useRef<BottomSheet>(null);
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);
    const snapPointsOptions = useMemo(() => ['30%', '35%'], []);
    const handleOptionsSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            setIsOptionsVisible(false);
        }
    }, []);


    //api functions
    const loadProfile = async () => {
        setUserId(Storage.getString('userId')!);

        if (userId != '') {
            const result = getProfile ? await getProfile(userId) : undefined;
            if (await result.id) {
                setFirstName(result.firstName);
                const pictureResult = getPhotoById ? await getPhotoById(result.photo.id) : undefined;

                if (pictureResult) {
                    setProfilePicture(pictureResult);
                }
            }
        }
    }
    const getFriends = async () => {
        try {
            const userId = Storage.getString('userId');

            if (userId) {
                const result = getAllFriends ? await getAllFriends(userId) : undefined;
                if (result) {
                    setFriends(result);
                }
            }
        } catch (error: any) {
            console.error("Error fetching photos:", error.response);
        }
    }
    const getPosts = async () => {
        try {
            const result = getNewsfeedPosts ? await getNewsfeedPosts() : undefined;
            if (await result) {
                setPosts(result);
                // console.log(result);
                // const friendResult = getIsPosterFriend ? await getIsPosterFriend(result[0].poster.id) : undefined;
                // console.log(friendResult);
                setIsLoading(false);
            }
        } catch (error: any) {
            console.error("Error fetching photos:", error.response);
        }

    }
    const onDeletePost = async () => {
        try {
            const result = deletePost ? await deletePost(selectedPostId) : undefined;
            if (result) {
                toast.show('Post Deleted!', {
                    type: "success",
                });
                hideModal();
                getPosts();
            } else {
                toast.show(result, {
                    type: "warning",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.show("An unexpected error occurred", { type: 'danger' });
        }
    }
    const onGetComments = async (postId: string) => {
        try {
            const result = getComments ? await getComments(postId) : undefined;

            if (await result) {
                setComments(result);
            }

        } catch (error: any) {
            console.error("Error fetching photos:", error.response);
        }
    }
    const onAddComment = async () => {
        if (!commentContent.trim()) {
            toast.show('All fields are required', { type: 'danger' });
        } else {
            try {
                const result = addComment ? await addComment(commentContent, selectedPostId) : undefined;
                if (result) {
                    onGetComments(selectedPostId);
                    getPosts();
                }
                setCommentContent('');
            } catch (error: any) {
                toast.show("An unexpected error occurred", { type: 'danger' });
                console.log(error);
            }
        }
    }

    //modal
    const [visible, setVisible] = useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);



    //scroll refresh
    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        getPosts();
        setRefreshing(false);
    }, []);
    const handleScroll = (event: { nativeEvent: { layoutMeasurement: any; contentOffset: any; contentSize: any; }; }) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isEndReached = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

        if (isEndReached && !isScrollLoading) {
            setIsScrollLoading(true);

            setTimeout(() => {
                // setFriends((prevFriends) => [...prevFriends, ...newData]);
                setIsScrollLoading(false);
            }, 1000);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            {isLoading ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color={Colors.primaryBrand} />
                </View>
            ) : (
                <FlatList
                    data={posts}
                    onScroll={handleScroll}
                    renderItem={({ item }) => <IndividualPost key={item.id} post={item} getPosts={getPosts} setSelectedPostId={setSelectedPostId} setSelectedPoster={setSelectedPoster} onGetComments={onGetComments} setIsOptionsVisible={setIsOptionsVisible} setIsBottomSheetVisible={setIsCommentBottomSheetVisible} navigation={navigation} route={route} />}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    // maxToRenderPerBatch={1}
                    // updateCellsBatchingPeriod={1000000}
                    // initialNumToRender={1}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                    ListHeaderComponent={
                        <TouchableWithoutFeedback onPress={() => commentBottomSheetRef.current && commentBottomSheetRef.current.close()}>
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', borderBottomColor: 'lightgray', borderBottomWidth: 1 }}>
                                    <View style={{ marginStart: 5 }}>
                                        <UserAvatar item={{ id: userId, photo: { photoImageURL: profilePicture }, firstName: firstName }} navigation={navigation} route={route} />
                                    </View>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.friendsView}>
                                        {friends.map((item: any) => (
                                            <UserAvatar key={item.id} item={item} navigation={navigation} route={route} />
                                        ))}
                                    </ScrollView>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    }
                />
            )}

            {/* Comment Bottom Sheet */}
            <BottomSheet
                ref={commentBottomSheetRef}
                index={isCommentBottomSheetVisible ? 0 : -1}
                snapPoints={snapPoints}
                onChange={handleCommentSheetChanges}
                enablePanDownToClose
                style={{
                    borderTopStartRadius: 20,
                    borderTopEndRadius: 20,
                    shadowRadius: 20,
                    shadowColor: 'black',
                    elevation: 20,
                    zIndex: 1,
                }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 0, borderBottomColor: 'gray', borderBottomWidth: 0.2, paddingTop: 20, paddingBottom: 10 }}>
                        <Text style={{ textAlign: 'center', fontSize: 16, color: 'black', fontWeight: '500' }}>Comments</Text>
                    </View>

                    <View style={{ flex: 0, borderBottomColor: 'gray', borderBottomWidth: 0.2 }}>
                        <View style={[{ flexDirection: 'row', borderBottomColor: '#ccc', marginHorizontal: 10, marginVertical: 5, gap: 10, alignItems: "center", }]}>
                            <Image source={profilePicture ? { uri: profilePicture } : Images.sample_avatar_neutral} resizeMode="cover" style={{ aspectRatio: 1, width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: Colors.orange }} />

                            <TextInput
                                placeholder={selectedPoster ? `Add a comment for ${selectedPoster.firstName.toLowerCase().replace(/\s/g, '')}.${selectedPoster.lastName.toLowerCase()} ...` : ``}
                                style={{ fontFamily: 'Roboto-Medium', color: 'black', fontSize: 15, flex: 1, backgroundColor: 'transparent' }}
                                value={commentContent}
                                onChangeText={setCommentContent}
                                placeholderTextColor={'#666'} />

                            <TouchableOpacity onPress={onAddComment}>
                                <MaterialCommunityIcons name="send" size={26} color={Colors.primaryBrand} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ flex: 1, marginVertical: 20 }}>
                        {comments.length > 0 ? (
                            <FlatList
                                data={comments}
                                renderItem={({ item }) => <IndividualComment key={item.id} comment={item} navigation={navigation} route={route} />}
                                keyExtractor={(item) => item.id}
                                showsVerticalScrollIndicator={false} />
                        ) : (
                            <View style={{ flex: 1, alignItems: "center", marginTop: 50}}>
                                <Text style={{color: 'black', fontWeight: '700', fontSize: 22}}>No comments yet</Text>
                                <Text style={{color: 'darkgray', fontWeight: '500', fontSize: 15}}>Start the conversation.</Text>
                            </View>
                        )}
                    </View>
                </View>
            </BottomSheet>

            {/* Post Individual Bottom Sheet */}
            <BottomSheet
                ref={optionsRef}
                index={isOptionsVisible ? 0 : -1}
                snapPoints={snapPointsOptions}
                onChange={handleOptionsSheetChanges}
                enablePanDownToClose
                style={{
                    borderTopStartRadius: 20,
                    borderTopEndRadius: 20,
                    shadowRadius: 20,
                    shadowColor: 'black',
                    elevation: 20,
                    zIndex: 1,
                }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 0, borderBottomColor: 'gray', borderBottomWidth: 0.2, paddingTop: 20, paddingBottom: 10 }}>
                        <Text style={{ textAlign: 'center', fontSize: 16, color: 'black', fontWeight: '500' }}>Post Options</Text>
                    </View>

                    <TouchableOpacity onPress={() => {
                        optionsRef && optionsRef.current?.close();

                        navigation.navigate('CreatePostTab', {
                            postId: selectedPostId,
                        })
                    }}>
                        <View style={{ paddingHorizontal: 15, paddingVertical: 10, flexDirection: "row", alignItems: "center" }}>
                            <MaterialCommunityIcons name="comment-edit-outline" size={36} color={'black'} style={{ flex: 0 }} />
                            <View style={{ marginStart: 15, alignSelf: "center", flex: 1 }}>
                                <Text style={{ fontSize: 20, color: 'black', fontFamily: 'Roboto-Medium' }}>Edit Post</Text>
                            </View>
                            <MaterialIcons name="arrow-forward-ios" size={24} color={'black'} style={{ flex: 0 }} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        optionsRef && optionsRef.current?.close();
                        showModal()
                    }}>
                        <View style={{ paddingHorizontal: 15, paddingVertical: 10, flexDirection: "row", alignItems: "center" }}>
                            <MaterialCommunityIcons name="delete-outline" size={36} color={Colors.danger} style={{ flex: 0 }} />
                            <View style={{ marginStart: 15, alignSelf: "center", flex: 1 }}>
                                <Text style={{ fontSize: 20, color: Colors.danger, fontFamily: 'Roboto-Medium' }}>Delete Post</Text>
                            </View>
                            <MaterialIcons name="arrow-forward-ios" size={24} color={Colors.danger} style={{ flex: 0 }} />
                        </View>
                    </TouchableOpacity>


                </View>
            </BottomSheet>

            <Modal
                visible={visible}
                onDismiss={hideModal}
                contentContainerStyle={{
                    flexDirection: "column",
                    backgroundColor: 'white',
                    borderRadius: 15,
                    height: 300,
                    width: 250,
                    alignSelf: "center",
                    alignItems: "flex-start",
                }}>
                <View style={{ marginBottom: 10, padding: 20 }}>
                    <Text style={{ alignSelf: "center", fontSize: 18, textAlign: "center", fontWeight: '700', color: 'black', fontFamily: 'Roboto-Medium' }}>
                        Are you sure you want to delete this post?
                    </Text>
                    <Text style={{ marginTop: 10, alignSelf: "center", textAlign: "center" }}>
                        You're requesting to delete this post. You cannot revert this back, Confirm?
                    </Text>
                </View>
                <View style={{ height: 1, backgroundColor: 'darkgray', width: '100%' }} />
                <TouchableOpacity onPress={onDeletePost} style={{ width: '100%', alignSelf: "center", paddingVertical: 15 }}>
                    <Text style={{ color: Colors.danger, fontWeight: '700', fontFamily: 'Roboto-Medium', fontSize: 16, alignSelf: "center" }}>Continue delete post</Text>
                </TouchableOpacity>
                <View style={{ height: 1, backgroundColor: 'darkgray', width: '100%', marginBottom: 10 }} />
                <TouchableOpacity onPress={hideModal} style={{ width: '100%', alignSelf: "center", marginTop: 5, flex: 0 }}>
                    <Text style={{ color: 'black', fontWeight: '700', fontFamily: 'Roboto-Medium', fontSize: 16, alignSelf: "center" }}>Cancel</Text>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Roboto-Medium'
    },

    friendsView: {
        gap: 15,
        height: 85,
        marginBottom: 10,
    },
    postsContainer: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: "column",
        alignItems: 'center'
    }
})