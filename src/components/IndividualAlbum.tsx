import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Images } from "../utils/Images";

interface IndividualAlbumProps {
    index: number;
    item: any;
    navigation: any;
    route: any;
}

export const IndividualAlbum: React.FC<IndividualAlbumProps> = ({ index, item, navigation, route }) => {
    return (
        <View style={{ width: '33.3%', marginBottom: 3, marginRight: index % 3 !== 2 ? 2 : 0 }}>
            <TouchableOpacity onPress={() => {
                navigation.navigate('Photos', {
                    albumId: item.albumDTO.id,
                    albumName: item.albumDTO.albumName
                });
            }}>
                <View>
                    <Image source={(item.firstPhoto.photo) ? { uri: item.firstPhoto.photo } : Images.album_default } resizeMode={item.albumDTO.albumName == "Uploads" ? 'contain' : 'cover'} style={{ width: '100%', height: 130 }} />
                    <View style={{ position: "absolute", top: 0, width: '100%'}}>
                        <MaterialCommunityIcons name="checkbox-multiple-blank" size={26} color={'lightgray'} style={{ alignSelf: "flex-end", margin: 5 }} />
                    </View>
                    <View style={{ position: "absolute", bottom: 0, backgroundColor: '#00000070', width: '100%' }}>
                        <Text style={{ textAlign: "center", color: 'white', fontSize: 16, marginHorizontal: 5 }}>{item.albumDTO.albumName}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}