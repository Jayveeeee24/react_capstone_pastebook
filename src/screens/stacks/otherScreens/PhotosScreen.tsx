import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Animated, Text, TouchableOpacity, View, TouchableWithoutFeedback } from "react-native";
import { Images } from "../../../utils/Images";
import { IndividualPhoto } from "../../../components/IndividualPhoto";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { CommonActions } from "@react-navigation/native";
import { FAB } from "react-native-paper";
import { Colors } from "../../../utils/Config";

interface PhotoScreenProps {
    navigation: any;
    route: any;
}

export const PhotosScreen: React.FC<PhotoScreenProps> = ({ navigation, route }) => {

    const [albumName, setAlbumName] = useState("Greens");
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
        navigation.setOptions({
            headerTitle: albumName,
            headerLeft: () => (
                <TouchableOpacity onPress={() => {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [
                                { name: 'HomeTab' },
                                {
                                    name: 'AlbumsTab',
                                },
                            ],
                        })
                    );
                }} style={{ flexDirection: "row", alignItems: "center", marginStart: 10 }}>
                    <MaterialIcons name={'arrow-back'} size={32} color={'black'} />
                </TouchableOpacity>
            )
        })
    }, [albumName, navigation]);

    const photos = [
        {
            id: '1',
            uploadDate: "Blues",
            photoUrl: Images.sample_post_image

        },
        {
            id: "2",
            uploadDate: "Yellows",
            photoUrl: Images.sample_post_image_2
        },
        {
            id: "3",
            uploadDate: "Reds",
            photoUrl: Images.sample_post_image_3
        },
        {
            id: "4",
            uploadDate: "Oranges",
            photoUrl: Images.sample_post_image_4
        },
        {
            id: "5",
            uploadDate: "Blacks",
            photoUrl: Images.sample_post_image_5
        },
        {
            id: "6",
            uploadDate: "Whites",
            photoUrl: Images.sample_post_image_6
        },
        {
            id: "7",
            uploadDate: "Purples",
            photoUrl: Images.sample_post_image_7
        },
        {
            id: "8",
            uploadDate: "Pinks",
            photoUrl: Images.sample_post_image_8
        },
        {
            id: "9",
            uploadDate: "Greens",
            photoUrl: Images.sample_post_image_9
        },
        {
            id: "10",
            uploadDate: "Maroons",
            photoUrl: Images.sample_post_image_10
        },
    ];

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <TouchableWithoutFeedback onPress={() => {
                setBottomSheetVisible(false);
            }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "column", flex: 1 }}>
                        <View>
                            <FlatList
                                data={photos}
                                renderItem={({ item, index }) => (
                                    <IndividualPhoto photos={photos} index={index} item={item} navigation={navigation} route={route} />
                                )}
                                keyExtractor={(item) => item.id}
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
                                bottom: 0, backgroundColor: Colors.success
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
    );
}