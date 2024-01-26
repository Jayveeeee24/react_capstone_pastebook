import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, SafeAreaView, Animated, Text, TouchableOpacity, View, TouchableWithoutFeedback } from "react-native";
import { Images } from "../../../utils/Images";
import { IndividualPhoto } from "../../../components/IndividualPhoto";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { CommonActions } from "@react-navigation/native";
import { FAB, Portal, Provider, TextInput } from "react-native-paper";
import { Colors, credentialTextTheme } from "../../../utils/Config";
import { useAlbum } from "../../../context/AlbumContext";
import { usePhoto } from "../../../context/PhotoContext";
import BottomSheet from "@gorhom/bottom-sheet";
import Ionicons from "react-native-vector-icons/Ionicons";

interface PhotoScreenProps {
    navigation: any;
    route: any;
}

export const PhotosScreen: React.FC<PhotoScreenProps> = ({ navigation, route }) => {
    const { getAllPhotos } = usePhoto();

    const [albumName, setAlbumName] = useState("Album");
    const [albumId, setAlbumId] = useState('');
    const [albums, setAlbums] = useState<any>([]);
    const [isAlbumValid, setIsAlbumValid] = useState(true);

    const [photos, setPhotos] = useState<any>([]);
    const [fabOpen, setFabOpen] = useState(false);

    useEffect(() => {
        setAlbumName(route.params?.albumName);
        setAlbumId(route.params?.albumId);

        getPhotos(route.params?.albumId);

        navigation.setOptions({
            headerTitle: route.params?.albumName,
        });
    }, [navigation]);

    const getPhotos = async (allbumId: string) => {
        try {
            const result = getAllPhotos ? await getAllPhotos(allbumId) : undefined;
            if (result) {
                setPhotos(result);
            }
        } catch (error: any) {
            console.error("Error fetching photos:", error.response);
        }
    };

    //Fab
    const handleFabPress = () => {
        setFabOpen(!fabOpen);
    };
    const handleOptionPress = (option: string) => {
        if (option == "Edit Album") {
            setIsBottomSheetVisible(true)
        }
        setFabOpen(false);
    };

    //bottom sheet
    //bottom sheet
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
    const snapPoints = useMemo(() => ['40%', '45%'], []);
    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            setIsBottomSheetVisible(false);
            setAlbumName('');
        }
    }, []);

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <TouchableWithoutFeedback onPress={() => bottomSheetRef.current && bottomSheetRef.current.close()}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "column", flex: 1 }}>
                        {photos.length !== 0 ? (
                            <View style={{ marginTop: 10 }}>
                                <FlatList
                                    data={photos}
                                    renderItem={({ item, index }) => (
                                        <IndividualPhoto index={index} item={item} navigation={navigation} route={route} />
                                    )}
                                    keyExtractor={(item) => item.id}
                                    numColumns={3}
                                    showsVerticalScrollIndicator={false} />
                            </View>
                        ) : (
                            <View style={{ alignItems: "flex-end", justifyContent: "center", flex: 1, flexDirection: "row" }}>
                                <Text style={{fontSize: 18, fontFamily: 'Roboto-Medium', color: 'black', fontWeight: '500'}}>No Photos Uploaded. Add some!</Text>
                            </View>
                        )}
                        <Provider>
                            <Portal>
                                <FAB.Group
                                    open={fabOpen}
                                    icon={fabOpen ? "close" : "plus"}
                                    actions={[
                                        { icon: "upload", label: "Upload Photo", color: Colors.primaryBrand, onPress: () => handleOptionPress("Upload Photo") },
                                        { icon: "image-edit-outline", label: "Edit Album", color: Colors.primaryBrand, onPress: () => handleOptionPress("Edit Album") },
                                        { icon: "image-remove", label: "Remove Album", color: Colors.primaryBrand, onPress: () => handleOptionPress("Remove Album") },
                                    ]}
                                    color="white"
                                    onStateChange={() => setFabOpen(!fabOpen)}
                                    onPress={handleFabPress}
                                    fabStyle={{ backgroundColor: Colors.secondaryBrand, borderRadius: 50, }}
                                    visible={true}
                                />
                            </Portal>
                        </Provider>
                    </View>
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
                            <Text style={{ textAlign: "center", fontSize: 16, color: 'black', fontWeight: '500' }}>Edit Album</Text>
                        </View>
                        <View style={{ marginVertical: 30, }}>
                            <View style={[{ flexDirection: 'row', borderBottomColor: '#ccc', marginHorizontal: 30, alignItems: "center", marginBottom: isAlbumValid ? 10 : 0 }]}>
                                <Ionicons name="albums-outline" size={20} color="#666" style={{ marginHorizontal: 5 }} />
                                <TextInput
                                    placeholder="Album Name"
                                    style={{ fontFamily: 'Roboto-Medium', color: 'black', fontSize: 18, flex: 1, backgroundColor: 'transparent' }}
                                    value={albumName}
                                    onChangeText={setAlbumName}
                                    theme={credentialTextTheme}
                                    placeholderTextColor={'#666'} />
                            </View>
                            {!isAlbumValid && (
                                <Text style={{ color: 'red', marginStart: 30 }}>Please enter a valid album name.</Text>
                            )}
                            <TouchableOpacity
                                onPress={async () => {
                                    const trimmedAlbumName = albumName.trim();
                                    setIsAlbumValid(!!trimmedAlbumName);
                                    if (!!trimmedAlbumName) {

                                    }
                                }}
                                style={[{ padding: 15, borderRadius: 10, marginHorizontal: 30, marginTop: 20, backgroundColor: Colors.warning }]}>
                                <Text style={[{ color: 'white', fontSize: 20, textAlign: 'center', fontFamily: 'Roboto-Medium' }]}>Edit Album</Text>
                            </TouchableOpacity>
                        </View>
                    </BottomSheet>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}