import { useState } from "react";
import { Alert, FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from "react-native-popup-menu";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Images } from "../../utils/Images";
import { IndividualAlbum } from "../../components/IndividualAlbum";

interface AlbumTabProps {
    navigation: any;
    route: any;
}

export const AlbumsTab: React.FC<AlbumTabProps> = ({ navigation, route }) => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);

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
                                <IndividualAlbum albums={albums} index={index} item={item} navigation={navigation} route={route}/>
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