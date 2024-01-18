import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface IndividualPhotoProps{
    photos: { id: string; uploadDate: string; photoUrl: ImageSourcePropType; }[];
    index: number;
    item: any;
    navigation: any;
    route: any;
}

export const IndividualPhoto: React.FC<IndividualPhotoProps> = ({photos, index, item, navigation, route}) => {
    return (
        <View style={{ width: '33%', flex: photos.length % 3 === 2 && index === photos.length - 1 ? 1 : undefined }}>
            <TouchableOpacity onPress={() => navigation.navigate('Photos')}>
                <View style={{ marginBottom: 3, marginRight: index % 3 !== 2 ? 2 : 0, }}>
                    <Image source={item.photoUrl} resizeMode="cover" style={{ width: '100%', height: 120 }} />
                </View>
            </TouchableOpacity>
        </View>
    );
}