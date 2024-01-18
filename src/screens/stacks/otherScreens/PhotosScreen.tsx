import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, View } from "react-native";
import { Images } from "../../../utils/Images";
import { IndividualPhoto } from "../../../components/IndividualPhoto";

interface PhotoScreenProps {
    navigation: any;
    route: any;
}

export const PhotosScreen: React.FC<PhotoScreenProps> = ({ navigation, route }) => {

    const [albumName, setAlbumName] = useState("Greens");

    useEffect(() => {
        navigation.setOptions({
            headerTitle: albumName,
        });
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
            <View style={{ flexDirection: "column", flex: 1 }}>
                <View style={{ marginTop: 10 }}>
                    <FlatList
                        data={photos}
                        renderItem={({ item, index }) => (
                            <IndividualPhoto photos={photos} index={index} item={item} navigation={navigation} route={route} />
                        )}
                        keyExtractor={(item) => item.id}
                        numColumns={3}
                        showsVerticalScrollIndicator={false}/>
                </View>
            </View>
        </SafeAreaView>
    );
}