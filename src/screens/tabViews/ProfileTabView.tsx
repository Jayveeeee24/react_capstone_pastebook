import * as React from 'react';
import { View, useWindowDimensions, StyleSheet, TouchableOpacity, Text, ScrollView, FlatList, Image, TextInput } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { IndividualPost } from '../../components/IndividualPost';
import { Images } from '../../utils/Images';
import { MmkvStorage } from '../../utils/GlobalConfig';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePost } from '../../context/PostContext';
import BottomSheet from '@gorhom/bottom-sheet';
import { useComment } from '../../context/CommentContext';
import { useToast } from 'react-native-toast-notifications';
import { IndividualComment } from '../../components/IndividualComment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Modal } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../../utils/GlobalStyles';


interface ProfileTabViewProps {
    navigation: any;
    route: any;
    userId: string;
}


export const ProfileTabView: React.FC<ProfileTabViewProps> = ({ navigation, route, userId }) => {
    const layout = useWindowDimensions();
    const toast = useToast();


    //context
    const { getMyOwnPosts, getOthersPosts } = usePost();
    const { addComment, getComments } = useComment();
    const { deletePost } = usePost();

    const [ownPosts, setOwnPosts] = useState<any>([]);
    const [othersPosts, setOthersPosts] = useState<any>([]);
    const [profilePicture, setProfilePicture] = useState<any>();
    const [comments, setComments] = useState<any>([]);


    const [selectedPostId, setSelectedPostId] = useState('');
    const [selectedPoster, setSelectedPoster] = useState<any>();
    const [commentContent, setCommentContent] = useState('');


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

    //modal
    const [visible, setVisible] = useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);


    //useEffect
    // useEffect(() => {
    //     getOwnPost();
    //     getOthersPost();
    // }, [])
    useFocusEffect(
        useCallback(() => {
            const loadProfile = async () => {
                getOwnPost();
                getOthersPost();
            }

            loadProfile();

        }, [navigation, userId])
    );


    //api functions
    const getOwnPost = async () => {
        if (userId) {
            try {
                const result = getMyOwnPosts ? await getMyOwnPosts(userId) : undefined;
                if (await result) {
                    // console.log(result);
                    setOwnPosts(result);
                }
            } catch (error: any) {
                console.error("Error fetching photos:", error.response);
            }
        }
    }

    const getOthersPost = async () => {
        if (userId) {
            try {
                const result = getOthersPosts ? await getOthersPosts(userId) : undefined;
                if (await result) {
                    // console.log(result);
                    setOthersPosts(result);
                }
            } catch (error: any) {
                console.error("Error fetching photos:", error.response);
            }
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
                    getOwnPost();
                    getOthersPost();
                }
                setCommentContent('');
            } catch (error: any) {
                toast.show("An unexpected error occurred", { type: 'danger' });
                console.log(error);
            }
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
                getOwnPost();
                getOthersPost();
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



    const FirstRoute = () => (
        // <ScrollView showsVerticalScrollIndicator={false}>
        //     <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'column', alignItems: 'center' }} >
        //         {/* <IndividualPost name='jayvee.artemis' avatarUrl={Images.sample_avatar} postImageUrl={Images.sample_post_image} postTitle="This is a post" postCaption="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus voluptates et quas numquam, ducimus autem asperiores itaque non provident, quam doloribus rerum, ullam fugit iste magni! Laboriosam iste modi possimus." comments={910} likes={1654432} onLikePress={() => { }} /> */}
        //     </View>
        // </ScrollView>
        <>
            {ownPosts.length > 0 ? (
                <FlatList
                    data={ownPosts}
                    renderItem={({ item }) => <IndividualPost key={item.id} post={item} setIsBottomSheetVisible={setIsCommentBottomSheetVisible} setIsOptionsVisible={setIsOptionsVisible} setSelectedPostId={setSelectedPostId} setSelectedPoster={setSelectedPoster} onGetComments={onGetComments} getPosts={getOwnPost} navigation={navigation} route={route} />}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false} />
            ) : (
                <View style={{ flex: 1, alignItems: "center", marginTop: 50 }}>
                    <Text style={{ color: 'black', fontWeight: '700', fontSize: 22 }}>No Posts yet</Text>
                    <Text style={{ color: '#263238', fontWeight: '500', fontSize: 15 }}>Add a post now.</Text>
                </View>
            )}
        </>
    );
    const SecondRoute = () => (
        // <ScrollView showsVerticalScrollIndicator={false}>
        //     <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'column', alignItems: 'center' }} >
        //         {/* <IndividualPost name='yashimallow' avatarUrl={Images.sample_avatar_female} postImageUrl={Images.sample_post_image_2} postTitle="This is a post 2" postCaption="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus voluptates et quas numquam, ducimus autem asperiores itaque non provident, quam doloribus rerum, ullam fugit iste magni! Laboriosam iste modi possimus." comments={754} likes={31321} onLikePress={() => { }} /> */}
        //         {/* <IndividualPost name='blec_siopao' avatarUrl={Images.sample_avatar_female} postImageUrl={Images.sample_post_image_3} postTitle="This is a post 3" postCaption="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus voluptates et quas numquam, ducimus autem asperiores itaque non provident, quam doloribus rerum, ullam fugit iste magni! Laboriosam iste modi possimus." comments={3} likes={5} onLikePress={() => { }} /> */}
        //         {/* <IndividualPost name='hmzzjin' avatarUrl={Images.sample_avatar_female} postImageUrl={Images.sample_post_image_4} postTitle="This is a post 4" postCaption="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus voluptates et quas numquam, ducimus autem asperiores itaque non provident, quam doloribus rerum, ullam fugit iste magni! Laboriosam iste modi possimus." comments={10341} likes={3134221} onLikePress={() => { }} /> */}
        //     </View>
        // </ScrollView>
        <>
            {othersPosts.length > 0 ? (
                <FlatList
                    data={othersPosts}
                    renderItem={({ item }) => <IndividualPost key={item.id} post={item} setIsBottomSheetVisible={setIsCommentBottomSheetVisible} setIsOptionsVisible={setIsOptionsVisible} setSelectedPostId={setSelectedPostId} setSelectedPoster={setSelectedPoster} onGetComments={onGetComments} getPosts={getOthersPost} navigation={navigation} route={route} />}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false} />
            ) : (
                <View style={{ flex: 1, alignItems: "center", marginTop: 50 }}>
                    <Text style={{ color: 'black', fontWeight: '700', fontSize: 22 }}>No Posts yet</Text>
                    <Text style={{ color: '#263238', fontWeight: '500', fontSize: 15 }}>Add a post now.</Text>
                </View>
            )}
        </>
    );


    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'First' },
        { key: 'second', title: 'Second' },
    ]);
    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
    });
    const renderTabBar = (props: { navigationState: { routes: any[]; index: any; }; jumpTo: (arg0: any) => void; }) => (
        <View style={styles.tabBar}>
            {props.navigationState.routes.map((route, index) => (
                <TouchableOpacity
                    key={index}
                    style={[styles.tabItem, index === props.navigationState.index && styles.selectedTab]}
                    onPress={() => props.jumpTo(route.key)}>
                    <MaterialCommunityIcons name={route.key === 'first' ? 'grid' : 'account-box-outline'} size={26} color={Colors.primaryBrand} />
                </TouchableOpacity>
            ))}
        </View>
    );



    return (
        <>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={renderTabBar}
            />


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
                                renderItem={({ item }) => <IndividualComment comment={item} navigation={navigation} route={route} />}
                                keyExtractor={(item) => item.id}
                                showsVerticalScrollIndicator={false} />
                        ) : (
                            <View style={{ flex: 1, alignItems: "center", marginTop: 50 }}>
                                <Text style={{ color: 'black', fontWeight: '700', fontSize: 22 }}>No comments yet</Text>
                                <Text style={{ color: '#263238', fontWeight: '500', fontSize: 15 }}>Start the conversation.</Text>
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
                            screen: 'CreatePost',
                            params: {
                                postId: selectedPostId,
                            }
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
        </>

    );
};

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
    },
    selectedTab: {
        backgroundColor: 'white',
        borderBottomWidth: 0.8,
        borderBottomColor: Colors.primaryBrand
    },
    tabText: {
        fontWeight: 'bold',
    },
});

