import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, SafeAreaView, Text, TouchableOpacity, View, TouchableWithoutFeedback, ActivityIndicator } from "react-native";
import { IndividualPhoto } from "../../../components/IndividualPhoto";
import { Button, FAB, Modal, Portal, Provider, TextInput } from "react-native-paper";
import { usePhoto } from "../../../context/PhotoContext";
import BottomSheet from "@gorhom/bottom-sheet";
import Ionicons from "react-native-vector-icons/Ionicons";
import { MediaType, launchImageLibrary } from 'react-native-image-picker';
import { useToast } from "react-native-toast-notifications";
import { useAlbum } from "../../../context/AlbumContext";
import { Colors, credentialTextTheme } from "../../../utils/GlobalStyles";

interface PhotoScreenProps {
    navigation: any;
    route: any;
}

export const PhotosScreen: React.FC<PhotoScreenProps> = ({ navigation, route }) => {
    const toast = useToast();
    const { getAllPhotos, addPhoto } = usePhoto();
    const { editAlbum, deleteAlbum } = useAlbum();

    const [albumName, setAlbumName] = useState("Album");
    const [albumId, setAlbumId] = useState('');
    const [isAlbumValid, setIsAlbumValid] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const [photos, setPhotos] = useState<any>([]);
    const [fabOpen, setFabOpen] = useState(false);

    useEffect(() => {
        setAlbumName(route.params?.albumName);
        setAlbumId(route.params?.albumId);

        getPhotos(route.params?.albumId);

        navigation.setOptions({
            headerTitle: route.params?.albumName,
        });

        return () => {
            setAlbumName(route.params?.albumName);
            setAlbumId(route.params?.albumId);
        }
    }, [navigation]);

    //api functions
    const ImagePicker = () => {
        const options = {
            mediaType: 'photo' as MediaType,
            storageOptions: {
                path: 'image',
                mediaType: 'photo'
            }
        };

        launchImageLibrary(options, async response => {
            setIsLoading(true);
            if (response?.assets) {
                const file = response.assets[0].uri;
                const name = file?.split('/').pop();

                const formData = new FormData();
                formData.append('albumId', albumId);
                formData.append('file', {
                    uri: file,
                    name: name,
                    type: 'image/jpg'
                });

                try {
                    const result = addPhoto ? await addPhoto(formData) : undefined;
                    if (result) {
                        toast.show('Photo uploaded successfully!', { type: 'success' });
                        getPhotos(albumId);
                    } else {
                        toast.show(result, { type: 'warning' });
                    }
                } catch (error: any) {
                    toast.show("An unexpected error occurred", { type: 'danger' });
                    console.log(error);
                }
            }
            setIsLoading(false);
        });
    }
    const onEditAlbum = async () => {
        const trimmedAlbumName = albumName.trim();
        setIsAlbumValid(!!trimmedAlbumName);
        if (!!trimmedAlbumName) {
            try {
                const result = editAlbum ? await editAlbum(albumId, albumName) : undefined;
                if (result) {
                    toast.show('Album Updated!', {
                        type: "success",
                    });

                    navigation.setOptions({
                        headerTitle: albumName,
                    });
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
    }
    const onDeleteAlbum = async () => {
        try {
            const result = deleteAlbum ? await deleteAlbum(albumId) : undefined;
            if (result) {
                toast.show('Album Deleted!', {
                    type: "success",
                });
                navigation.goBack();
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
    const getPhotos = async (allbumId: string) => {
        setIsLoading(true);
        try {
            const result = getAllPhotos ? await getAllPhotos(allbumId) : undefined;
            if (result) {
                setPhotos(result);
            }
        } catch (error: any) {
            console.error("Error fetching photos:", error.response);
        }
        setIsLoading(false);
    };

    //Fab
    const handleFabPress = () => {
        setFabOpen(!fabOpen);
    };
    const handleOptionPress = (option: string) => {
        if (option == "Edit Album") {
            setIsBottomSheetVisible(true)
        } else if (option == "Upload Photo") {
            ImagePicker();
        } else if (option == "Remove Album") {
            showModal();
        }
        setFabOpen(false);
    };
    const actions = [
        { icon: "upload", label: "Upload Photo", color: Colors.primaryBrand, onPress: () => handleOptionPress("Upload Photo") },
        {
            icon: "image-edit-outline",
            label: "Edit Album",
            color: Colors.primaryBrand,
            onPress: () => handleOptionPress("Edit Album"),
        },
        {
            icon: "image-remove",
            label: "Remove Album",
            color: Colors.primaryBrand,
            onPress: () => handleOptionPress("Remove Album"),
        },
    ];
    const filteredActions = albumName !== "Uploads" ? actions : actions.slice(0, 1);


    //bottom sheet
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
    const snapPoints = useMemo(() => ['40%', '45%'], []);
    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            setIsBottomSheetVisible(false);
        }
    }, []);

    //modal
    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <TouchableWithoutFeedback onPress={() => bottomSheetRef.current && bottomSheetRef.current.close()}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "column", flex: 1 }}>
                        {isLoading ? (
                            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                                <ActivityIndicator size="large" color={Colors.primaryBrand} />
                            </View>
                        ) : (
                            <>
                                {photos.length !== 0 ? (
                                    <View style={{ marginTop: 10 }}>
                                        <FlatList
                                            data={photos}
                                            renderItem={({ item, index }) => (
                                                <IndividualPhoto key={item.id} index={index} item={item} navigation={navigation} route={route} />
                                            )}
                                            keyExtractor={(item) => item.id}
                                            numColumns={3}
                                            showsVerticalScrollIndicator={false} />
                                    </View>
                                ) : (
                                    <View style={{ alignItems: "flex-end", justifyContent: "center", flex: 1, flexDirection: "row" }}>
                                        <Text style={{ fontSize: 18, fontFamily: 'Roboto-Medium', color: 'black', fontWeight: '500' }}>No Photos Uploaded. Add some!</Text>
                                    </View>
                                )}
                            </>
                        )}
                        <Provider>
                            <Portal>
                                <FAB.Group
                                    open={fabOpen}
                                    icon={fabOpen ? "close" : "plus"}
                                    actions={filteredActions}
                                    color="white"
                                    onStateChange={() => setFabOpen(!fabOpen)}
                                    onPress={handleFabPress}
                                    fabStyle={{ backgroundColor: Colors.secondaryBrand, borderRadius: 50, }}
                                    visible={true}
                                />
                            </Portal>
                        </Provider>
                    </View>
                    <Modal
                        visible={visible}
                        onDismiss={hideModal}
                        contentContainerStyle={{
                            flexDirection: "column",
                            backgroundColor: 'white',
                            borderRadius: 15,
                            height: 300,
                            width: 250,
                            alignSelf: "center",
                            alignItems: "flex-start",
                        }}>
                        <View style={{ marginBottom: 10, padding: 20 }}>
                            <Text style={{ alignSelf: "center", fontSize: 18, textAlign: "center", fontWeight: '700', color: 'black', fontFamily: 'Roboto-Medium' }}>
                                Are you sure you want to delete this album?
                            </Text>
                            <Text style={{ marginTop: 10, alignSelf: "center", textAlign: "center" }}>
                                You're requesting to delete the album '{albumName}'.{'\n'}You cannot revert this back, Confirm?
                            </Text>
                        </View>
                        <View style={{ height: 1, backgroundColor: 'darkgray', width: '100%' }} />
                        <TouchableOpacity onPress={onDeleteAlbum} style={{ width: '100%', alignSelf: "center", paddingVertical: 15 }}>
                            <Text style={{ color: Colors.danger, fontWeight: '700', fontFamily: 'Roboto-Medium', fontSize: 16, alignSelf: "center" }}>Continue delete album</Text>
                        </TouchableOpacity>
                        <View style={{ height: 1, backgroundColor: 'darkgray', width: '100%', marginBottom: 10 }} />
                        <TouchableOpacity onPress={hideModal} style={{ width: '100%', alignSelf: "center", marginTop: 5, flex: 0 }}>
                            <Text style={{ color: 'black', fontWeight: '700', fontFamily: 'Roboto-Medium', fontSize: 16, alignSelf: "center" }}>Cancel</Text>
                        </TouchableOpacity>
                    </Modal>
                    
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
                                onPress={onEditAlbum}
                                style={[{ padding: 15, borderRadius: 10, marginHorizontal: 30, marginTop: 20, backgroundColor: Colors.warning }]}>
                                <Text style={[{ color: 'white', fontSize: 20, textAlign: 'center', fontFamily: 'Roboto-Medium' }]}>Edit Album</Text>
                            </TouchableOpacity>
                        </View>
                    </BottomSheet>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView >
    );
}
