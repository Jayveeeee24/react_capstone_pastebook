import { Image, Text, TouchableOpacity, View } from "react-native";
import { Images } from "../utils/Images";

export const IndividualFollower = () => {
    return (
        <TouchableOpacity>
            <View style={{ flexDirection: "row", width: '100%', paddingVertical: 8, paddingHorizontal: 20, alignItems: "center" }}>
                <View style={{ flex: 0, marginEnd: 10 }}>
                    <Image source={Images.sample_avatar} resizeMode="cover" style={{ aspectRatio: 1, width: 50, height: 50, borderRadius: 25 }} />
                </View>
                <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-start" }}>
                    <Text style={{ color: 'black', fontWeight: '900' }}>john.tinio</Text>
                    <Text>John Bernard Tinio</Text>
                </View>
                <TouchableOpacity style={{flex: 0, alignItems: "center", backgroundColor: 'darkgray', borderRadius: 5, paddingHorizontal: 14, paddingVertical: 5}}>
                    <Text style={{color: 'white', fontWeight: '500'}}>Followed</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}