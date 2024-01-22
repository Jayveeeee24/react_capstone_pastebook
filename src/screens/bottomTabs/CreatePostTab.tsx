import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, Image, PermissionsAndroid, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "../../utils/Config";
import { CameraRoll, GetAlbumsParams } from "@react-native-camera-roll/camera-roll";
import { Picker } from "@react-native-picker/picker";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { FAB } from "react-native-paper";


interface CreatePostTabProps {
    navigation: any;
    route: any;
}
const width = Dimensions.get('window').width;
export const CreatePostTab: React.FC<CreatePostTabProps> = ({ navigation, route }) => {
    const [currentView, setCurrentView] = useState('PhotoSelectView');
    const [images, setImages] = useState<any[]>([]);
    const [albums, setAlbums] = useState<any[]>([]);
    const [pickedImage, setPickedImage] = useState<any>({});
    const [category, setCategory] = useState<string>('');

    useEffect(() => {

        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() => {
                    if (currentView == 'PhotoSelectView') {
                        navigation.goBack();
                    } else if(currentView == 'DetailsView'){
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
                <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => {
                    if (currentView == 'PhotoSelectView') {
                        setCurrentView('DetailsView');
                    } else {
                        console.log('post mo na yan');
                    }
                }}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: Colors.primaryBrand }}>
                        {currentView == 'PhotoSelectView' ? 'Next' : 'Post'}
                    </Text>
                </TouchableOpacity>
            ),
           
            headerTitleStyle: {
                marginStart: 10
            },
            headerTitle: 'New Post',
            tabBarStyle: {
                display: 'none',
            },
        });

        loadAlbums();

        return () => {
            navigation.addListener('blur', () => {
                setCurrentView('PhotoSelectView');
            });
        };

    }, [navigation, currentView]);



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
                // console.log(albums);
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
                                {/* <TouchableOpacity>
                                <MaterialCommunityIcons name="camera-outline" size={26} color={Colors.primaryBrand} />
                            </TouchableOpacity> */}
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
                            onPress={() => console.log('Pressed')}
                        />
                    </>
                );
            case 'DetailsView':
                return (
                    <View>
                        <Text>haha</Text>
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

