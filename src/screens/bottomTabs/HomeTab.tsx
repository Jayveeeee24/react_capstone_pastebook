import { ActivityIndicator, FlatList, Image, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { UserAvatar } from "../../components/customComponents/UserAvatar";
import { Images } from "../../utils/Images";
import { IndividualPost } from "../../components/IndividualPost";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFriend } from "../../context/FriendContext";
import { MmkvStorage } from "../../utils/GlobalConfig";
import { useFocusEffect } from "@react-navigation/native";
import { useUser } from "../../context/UserContext";
import { usePhoto } from "../../context/PhotoContext";
import BottomSheet from "@gorhom/bottom-sheet";
import { usePost } from "../../context/PostContext";
import { useComment } from "../../context/CommentContext";
import { useToast } from "react-native-toast-notifications";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Modal } from "react-native-paper";
import { NotificationIconWithBadge } from "../../components/customComponents/NotificationWithBadge";
import { FriendRequestWithBadge } from "../../components/customComponents/FriendRequestWithBadge";
import { useNotification } from "../../context/NotificationContext";
import { Item } from "react-native-paper/lib/typescript/components/Drawer/Drawer";
import { Colors } from "../../utils/GlobalStyles";
import { CommentBottomSheet } from "../../components/customComponents/CommentBottomSheet";
import { PostOptionsBottomSheet } from "../../components/customComponents/PostOptionsBottomSheet";

interface HomeTabProps {
    navigation: any;
    route: any;
}

