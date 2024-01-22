import { useEffect, useState } from "react";
import { Image, PermissionsAndroid, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "../../utils/Config";
import { CameraRoll, GetAlbumsParams } from "@react-native-camera-roll/camera-roll";


interface CreatePostTabProps {
    navigation: any;
    route: any;
}

export const CreatePostTab: React.FC<CreatePostTabProps> = ({ navigation }) => {
    const [images, setImages] = useState<any[]>([]);
    const [albums, setAlbums] = useState<any[]>([]);
    const [pickedImage, setPickedImage] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const imgArr: number[] = [];

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ marginHorizontal: 10 }}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 16, color: Colors.primaryBrand }}>Next</Text>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center", marginStart: 10 }}>
                    <MaterialCommunityIcons name="close" size={26} color={'black'} />
                </TouchableOpacity>
            ),
            headerTitle: 'New Post',
            tabBarStyle: {
                display: 'none'
            },
        });

        loadAlbums();

    }, [navigation]);

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
                console.log(albums);
            })
            .catch((err) => {
                console.error(err);
            });

    };

    
    
      const pickedCategory = (itemValue: string, itemIndex: number) => {
        let params = { first: 40, groupName: albums[itemIndex].title };
    
        setCategory(itemValue);
    
        CameraRoll.getPhotos(params).then((imgs) => {
          console.log(params);
          console.log(imgs);
          setImages(imgs.edges);
          setPickedImage(imgs.edges[0].node.image.uri);
        });
      };
    
      const displayImages = () => {
        return images.map((item, key) => (
          <TouchableOpacity
            key={key}
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              imgArr[key] = layout.y;
            }}
            onPress={() => {}}>
            <Image style={{width: 350, height: 350}} source={{ uri: item.node.image.uri }} />
          </TouchableOpacity>
        ));
      };
    
      

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <Text>Picked image</Text>
                </View>
                <View style={{ width: '100%', justifyContent: "space-between" }}>

                </View>
                <View>
                    <Text>Images</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

