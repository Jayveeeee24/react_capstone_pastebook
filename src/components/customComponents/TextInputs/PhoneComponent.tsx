import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors, credentialTextTheme, globalStyles } from "../../../utils/GlobalStyles";
import React from "react";

interface PhoneComponentProps {
    phoneNumber: string;
    setPhoneNumber: (value: string) => void;
}

export const PhoneComponent: React.FC<PhoneComponentProps> = ({ phoneNumber, setPhoneNumber }) => {
    return (
        <>
            <View style={[styles.container, {}]}>
                <MaterialCommunityIcons name="phone-outline" size={30} color={Colors.placeholderTextColor} style={{ marginHorizontal: 5 }} />
                <TextInput
                    placeholder="Phone Number"
                    theme={credentialTextTheme}
                    style={[globalStyles.textDefaults, styles.textInput]}
                    placeholderTextColor={Colors.placeholderTextColor}
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber} />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomColor: '#ccc',
        marginHorizontal: 30,
        alignItems: "center"
    },
    textInput: {
        color: 'black',
        fontSize: 18,
        flex: 1,
        backgroundColor: 'transparent'
    },
});