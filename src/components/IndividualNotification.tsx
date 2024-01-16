import { Image, Text, TouchableOpacity, View } from "react-native";
import { images } from "../utils/Images";

export const IndividualNotification = () => {
    return (
        <View>
            <TouchableOpacity>
                <View style={{ flexDirection: 'row', width: '100%', paddingVertical: 8, paddingHorizontal: 12, alignItems: "center" }}>
                    <Image source={images.sample_avatar} resizeMode="cover" style={{ aspectRatio: 1, width: 60, height: 60 }} />
                    <Text style={{ fontSize: 16, fontFamily: 'Roboto-Medium', color: 'gray', marginStart: 15 }}>
                        <Text style={{color: 'black', fontWeight: '700'}}>John Bernard Tinio</Text>
                        <Text style={{color: 'darkgray'}}> liked your post.</Text>
                        <Text> 1d</Text>
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}