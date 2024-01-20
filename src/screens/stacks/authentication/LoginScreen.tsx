import { Image, Keyboard, StyleSheet, Text, TouchableWithoutFeedback, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Images } from "../../../utils/Images";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { TextInput } from "react-native-paper";
import { Colors } from "../../../utils/Config";
import { useToast } from "react-native-toast-notifications";


interface LoginScreenProps {
    navigation: any;
    route: any;
}

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
    const toast = useToast();
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
            <TouchableWithoutFeedback
                onPress={() => Keyboard.dismiss()}>
                <View>

                    <View style={{ alignItems: 'center' }}>
                        <Image
                            source={Images.logo_wide_dark}
                            style={{ width: 130, height: 35 }}
                        />
                        <Image
                            source={Images.people}
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

                    <View style={[styles.credentialContainer, { marginBottom: isValidEmail ? 20 : 0 }]}>
                        <MaterialIcons name="alternate-email" size={20} color="#666" style={{ marginHorizontal: 5 }} />
                        <TextInput placeholder="Email Address" placeholderTextColor={'#666'} theme={{ colors: { primary: '#3373B0' } }} style={[styles.text, styles.credentialText]} value={email} onChangeText={setEmail} />
                    </View>
                    {!isValidEmail && (
                        <Text style={styles.textValidation}>Please enter a valid email address.</Text>
                    )}
                    <View
                        style={[styles.credentialContainer, {}]}>
                        <MaterialIcons name="lock-outline" size={20} color="#666" style={{ marginHorizontal: 5 }} />
                        <TextInput placeholder="Password" placeholderTextColor={'#666'}
                            theme={{
                                colors: {
                                    primary: '#3373B0',
                                },
                            }}
                            right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={togglePasswordVisibility} />} secureTextEntry={!showPassword} style={[styles.text, styles.credentialText]} value={password} onChangeText={setPassword} />
                    </View>
                    {!isPasswordValid && (
                        <Text style={styles.textValidation}>Please enter a valid password</Text>
                    )}
                    <View style={styles.forgottenPassContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('Forgot');
                            }}
                            style={{ marginEnd: 35 }}>
                            <Text style={[styles.text, styles.touchableForgot]}>Forgotten Password?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={async () => {
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            const isValid = emailRegex.test(email);
                            setIsValidEmail(isValid);

                            const trimmedPassword = password.trim();
                            setIsPasswordValid(!!trimmedPassword && trimmedPassword.length >= 8);

                            if (isValid && trimmedPassword) {
                                try {
                                    setIsLoading(true);
                                    const result = login ? await login(email, password) : undefined;
                                    if (result.token) {
                                        navigation.replace('BottomHome');
                                    } else {
                                        toast.show(result, {type: 'warning'});

                                    }
                                } catch (error: any) {
                                    toast.show("An unexpected error occurred", {type: 'danger'});
                                } finally {
                                    setIsLoading(false);
                                }
                            }
                        }}
                        style={[styles.buttonContainer, { marginTop: 35, backgroundColor: Colors.primaryBrand }]}>
                        {isLoading ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text style={[styles.buttonText, styles.text]}>Login</Text>
                        )}
                    </TouchableOpacity>


                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Register');
                        }}
                        style={[styles.buttonContainer, { marginTop: 10, backgroundColor: Colors.secondaryBrand }]}>
                        <Text style={[styles.buttonText, styles.text]}>Create an Account</Text>
                    </TouchableOpacity>

                </View>
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
        marginHorizontal: 30,
        alignItems: "center"
    },
    credentialText: {
        color: '#000000', fontSize: 18, flex: 1, backgroundColor: 'transparent'
    },
    forgottenPassContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 10
    },
    touchableForgot: {
        color: Colors.primaryBrand, fontWeight: '700', fontSize: 16
    },
    buttonContainer: {
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 30,
    },
    buttonText: {
        color: 'white', fontSize: 20, textAlign: 'center'
    },
    textValidation: {
        color: '#E53935', marginStart: 30
    },

});