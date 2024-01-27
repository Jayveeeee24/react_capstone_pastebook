import { Image, Text, View } from "react-native";
import { Images } from "../utils/Images";
import { Colors } from "../utils/Config";
import { TouchableOpacity } from "react-native-gesture-handler";

export const IndividualComment = () => {
    return (
        <View style={{ marginHorizontal: 10, flexDirection: "row" }}>
            <Image source={Images.sample_avatar_female} resizeMode="cover" style={{ aspectRatio: 1, width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: Colors.orange }} />
            <View style={{ flexDirection: "column", marginStart: 15 }}>
                <View style={{flexDirection: "row"}}>
                    <TouchableOpacity >
                        <Text style={{ fontSize: 16, fontWeight: '700', color: 'black', alignSelf: "flex-start" }}>jayvee.artemis</Text>
                    </TouchableOpacity>
                    <Text style={{fontSize: 14, color: 'black', marginStart: 10, alignSelf: "center"}}>3 d</Text>
                </View>
                <Text style={{ fontSize: 14, color: 'black' }}>Nice! maganda ang place</Text>
            </View>
        </View>
    );
}