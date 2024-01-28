import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, FlatList, Image, PermissionsAndroid, Platform, SafeAreaView, ScrollView, TextInput as TextArea, Text, TouchableOpacity, View, TouchableNativeFeedback, ActivityIndicator, Animated, Pressable } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors, Storage, credentialTextTheme } from "../../utils/Config";
import { CameraRoll, GetAlbumsParams } from "@react-native-camera-roll/camera-roll";
import { Picker } from "@react-native-picker/picker";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { FAB, TextInput } from "react-native-paper";
import { useAlbum } from "../../context/AlbumContext";
import { usePhoto } from "../../context/PhotoContext";
import { useToast } from "react-native-toast-notifications";
import { usePost } from "../../context/PostContext";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import SearchBar from "react-native-dynamic-search-bar";
import { IndividualSearch } from "../../components/IndividualSearch";
import BottomSheet from "@gorhom/bottom-sheet";
import { useFriend } from "../../context/FriendContext";
import { useUser } from "../../context/UserContext";

interface CreatePostTabProps {
    navigation: any;
    route: any;
}
export const CreatePostTab: React.FC<CreatePostTabProps> = ({ navigation, route }) => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const toast = useToast();

    const { getUploadsAlbumId } = useAlbum();
    const { addPhoto, getPhotoById } = usePhoto();
    const { addPost, getPostById, editPost } = usePost();
    const { getAllFriends } = useFriend();
    const { getProfile } = useUser();

    const [currentView, setCurrentView] = useState('PhotoSelectView');
    const [isLoading, setIsLoading] = useState(false);

    //gallery/camera roll
    const [images, setImages] = useState<any[]>([]);
    const [albums, setAlbums] = useState<any[]>([]); //gallery albums
    const [uploadsAlbumId, setUploadsAlbumId] = useState('');
    const [category, setCategory] = useState<string>('');
    const [friends, setFriends] = useState<any>([]);
    const [searchUserQuery, setSearchUserQuery] = useState('');


    const getUserProfileExecuted = useRef(false);
    const [currentFunction, setCurrentFunction] = useState('Add');
    const [postId, setPostId] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [postBody, setPostBody] = useState('');
    const [pickedImage, setPickedImage] = useState<any>({});
    const [postedUserId, setPostedUserId] = useState('');
    const [postedUserFirstName, setPostedUserFirstName] = useState('');
    const [postedUserLastName, setPostedUserLastName] = useState('');


    //Use Effects

    useEffect(() => {
        hasPermission();

        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() => {
                    if (currentView == 'PhotoSelectView') {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [
                                    { name: 'HomeTab' },
                                ],
                            })
                        );
                    }
                    else {
                        setCurrentView('PhotoSelectView');
                    }

                }} style={{ flexDirection: "row", alignItems: "center", marginStart: 10 }}>
                    <MaterialIcons name={currentView == 'PhotoSelectView' ? 'close' : 'arrow-back'} size={32} color={'black'} />
                </TouchableOpacity>
            ),

            headerRight: () => (
                <TouchableOpacity style={{ marginHorizontal: 10, display: currentView == "PhotoSelectView" ? "flex" : "none" }} onPress={() => {
                    if (currentView == 'PhotoSelectView') {
                        setCurrentView('DetailsView');
                    }
                }}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: Colors.primaryBrand }}>Next</Text>
                </TouchableOpacity>
            ),
        });

        getUploadsAlbum();
        loadAlbums();

        if (route.params?.image) {
            setPickedImage(route.params?.image);
        }

        return () => {
            navigation.addListener('blur', () => {
                setCurrentView('PhotoSelectView');
            });
        };

    }, [route.params?.image, currentView, navigation]);
    useEffect(() => {
        if (getUserProfileExecuted.current) {
            getUserProfile(postedUserId);
        } else {
            const userId = Storage.getString('userId');
            setPostedUserId(userId!);
            getUserProfileExecuted.current = true;
        }
    }, [postedUserId]);
    useEffect(() => {
        if (route.params?.postId) {
            navigation.setOptions({
                headerTitle: 'Edit Post'
            });

            setCurrentFunction('Edit');

            const getPost = async () => {
                const result = getPostById ? await getPostById(route.params?.postId) : undefined;
                if (result) {
                    setPostedUserId(result.poster.id);
                    if (!route.params?.image) {
                        setPickedImage({
                            node: {
                                image: {
                                    uri: result.photo.photoImageURL
                                }
                            }
                        });
                    }
                    setPostId(route.params.postId);
                    setPostTitle(result.postTitle);
                    setPostBody(result.postBody);
                }
            }
            getPost();
        } else {
            setCurrentFunction('Add');
        }
    }, []);




    //api functions
    const onAddPost = async () => {
        if (!postTitle.trim() || !postBody.trim()) {
            toast.show('All fields are required', { type: 'danger' });
        } else {
            setIsLoading(true);
            const file = pickedImage.node.image.uri;
            const name = file.split('/').pop();

            const formData = new FormData();
            formData.append('albumId', uploadsAlbumId);
            formData.append('file', {
                uri: file,
                name: name,
                type: 'image/jpg'
            });

            try {
                const result = addPhoto ? await addPhoto(formData) : undefined;
                if (result) {
                    const dateToday = new Date();
                    const postResult = addPost ? await addPost(postTitle, postBody, dateToday, postedUserId, result) : undefined;

                    if (postResult) {
                        toast.show('Post success!', { type: 'success' });
                        navigation.navigate('Home', { refresh: true });
                    } else {
                        toast.show(postResult.result, { type: 'warning' });
                    }
                } else {
                    toast.show(result, { type: 'warning' });
                }

            } catch (error: any) {
                toast.show("An unexpected error occurred", { type: 'danger' });
                console.log(error);
            }
        }
        setIsLoading(false);
    }
    const onEditPost = async () => {
        if (!postTitle.trim() || !postBody.trim()) {
            toast.show('All fields are required', { type: 'danger' });
        } else {
            setIsLoading(true);
            const file = pickedImage.node.image.uri;
            const name = file.split('/').pop();

            const formData = new FormData();
            formData.append('albumId', uploadsAlbumId);
            formData.append('file', {
                uri: file,
                name: name,
                type: 'image/jpg'
            });

            try {
                const result = addPhoto ? await addPhoto(formData) : undefined;
                if (result) {
                    const postResult = editPost ? await editPost(postId, postTitle, postBody, result) : undefined;
                    console.log(postResult);
                    if (postResult) {
                        toast.show('Post updated!', { type: 'success' });
                        navigation.navigate('Home', { refresh: true });
                    } else {
                        toast.show(postResult.result, { type: 'warning' });
                    }
                } else {
                    toast.show(result, { type: 'warning' });
                }

            } catch (error: any) {
                toast.show("An unexpected error occurred", { type: 'danger' });
                console.log(error);
            }
        }
        setIsLoading(false);
    }
    const getFriends = async () => {
        try {
            const userId = Storage.getString('userId');

            if (userId) {
                const result = getAllFriends ? await getAllFriends(userId) : undefined;
                if (result) {
                    const profileResult = getProfile ? await getProfile(userId) : undefined;
                    if (await profileResult.id) {
                        const pictureResult = getPhotoById ? await getPhotoById(profileResult.photo.id) : undefined;

                        if (pictureResult) {
                            const newItem = {
                                photo: {
                                    photoImageURL: pictureResult,
                                },
                                firstName: profileResult.firstName,
                                lastName: profileResult.lastName + ' (You)',
                                id: profileResult.id,
                            }
                            setFriends((friends: any) => [newItem, ...result]);
                        }
                    }

                }
            }
        } catch (error: any) {
            console.error("Error fetching photos:", error.response);
        }
    }
    const getUserProfile = async (userId: string) => {
        const result = getProfile ? await getProfile(userId) : undefined;
        if (await result.id) {
            setPostedUserFirstName(result.firstName);
            setPostedUserLastName(result.lastName);
        }
    }

    //album retrieval
    const loadAlbums = async () => {
        if (Platform.OS === 'android' && !(await hasPermission())) {
            return;
        }

        const params: GetAlbumsParams = { assetType: 'All' };
        CameraRoll.getAlbums(params)
            .then((albums) => {
                setAlbums(albums);
            })
            .catch((err) => {
                console.error(err);
            });
    };
    const getUploadsAlbum = async () => {
        const result = getUploadsAlbumId ? await getUploadsAlbumId() : undefined;

        if (result) {
            setUploadsAlbumId(result);
        }
    }

    //camera roll
    const pickedCategory = (itemValue: string, itemIndex: number) => {
        let params = { first: 40, groupName: albums[itemIndex].title };

        setCategory(itemValue);

        CameraRoll.getPhotos(params).then((imgs) => {
            setImages(imgs.edges);
            if (!route.params?.image && !route.params?.postId) {
                setPickedImage(imgs.edges[0]);
            }
        });

    };
    const displayAssetCategories = () => {
        return albums.map((category, index) => {
            const key = `${category.title}_${index}`;
            return <Picker.Item key={key} label={category.title} value={index} />;
        });
    };

    //bottom sheet
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
    const snapPoints = useMemo(() => ['50%', '90%'], []);
    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            setIsBottomSheetVisible(false);
        }
    }, []);

    //others
    const renderView = () => {
        switch (currentView) {
            case 'PhotoSelectView':
                return (
                    <>
                        <ScrollView style={{ flexDirection: "column", flex: 1 }} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                            <View style={{ width: width, height: width, }}>
                                {pickedImage && pickedImage.node && pickedImage.node.image && (
                                    <Image
                                        source={{ uri: pickedImage.node.image.uri }}
                                        resizeMode="cover"
                                        style={{ width: width, height: width }}
                                    />
                                )}
                            </View>
                            <View style={{ justifyContent: 'flex-start', flexDirection: "row", alignItems: "center", paddingHorizontal: 10 }}>
                                <Picker
                                    mode={'dropdown'}
                                    selectedValue={category}
                                    style={{ height: 50, width: width / 2.5 }}
                                    onValueChange={(itemValue, itemIndex) =>
                                        pickedCategory(itemValue, itemIndex)
                                    }>
                                    {displayAssetCategories()}
                                </Picker>
                            </View>
                            <View>
                                <FlatList
                                    data={images}
                                    renderItem={({ item, index }) => (
                                        <View style={{ width: '33.3%', marginBottom: 3, marginRight: index % 3 !== 2 ? 2 : 0 }}>
                                            <TouchableWithoutFeedback onPress={() => { setPickedImage(item) }}>
                                                <Image source={{ uri: item.node.image.uri }} resizeMode="cover" style={{ width: '100%', height: 130, opacity: item === pickedImage ? 0.3 : 1, }} />
                                            </TouchableWithoutFeedback>
                                        </View>
                                    )}
                                    keyExtractor={(item) => item.node.id}
                                    numColumns={3}
                                    scrollEnabled={false}
                                />
                            </View>
                        </ScrollView>
                        <FAB
                            color="white"
                            icon='camera'
                            style={{
                                borderRadius: 50,
                                position: 'absolute',
                                margin: 16,
                                right: 0,
                                bottom: 0, backgroundColor: Colors.primaryBrand
                            }}
                            onPress={() => navigation.replace("Camera", { postId: postId })}
                        />
                    </>
                );
            case 'DetailsView':
                return (
                    <View style={{ flex: 1, flexDirection: "column" }}>
                        <ScrollView style={{ flex: 1 }} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                            <View style={{ alignItems: "center", }}>
                                <Image
                                    source={{ uri: pickedImage.node.image.uri }}
                                    resizeMode="cover"
                                    style={{ width: width, height: width }} />
                            </View>
                            <View style={{ paddingHorizontal: 10 }}>
                                <TextInput placeholder="Title" theme={credentialTextTheme} style={{ fontFamily: 'Roboto-Medium', color: 'black', fontSize: 16, flex: 1, backgroundColor: 'transparent' }} value={postTitle} onChangeText={setPostTitle} />
                                <TextArea
                                    placeholder="Write a caption"
                                    style={{
                                        borderBottomWidth: 0.8,
                                        paddingStart: 15,
                                        borderBottomColor: 'darkgray',
                                        fontFamily: 'Roboto-Medium',
                                        color: 'black',
                                        fontSize: 16,
                                        backgroundColor: 'transparent',
                                        maxHeight: 100,
                                    }}
                                    value={postBody}
                                    onChangeText={(text) => setPostBody(text.slice(0, 1000))}
                                    multiline
                                    placeholderTextColor={'#666'} />

                                <TouchableNativeFeedback onPress={() => {
                                    setIsBottomSheetVisible(true);
                                    getFriends();
                                }}>
                                    <View style={{ paddingHorizontal: 10, paddingVertical: 15, flexDirection: "row", alignItems: "center" }}>
                                        <MaterialCommunityIcons name="account-outline" size={28} color={'#37474F'} style={{ flex: 0 }} />
                                        <View style={{ marginStart: 10, alignSelf: "center", flex: 1 }}>
                                            <Text style={{ fontSize: 18, color: '#37474F', fontFamily: 'Roboto-Medium' }}>Post in: {`${postedUserFirstName.toLowerCase().replace(/\s/g, '')}.${postedUserLastName.toLowerCase()}`}</Text>
                                        </View>
                                        <MaterialIcons name="arrow-forward-ios" size={20} color={'#37474F'} style={{ flex: 0 }} />
                                    </View>
                                </TouchableNativeFeedback>

                                <TouchableNativeFeedback>
                                    <View style={{ paddingHorizontal: 10, paddingVertical: 15, flexDirection: "row", alignItems: "center" }}>
                                        <MaterialCommunityIcons name="account-outline" size={28} color={'#37474F'} style={{ flex: 0 }} />
                                        <View style={{ marginStart: 10, alignSelf: "center", flex: 1 }}>
                                            <Text style={{ fontSize: 18, color: '#37474F', fontFamily: 'Roboto-Medium' }}>Album: Greens</Text>
                                        </View>
                                        <MaterialIcons name="arrow-forward-ios" size={20} color={'#37474F'} style={{ flex: 0 }} />
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                        </ScrollView>
                        <TouchableOpacity
                            onPress={() => {
                                console.log(currentFunction);
                                if (currentFunction == 'Edit') {
                                    onEditPost();
                                } else {
                                    onAddPost();
                                }
                            }}
                            style={{
                                flex: 0,
                                backgroundColor: Colors.secondaryBrand,
                                padding: 15,
                                borderRadius: 10,
                                marginBottom: 10,
                                marginHorizontal: 10,
                            }}>
                            {isLoading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', fontFamily: 'Roboto-Medium' }}>{currentFunction == 'Edit' ? 'Update Post' : "Post"}</Text>
                            )}
                        </TouchableOpacity>

                        {/* bottom sheet here */}
                        <BottomSheet
                            ref={bottomSheetRef}
                            index={isBottomSheetVisible ? 0 : -1}
                            snapPoints={snapPoints}
                            onChange={handleSheetChanges}
                            enablePanDownToClose
                            style={{
                                borderTopStartRadius: 20,
                                borderTopEndRadius: 20,
                                shadowRadius: 20,
                                shadowColor: 'black',
                                elevation: 20,
                            }}>
                            <View style={{ borderBottomColor: 'gray', borderBottomWidth: 0.2, paddingTop: 20, paddingBottom: 10 }} >
                                <Text style={{ textAlign: "center", fontSize: 16, color: 'black', fontWeight: '500' }}>Search user</Text>
                            </View>
                            <View style={{ marginVertical: 20, marginHorizontal: 20 }}>
                                <SearchBar
                                    placeholder="Search"
                                    onPress={() => { setSearchUserQuery('') }}
                                    onChangeText={setSearchUserQuery}
                                    style={{ backgroundColor: '#ECEFF1', width: '100%', marginBottom: 10 }} />

                                <FlatList
                                    data={friends}
                                    renderItem={({ item }) => <IndividualSearch key={item.id} item={item} setPostedUserId={setPostedUserId} bottomSheetRef={bottomSheetRef} navigation={navigation} route={route} />}
                                    keyExtractor={(item) => item.id}
                                    showsVerticalScrollIndicator={false} />

                            </View>
                        </BottomSheet>
                    </View>
                );
        }
    }
    const hasPermission = async () => {
        const platformVersion = parseInt(String(Platform.Version), 10);
        const permission =
            platformVersion >= 33
                ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

        const hasPermission = await PermissionsAndroid.check(permission);
        if (hasPermission) {
            return true;
        }

        const status = await PermissionsAndroid.request(permission);
        return status === 'granted';
    };

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {renderView()}
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

