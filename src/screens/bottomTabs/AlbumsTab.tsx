import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Keyboard, LogBox, SafeAreaView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { FAB, TextInput } from "react-native-paper";
import { Colors, credentialTextTheme } from "../../utils/Config";
import { IndividualAlbum } from "../../components/IndividualAlbum";
import { useAlbum } from "../../context/AlbumContext";
import BottomSheet from "@gorhom/bottom-sheet";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useToast } from "react-native-toast-notifications";

interface AlbumTabProps {
    navigation: any;
    route: any;
}

export const AlbumsTab: React.FC<AlbumTabProps> = ({ navigation, route }) => {
    const { getAllAlbums, addAlbum } = useAlbum();
    const toast = useToast();

    const [albums, setAlbums] = useState<any>([]);
    const [albumName, setAlbumName] = useState('');
    const [isAlbumValid, setIsAlbumValid] = useState(true);

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

    useEffect(() => {
        getAlbums();

        navigation.addListener('focus', () => {
            getAlbums();
        });
    }, [navigation]);

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

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <TouchableWithoutFeedback onPress={() => bottomSheetRef.current && bottomSheetRef.current.close()}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "column", flex: 1 }}>
                        <View style={{ marginTop: 10 }}>
                            <FlatList
                                data={albums}
                                renderItem={({ item, index }) => (
                                    <IndividualAlbum index={index} item={item} navigation={navigation} route={route} />
                                )}
                                keyExtractor={(item) => item.albumDTO.albumId}
                                numColumns={3}
                                showsVerticalScrollIndicator={false} />
                        </View>

                        <FAB
                            color="white"
                            icon='plus'
                            style={{
                                borderRadius: 50,
                                position: 'absolute',
                                margin: 16,
                                right: 0,
                                bottom: 0, backgroundColor: Colors.primaryBrand
                            }}
                            onPress={() => setIsBottomSheetVisible(true)}
                        />
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
                            <Text style={{ textAlign: "center", fontSize: 16, color: 'black', fontWeight: '500' }}>Add Album</Text>
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
                                        try {
                                            const result = addAlbum ? await addAlbum(albumName) : undefined;
                                            if (result) {
                                                toast.show('Album Added!', {
                                                    type: "success",
                                                });
                                                getAlbums();
                                                bottomSheetRef.current && bottomSheetRef.current.close()
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
                                }}
                                style={[{ padding: 15, borderRadius: 10, marginHorizontal: 30, marginTop: 20, backgroundColor: Colors.success }]}>
                                <Text style={[{ color: 'white', fontSize: 20, textAlign: 'center', fontFamily: 'Roboto-Medium' }]}>Add Album</Text>
                            </TouchableOpacity>
                        </View>
                    </BottomSheet>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

