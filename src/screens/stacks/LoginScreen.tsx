import { Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../utils/Images";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import React, { useState } from "react";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

interface LoginScreenProps {
    navigation: any;
    route: any;
}

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
            <TouchableWithoutFeedback
                onPress={() => Keyboard.dismiss()}>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={images.logo_wide_dark}
                        style={{ width: 130, height: 35 }}
                    />
                    <Image
                        source={images.people}
                        style={{ width: 350, height: 230 }}
                    />
                    <Text
                        style={[styles.subHeaderTitle, styles.text]}>
                        Socialize. Connect. Paste It!
                    </Text>
                    <Text
                        style={[styles.headerTitle, styles.text]}>
                        Sign in to your account
                    </Text>

                </View>

                <View style={[styles.credentialContainer, { marginBottom: 25 }]}>
                    <MaterialIcons name="alternate-email" size={20} color="#666" style={{ marginHorizontal: 5 }} />
                    <TextInput placeholder="Email Address" placeholderTextColor={'#666'} style={[styles.text, styles.credentialText]} value={email} onChangeText={setEmail} />
                </View>

                <View
                    style={styles.credentialContainer}>
                    <MaterialIcons name="lock-outline" size={20} color="#666" style={{ marginHorizontal: 5 }} />
                    <TextInput placeholder="Password" placeholderTextColor={'#666'} secureTextEntry={true} style={[styles.text, styles.credentialText]} value={password} onChangeText={setPassword} />
                </View>

                <View
                    style={styles.forgottenPassContainer}>
                    <TouchableOpacity onPress={() => {

                    }} style={{ marginEnd: 35 }}>
                        <Text style={[styles.text, styles.touchableForgot]}>Forgotten Password?</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={() => { }}
                    style={[styles.buttonContainer, { marginTop: 35, backgroundColor: '#3373B0' }]}>
                    <Text style={[styles.buttonText, styles.text]}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Register');
                    }}
                    style={[styles.buttonContainer, { marginTop: 10, backgroundColor: '#eab676' }]}>
                    <Text style={[styles.buttonText, styles.text]}>Create an Account</Text>
                </TouchableOpacity>

            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Roboto-Medium'
    },
    headerTitle: {
        fontSize: 26,
        color: '#333',
        fontWeight: '700',
        marginBottom: 40
    },
    subHeaderTitle: {
        fontSize: 16,
        marginTop: 20,
        color: '#333',
        fontWeight: '700',
    },
    credentialContainer: {
        flexDirection: 'row',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginHorizontal: 30,
        alignItems: "center"
    },
    credentialText: {
        color: '#000000', fontSize: 18, flex: 1,
    },
    forgottenPassContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 10
    },
    touchableForgot: {
        color: "#3373B0", fontWeight: '700', fontSize: 16
    },
    buttonContainer: {
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 30,
    },
    buttonText: {
        color: 'white', fontSize: 20, textAlign: 'center'
    },


});