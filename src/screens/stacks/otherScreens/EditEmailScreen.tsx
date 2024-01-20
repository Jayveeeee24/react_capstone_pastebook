import { useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { TextInput } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export const EditEmailScreen = () => {
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isEmailAvailable, setIsEmailAvailable] = useState(true);

    const credentialTextTheme = { colors: { primary: '#3373B0' } };


    return (
        <SafeAreaView>
            <View style={[{flexDirection: 'row', borderBottomColor: '#ccc', marginHorizontal: 30, alignItems: "center", marginBottom: isValidEmail ? 10 : 0 }]}>
                <MaterialIcons name="alternate-email" size={20} color="#666" style={{ marginHorizontal: 5 }} />
                <TextInput
                    placeholder="Email Address"
                    style={[{fontFamily: 'Roboto-Medium', color: 'black', fontSize: 18, flex: 1, backgroundColor: 'transparent'}]}
                    value={email}
                    onChangeText={setEmail}
                    theme={credentialTextTheme}
                    placeholderTextColor={'#666'}
                />

            </View>
            {!isValidEmail && (
                <Text style={{color: 'red', marginStart: 30}}>Please enter a valid email address.</Text>
            )}
            {!isEmailAvailable && (
                <Text style={{color: 'red', marginStart: 30}}>This email is already in use. Please use a different email address.</Text>
            )}
        </SafeAreaView>
    );
}