import { useEffect, useState } from "react";
import { Alert, FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from "react-native-popup-menu";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Images } from "../../utils/Images";
import { IndividualAlbum } from "../../components/IndividualAlbum";
import { useAlbum } from "../../context/AlbumContext";
import { usePhoto } from "../../context/PhotoContext";

interface AlbumTabProps {
    navigation: any;
    route: any;
}

export const AlbumsTab: React.FC<AlbumTabProps> = ({ navigation, route }) => {
    const { getAllAlbums } = useAlbum();
    const { getPhotoById } = usePhoto();

    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [albums, setAlbums] = useState<any>([{}]);

    useEffect(() => {
        getAlbums();
    }, []);

    const getAlbums = async () => {
        try {
            const result = getAllAlbums ? await getAllAlbums() : undefined;

            // await fetchPhoto(result[0].firstPhoto.id);
            if (result) {
                const updatedAlbums = await Promise.all(
                    result.map(async (item: { firstPhoto: any; }) => {
                        try {
                            const photo = await fetchPhoto(item.firstPhoto.id);
                            return {
                                ...item,
                                firstPhoto: {
                                    ...item.firstPhoto,
                                    photo: await photo,
                                },
                            };
                        } catch (error) {
                            // Handle error if necessary
                            console.error("Error fetching photo:", error);
                            return item;
                        }
                    })
                );

                console.log(updatedAlbums);
                setAlbums(updatedAlbums);
            }
        } catch (error) {
            // Handle error if necessary
            console.error("Error fetching albums:", error);
        }
    };


    const fetchPhoto = async (photoId: string) => {
        try {
            const result = getPhotoById ? await getPhotoById(photoId) : undefined;
            // console.log(result)
            return result;
        } catch (error) {
            // Handle error
        }
    };

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
                                <IndividualAlbum albums={albums} index={index} item={item} navigation={navigation} route={route} />
                            )}
                            keyExtractor={(item) => item.firstPhoto.albumId}
                            numColumns={3}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </MenuProvider>
    );
} 