export const HomeTab: React.FC<HomeTabProps> = ({ navigation, route }) => {
    const { getAllFriends, getFriendExist, getFriendRequestsCount } = useFriend();
    const { getProfile } = useUser();
    const { getPhotoById } = usePhoto();
    const { getNotificationsCount } = useNotification();
    const { getNewsfeedPosts } = usePost();
    const { getComments } = useComment();

    const [isScrollLoading, setIsScrollLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);

    const [firstName, setFirstName] = useState('');
    const [profilePicture, setProfilePicture] = useState<any>();
    const [userId, setUserId] = useState('');

    const [friends, setFriends] = useState<any>([]);
    const [posts, setPosts] = useState<any>([]);
    const [comments, setComments] = useState<any>([]);

    const [selectedPostId, setSelectedPostId] = useState('');
    const [selectedPoster, setSelectedPoster] = useState<any>();

    const [notificationCount, setNotificationCount] = useState(0);
    const [friendRequestCount, setFriendRequestCount] = useState(0);

    //Bottom sheets
    const commentBottomSheetRef = useRef<BottomSheet>(null);
    const [isCommentBottomSheetVisible, setIsCommentBottomSheetVisible] = useState(false);

    const optionsRef = useRef<BottomSheet>(null);
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);


    useEffect(() => {
        const loadProfile = async () => {
            setUserId(MmkvStorage.getString('userId')!);

            if (userId !== '') {
                try {
                    const result = getProfile ? await getProfile(userId) : undefined;

                    if (result && result.id) {
                        setFirstName(result.firstName);
                        const pictureResult = getPhotoById ? await getPhotoById(result.photo.id) : undefined;

                        if (pictureResult) {
                            setProfilePicture(pictureResult);
                            setIsImageLoading(false);
                        }
                    }
                } catch (error) {
                    console.error("Error loading profile:", error);
                }
            }
        };

        loadProfile();
    }, [getProfile, userId]);

    useEffect(() => {
        setIsLoading(true);

        getFriends();
        getNotificationCount();
        getFriendRequestCount();
        getPosts();
    }, [navigation, getPhotoById, getProfile])
    useEffect(() => {
        const loadSecond = async () => {
            navigation.setOptions({
                headerRight: () => (
                    <View style={{ flexDirection: 'row', marginRight: 10, alignItems: "center" }}>
                        <NotificationIconWithBadge
                            onPress={() => {
                                navigation.navigate('Notifications');
                            }}
                            badgeCount={notificationCount} />

                        <FriendRequestWithBadge
                            onPress={async () => {
                                navigation.navigate('FriendRequest');
                            }}
                            badgeCount={friendRequestCount} />

                    </View>
                ),
            });
        }

        loadSecond();
    }, [friendRequestCount, notificationCount]);
    useEffect(() => {
        navigation.addListener('focus', () => {

            if (route.params?.refresh) {
                getPosts();
            }
        });
    }, [route.params?.refresh]);

    //api functions
    const loadProfile = async () => {
        setUserId(MmkvStorage.getString('userId')!);

        if (userId !== '') {
            try {
                const result = getProfile ? await getProfile(userId) : undefined;

                if (await result.id) {
                    setFirstName(result.firstName);
                    const pictureResult = getPhotoById ? await getPhotoById(result.photo.id) : undefined;

                    if (pictureResult) {
                        setProfilePicture(pictureResult);
                    }
                }
            } catch (error) {
                console.error("Error loading profile:", error);
            }
        }
    };
    const getFriends = async () => {
        try {
            const userId = MmkvStorage.getString('userId');

            if (userId) {
                const result = getAllFriends ? await getAllFriends(userId) : undefined;
                if (result) {
                    setFriends(result);
                }
            }
        } catch (error: any) {
            console.error("Error fetching friends:", error.response);
        }
    }
    const getPosts = async () => {
        try {
            const result = getNewsfeedPosts ? await getNewsfeedPosts() : undefined;
            if (result != undefined) {
                setPosts(result);
                // console.log(result[0].friend.result);
            }
        } catch (error: any) {
            console.log("Error fetching posts:", error.response);
        }
        setIsLoading(false);
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
    const getNotificationCount = async () => {
        try {
            const result = getNotificationsCount ? await getNotificationsCount() : undefined;
            if (result) {
                setNotificationCount(result);
            }
        } catch (error: any) {
            console.error("Error fetching notifs count:", error.response);
        }
    }
    const getFriendRequestCount = async () => {
        try {
            const result = getFriendRequestsCount ? await getFriendRequestsCount() : undefined;
            if (result) {
                setFriendRequestCount(result);
            }
        } catch (error: any) {
            console.error("Error fetching friend request count:", error.response);
            // return 0;
        }
    }


    //scroll refresh
    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        loadProfile();
        getFriends();
        getNotificationCount();
        getFriendRequestCount();
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
            {isLoading || refreshing ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color={Colors.primaryBrand} />
                </View>
            ) : posts && posts.length > 0 ? (
                <FlatList
                    data={posts || []}
                    onScroll={handleScroll}
                    renderItem={({ item }) => <IndividualPost post={item} getPosts={getPosts} setSelectedPostId={setSelectedPostId} setSelectedPoster={setSelectedPoster} onGetComments={onGetComments} setIsOptionsVisible={setIsOptionsVisible} setIsBottomSheetVisible={setIsCommentBottomSheetVisible} navigation={navigation} route={route} />}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    maxToRenderPerBatch={2}
                    updateCellsBatchingPeriod={100}
                    initialNumToRender={2}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                    ListHeaderComponent={
                        <TouchableWithoutFeedback onPress={() => commentBottomSheetRef.current && commentBottomSheetRef.current.close()}>
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', borderBottomColor: 'lightgray', borderBottomWidth: 1 }}>
                                    {profilePicture &&
                                        <View style={{ marginStart: 5 }}>
                                            {isImageLoading ? (
                                                <ActivityIndicator size="small" color={Colors.primaryBrand} />
                                            ) : (
                                                <UserAvatar key={userId} item={{ id: userId, photo: { photoImageURL: profilePicture }, firstName: firstName }} navigation={navigation} route={route} />
                                            )}
                                        </View>}
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
            ) : (
                <TouchableWithoutFeedback onPress={() => commentBottomSheetRef.current && commentBottomSheetRef.current.close()}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', borderBottomColor: 'lightgray', borderBottomWidth: 1 }}>
                            <View style={{ marginStart: 5 }}>
                                <UserAvatar item={{ id: userId, photo: { photoImageURL: profilePicture }, firstName: firstName }} navigation={navigation} route={route} />
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.friendsView}>
                                {friends.map((item: any) => (
                                    <UserAvatar item={item} navigation={navigation} route={route} />
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            )}

            <CommentBottomSheet
                comments={comments}
                commentBottomSheetRef={commentBottomSheetRef}
                profilePicture={profilePicture}
                selectedPoster={selectedPoster}
                getPosts={getPosts}
                onGetComments={onGetComments}
                selectedPostId={selectedPostId}
                isCommentBottomSheetVisible={isCommentBottomSheetVisible}
                setIsCommentBottomSheetVisible={setIsCommentBottomSheetVisible}
                navigation={navigation}
                route={route} />

            <PostOptionsBottomSheet
                selectedPostId={selectedPostId}
                getPosts={getPosts}
                isOptionsVisible={isOptionsVisible}
                optionsRef={optionsRef}
                setIsOptionsVisible={setIsOptionsVisible}
                navigation={navigation}
                route={route} />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    friendsView: {
        gap: 15,
        height: 85,
        marginBottom: 10,
    },
})