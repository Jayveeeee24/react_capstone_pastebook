import React, { useEffect, useState } from "react";
import { Alert, Animated, FlatList, Modal, SafeAreaView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from "react-native-popup-menu";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { FAB } from "react-native-paper";
import { Colors } from "../../utils/Config";
import { IndividualAlbum } from "../../components/IndividualAlbum";
import { useAlbum } from "../../context/AlbumContext";
import { usePhoto } from "../../context/PhotoContext";

interface AlbumTabProps {
    navigation: any;
    route: any;
}

export const AlbumsTab: React.FC<AlbumTabProps> = ({ navigation, route }) => {
    const { getAllAlbums } = useAlbum();

    const [albums, setAlbums] = useState<any>([]);

    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
    const translateY = new Animated.Value(300);

    useEffect(() => {
        Animated.timing(translateY, {
            toValue: isBottomSheetVisible ? 0 : 300,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isBottomSheetVisible]);
    

    const toggleBottomSheet = () => {
        setBottomSheetVisible(!isBottomSheetVisible);
    };

    useEffect(() => {
        const getAlbums = async () => {
            try {
                const result = getAllAlbums ? await getAllAlbums() : undefined;
                if (result) {
                    setAlbums(result);
                }
            } catch (error) {
                console.error("Error fetching albums:", error);
            }
        };

        getAlbums();
    }, [getAllAlbums]);



    return (
        <MenuProvider>
            <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
                <TouchableWithoutFeedback onPress={() => {
                    setBottomSheetVisible(false);
                }}>
                    <View style={{ flex: 1 }}>
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

                            <FAB
                                color="white"
                                icon='plus'
                                style={{
                                    borderRadius: 50,
                                    position: 'absolute',
                                    margin: 16,
                                    right: 0,
                                    bottom: 0, backgroundColor: Colors.secondaryBrand
                                }}
                                onPress={toggleBottomSheet}
                            />
                        </View>

                        <Animated.View
                            style={[
                                {
                                    transform: [{ translateY: translateY }],
                                    backgroundColor: 'white',
                                    borderTopLeftRadius: 20,
                                    borderTopRightRadius: 20,
                                    padding: 16,
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                },
                            ]}>
                            <Text>This is the bottom sheet content</Text>
                        </Animated.View>
                    </View>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        </MenuProvider>
    );
};
