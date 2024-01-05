import { Image, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../utils/Images";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export const LoginScreen = () => {
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ alignItems: 'center' }}>
                <Image
                    source={images.people}
                    style={{ width: 350, height: 230 }}
                />
                <Text
                    style={{
                        fontFamily: 'Roboto-Medium',
                        fontSize: 24,
                        color: '#333',
                        fontWeight: '700',
                        marginTop: 50,
                        marginBottom: 20
                    }}>
                    Sign in to your account
                </Text>
            </View>

            <View style={{
                flexDirection: 'row',
                borderBottomColor: '#ccc',
                borderWidth: 0.5,
                marginBottom: 25,
                marginHorizontal: 35,
                alignItems: "center"
            }}>
                <MaterialIcons name="alternate-email" size={20} color="#666" style={{ marginHorizontal: 5 }} />
                <TextInput placeholder="Email Address" />
            </View>
            <View style={{
                flexDirection: 'row',
                borderBottomColor: '#ccc',
                borderWidth: 0.5,
                marginBottom: 25,
                marginHorizontal: 35,
                alignItems: "center"
            }}>
                <MaterialIcons name="lock" size={20} color="#666" style={{ marginHorizontal: 5 }} />
                <TextInput placeholder="Password" secureTextEntry={true} />
            </View>
        </SafeAreaView>
    );
}