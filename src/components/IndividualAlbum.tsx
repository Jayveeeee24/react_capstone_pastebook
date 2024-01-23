import { Image, ImageSourcePropType, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Images } from "../utils/Images";

interface IndividualAlbumProps {
    albums: { id: string; albumName: string; albumThumbnail: ImageSourcePropType; }[];
    index: number;
    item: any;
    navigation: any;
    route: any;
}

export const IndividualAlbum: React.FC<IndividualAlbumProps> = ({ albums, index, item, navigation, route }) => {
    return (
        <View style={{ width: '33.3%', marginBottom: 3, marginRight: index % 3 !== 2 ? 2 : 0 }}>
            <TouchableOpacity onPress={() => navigation.navigate('Photos')}>
                <View>
                    <Image source={{uri: item.firstPhoto.photo}} resizeMode="cover" style={{ width: '100%', height: 120 }} />
                    <View style={{ position: "absolute", top: 0, width: '100%' }}>
                        <MaterialCommunityIcons name="checkbox-multiple-blank" size={26} color={'white'} style={{ alignSelf: "flex-end", margin: 5 }} />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}