import { Alert, Image, TouchableOpacity, View } from "react-native";
import { Images } from "../utils/Images";

interface IndividualPhotoProps {
    index: number;
    item: any;
    navigation: any;
    route: any;
}

export const IndividualPhoto: React.FC<IndividualPhotoProps> = ({ index, item, navigation, route }) => {

    return (
        <View style={{ width: '33.3%', marginBottom: 3, marginRight: index % 3 !== 2 ? 2 : 0 }}>
            <TouchableOpacity onPress={() => Alert.alert('haha')}>
                <Image source={(item.photo) ? { uri: item.photo } : Images.album_default } resizeMode="cover" style={{ width: '100%', height: 120 }} />
            </TouchableOpacity>
        </View>
    );
}