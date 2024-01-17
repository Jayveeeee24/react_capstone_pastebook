import { Image, Text, TouchableOpacity, View } from "react-native";
import { images } from "../utils/Images";
import { colors } from "../utils/config";

export const IndividualFriendRequest = () => {
    return (
        <TouchableOpacity>
            <View style={{ flexDirection: "row", width: '100%', paddingVertical: 8, paddingHorizontal: 12, alignItems: "center" }}>
                <View style={{ flex: 0, marginEnd: 10 }}>
                    <Image source={images.sample_avatar} resizeMode="cover" style={{ aspectRatio: 1, width: 50, height: 50, borderRadius: 25 }} />
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                    <Text>
                        <Text style={{ color: 'black', fontWeight: '900' }}>John Bernard Tinio</Text>
                        <Text> started following you.</Text>
                        <Text> 1 d</Text>
                    </Text>
                </View>
                <View style={{ flex: 0, alignItems: "center" }}>
                    <TouchableOpacity style={{ backgroundColor: colors.primaryBrand, borderRadius: 5, paddingHorizontal: 14, paddingVertical: 5 }}>
                        <Text style={[{ color: 'white', fontWeight: '500' }]}>Follow</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}