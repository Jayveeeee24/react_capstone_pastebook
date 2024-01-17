import { useEffect, useState } from "react";
import { Alert, FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from "react-native-popup-menu";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Images } from "../../utils/Images";

interface AlbumTabProps {
    navigation: any;
    route: any;
}

export const AlbumsTab: React.FC<AlbumTabProps> = ({ navigation, route }) => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <View style={{ flexDirection: "row", alignItems: "center", marginStart: 10 }}>
                    <Text style={{ marginStart: 8, fontSize: 22, color: 'black', fontWeight: '700', alignItems: "center" }}>My Album Gallery</Text>
                </View>
            ),
            headerTitle: '',
            headerStyle: {
                elevation: 0,
                shadowOpacity: 0
            },
        });
    }, [navigation]);

    const albums = [
        {
            id: '1',
            albumName: "Blues",
            albumThumbnail: Images.sample_post_image

        },
        {
            id: "2",
            albumName: "Yellows",
            albumThumbnail: Images.sample_post_image_2
        },
        {
            id: "3",
            albumName: "Reds",
            albumThumbnail: Images.sample_post_image_3
        },
        {
            id: "4",
            albumName: "Oranges",
            albumThumbnail: Images.sample_post_image_4
        },
        {
            id: "5",
            albumName: "Blacks",
            albumThumbnail: Images.sample_post_image_5
        },
        {
            id: "6",
            albumName: "Whites",
            albumThumbnail: Images.sample_post_image_6
        },
        {
            id: "7",
            albumName: "Purples",
            albumThumbnail: Images.sample_post_image_7
        },
        {
            id: "8",
            albumName: "Pinks",
            albumThumbnail: Images.sample_post_image_8
        },
        {
            id: "9",
            albumName: "Greens",
            albumThumbnail: Images.sample_post_image_9
        },
        {
            id: "10",
            albumName: "Maroons",
            albumThumbnail: Images.sample_post_image_10
        },
    ];

    return (
        <MenuProvider>
            <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
                <View style={{ flexDirection: "column", flex: 1 }}>
                    <View style={{ width: '100%', alignItems: "flex-end" }}>
                        <Menu>
                            <MenuTrigger style={{ marginHorizontal: 10 }}>
                                <View style={{ flexDirection: "row", borderColor: 'gray', borderWidth: 1, padding: 5 }}>
                                    <Text style={{ color: 'black' }}>Sort by: </Text>
                                    <MaterialIcons name="keyboard-arrow-down" size={20} color="#666" />
                                </View>
                            </MenuTrigger>
                            <MenuOptions>
                                <MenuOption onSelect={() => Alert.alert('Newest')} >
                                    <View style={{ flexDirection: "row" }}>
                                        <MaterialIcons name="check" size={20} color="#666" style={{ display: 'none' }} />
                                        <Text style={{ color: 'black', marginStart: 10 }}>Newest</Text>
                                    </View>
                                </MenuOption>
                                <MenuOption onSelect={() => Alert.alert(`Oldest`)} >
                                    <View style={{ flexDirection: "row" }}>
                                        <MaterialIcons name="check" size={20} color="#666" style={{ display: 'none' }} />
                                        <Text style={{ color: 'black', marginStart: 10 }}>Oldest</Text>
                                    </View>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <FlatList
                            data={albums}
                            renderItem={({ item, index }) => (
                                <View style={{ width: '33%', flex: albums.length % 3 === 2 && index === albums.length - 1 ? 1 : undefined }}>
                                    <TouchableOpacity>
                                        <View style={{ marginBottom: 3, marginRight: index % 3 !== 2 ? 2 : 0, }}>
                                            <Image source={item.albumThumbnail} resizeMode="cover" style={{ width: '100%', height: 120 }} />
                                            <View style={{ position: "absolute", top: 0, width: '100%' }}>
                                                <MaterialCommunityIcons name="checkbox-multiple-blank" size={26} color={'white'} style={{alignSelf: "flex-end", margin: 5}} />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                            keyExtractor={(item) => item.id}
                            numColumns={3}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </MenuProvider>
    );
} 