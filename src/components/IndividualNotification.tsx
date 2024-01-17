import { Image, Text, TouchableOpacity, View } from "react-native";
import { Images } from "../utils/Images";
import Entypo from 'react-native-vector-icons/Entypo'

export const IndividualNotification = () => {
    return (
        <View>
            <TouchableOpacity onPress={() => console.log('parent')}>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: "space-between", paddingVertical: 8, paddingHorizontal: 12, alignItems: "center" }}>
                    <View style={{ flex: 0 }}>
                        <Image source={Images.sample_avatar} resizeMode="cover" style={{ aspectRatio: 1, width: 50, height: 50 }} />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                        <Text style={{ fontSize: 14, fontFamily: 'Roboto-Medium', color: 'gray', marginStart: 10 }}>
                            <Text style={{ color: 'black', fontWeight: '700' }}>John Bernard Tinio</Text>
                            <Text style={{ color: 'darkgray' }}> commented on your post.</Text>
                            <Text> 1 d</Text>
                            <Text style={{color: 'red', fontSize: 18}}> *</Text>
                        </Text>
                    </View>
                    
                </View>
            </TouchableOpacity>


        </View>
    );
}