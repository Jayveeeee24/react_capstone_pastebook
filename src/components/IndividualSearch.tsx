import { Image, Text, TouchableNativeFeedback, View } from "react-native";
import { images } from "../utils/Images";

export const IndividualSearch = () => {
    return (
        <View>
            <TouchableNativeFeedback>
                <View style={{ flexDirection: 'row', width: '100%', paddingVertical: 8, paddingHorizontal: 12, alignItems: "center" }}>
                    <Image source={images.sample_avatar} resizeMode="cover" style={{ aspectRatio: 1, width: 60, height: 60 }} />
                    <View>
                        <Text style={{ fontSize: 18, fontFamily: 'Roboto-Medium', fontWeight: '900', color: 'black', marginStart: 15 }}>
                            jayvee.artemis
                        </Text>
                        <Text style={{ fontSize: 16, fontFamily: 'Roboto-Medium', color: 'darkgray', marginStart: 15 }}>
                            John Bernard Tinio
                        </Text>
                    </View>
                </View>
            </TouchableNativeFeedback>
        </View>
    );
}