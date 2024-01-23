import React, { useContext, useEffect, useState } from "react";
import { Dimensions, FlatList, Image, PermissionsAndroid, Platform, SafeAreaView, ScrollView, TextInput as TextArea, Text, TouchableOpacity, View, TouchableNativeFeedback } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors, credentialTextTheme } from "../../utils/Config";
import { CameraRoll, GetAlbumsParams } from "@react-native-camera-roll/camera-roll";
import { Picker } from "@react-native-picker/picker";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { FAB, TextInput } from "react-native-paper";
import { useAlbum } from "../../context/AlbumContext";
import { PhotoContext, usePhoto } from "../../context/PhotoContext";
import { useToast } from "react-native-toast-notifications";
import axios from "axios";

interface CreatePostTabProps {
    navigation: any;
    route: any;
}
const width = Dimensions.get('window').width;
export const CreatePostTab: React.FC<CreatePostTabProps> = ({ navigation, route }) => {
    const toast = useToast();

    const [currentView, setCurrentView] = useState('PhotoSelectView');
    const [images, setImages] = useState<any[]>([]);
    const [albums, setAlbums] = useState<any[]>([]);
    const [pickedImage, setPickedImage] = useState<any>({});
    const [category, setCategory] = useState<string>('');

    const [postTitle, setPostTitle] = useState('');
    const [postBody, setPostBody] = useState('');

    const [uploadsAlbumId, setUploadsAlbumId] = useState('');
    const { getUploadsAlbumId } = useAlbum();
    const { addPhoto } = usePhoto();


    useEffect(() => {
        if (route.params?.image) {
            setPickedImage(route.params?.image);
        }

        hasPermission();

        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() => {
                    if (currentView == 'PhotoSelectView') {
                        navigation.goBack();
                    } else if (currentView == 'DetailsView') {
                        setCurrentView('PhotoSelectView');
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



        loadAlbums();
        getUploadsAlbum();

        return () => {
            navigation.addListener('blur', () => {
                setCurrentView('PhotoSelectView');
            });
        };

    }, [navigation, currentView, route.params?.image]);

    const getUploadsAlbum = async () => {
        const result = getUploadsAlbumId ? await getUploadsAlbumId() : undefined;

        if (result) {
            setUploadsAlbumId(result);
        }
    }

    const blobToFile = (theBlob: Blob, fileName: string): File => {
        const b: any = theBlob;
        b.lastModifiedDate = new Date();
        b.name = fileName;

        return theBlob as File;
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

    const pickedCategory = (itemValue: string, itemIndex: number) => {
        let params = { first: 40, groupName: albums[itemIndex].title };

        setCategory(itemValue);

        CameraRoll.getPhotos(params).then((imgs) => {
            setImages(imgs.edges);
            setPickedImage(imgs.edges[0]);
        });

    };

    const displayAssetCategories = () => {
        return albums.map((category, index) => {
            const key = `${category.title}_${index}`;
            return <Picker.Item key={key} label={category.title} value={index} />;
        });
    };

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
                                borderRadius: 20,
                                position: 'absolute',
                                margin: 16,
                                right: 0,
                                bottom: 0, backgroundColor: Colors.primaryBrand
                            }}
                            onPress={() => navigation.navigate("Camera")}
                        />
                    </>
                );
            case 'DetailsView':
                return (
                    <View style={{ flex: 1, flexDirection: "column" }}>
                        <ScrollView style={{ flex: 1 }} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                            <View style={{ alignItems: "center", marginVertical: 10 }}>
                                <Image
                                    source={{ uri: pickedImage.node.image.uri }}
                                    resizeMode="cover"
                                    style={{ width: width - 150, height: width - 150 }}
                                />
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
                                        height: 80,
                                    }}
                                    value={postBody}
                                    onChangeText={(text) => setPostBody(text.slice(0, 1000))}
                                    multiline
                                    placeholderTextColor={'#666'} />

                                <TouchableNativeFeedback onPress={() => { }}>
                                    <View style={{ paddingHorizontal: 10, paddingVertical: 15, flexDirection: "row", alignItems: "center" }}>
                                        <MaterialCommunityIcons name="account-outline" size={28} color={'#37474F'} style={{ flex: 0 }} />
                                        <View style={{ marginStart: 10, alignSelf: "center", flex: 1 }}>
                                            <Text style={{ fontSize: 18, color: '#37474F', fontFamily: 'Roboto-Medium' }}>Post in: johnbernard.tinio</Text>
                                        </View>
                                        <MaterialIcons name="arrow-forward-ios" size={20} color={'#37474F'} style={{ flex: 0 }} />
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                        </ScrollView>
                        <TouchableOpacity
                            onPress={async () => {
                                const formData = new FormData();
                                formData.append('albumId', uploadsAlbumId);

                                const result = await fetch(pickedImage.node.image.uri);
                                const data = await result.blob();
                                const file = blobToFile(data, 'photo');

                                try {
                                    formData.append('file', file);
                                    const result = addPhoto ? await addPhoto(formData) : undefined;
                                    console.log(result);
                                    // if (result.id) {

                                    // } else {
                                    //     toast.show(result, { type: 'warning' });
                                    // }
                                } catch (error: any) {
                                    toast.show("An unexpected error occurred", { type: 'danger' });
                                    console.log(error);
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
                            <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', fontFamily: 'Roboto-Medium' }}>Post</Text>
                        </TouchableOpacity>
                    </View>
                );
        }
    }

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <View style={{ flex: 1 }}>
                {renderView()}
            </View>
        </SafeAreaView>
    );
}

