import { Image, Keyboard, StyleSheet, Text, TouchableWithoutFeedback, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Images } from "../../../utils/Images";
import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "react-native-toast-notifications";
import { Colors, globalStyles } from "../../../utils/GlobalStyles";
import { EmailComponent } from "../../../components/customComponents/TextInputs/EmailComponent";
import { PasswordComponent } from "../../../components/customComponents/TextInputs/PasswordComponent";
import { ActivityIndicator } from "react-native-paper";


interface LoginScreenProps {
    navigation: any;
    route: any;
}

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
    const toast = useToast();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);

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
                            style={[styles.subHeaderTitle, globalStyles.textDefaults]}>
                            Socialize. Connect. Paste It!
                        </Text>
                        <Text
                            style={[styles.headerTitle, globalStyles.textDefaults]}>
                            Sign in to your account
                        </Text>

                    </View>

                    <EmailComponent
                        email={email}
                        setEmail={setEmail}
                        isEmailAvailable
                        isValidEmail={isValidEmail} />
                    <PasswordComponent
                        password={password}
                        setPassword={setPassword}
                        isPasswordValid={isPasswordValid}
                        warningText="Please enter a valid password"
                        placeholderText="Password" />

                    <View style={styles.forgottenPassContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('Forgot');
                            }}
                            style={{ marginEnd: 35 }}>
                            <Text style={[styles.touchableForgot]}>Forgotten Password?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={async () => {
                            if (!isLoading) {
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
                                            toast.show(result, { type: 'warning' });

                                        }
                                    } catch (error: any) {
                                        toast.show("An unexpected error occurred", { type: 'danger' });
                                    }
                                }
                            }
                            setIsLoading(false);

                        }}
                        style={[styles.buttonContainer, { marginTop: 35, backgroundColor: Colors.primaryBrand }]}>
                        {isLoading ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text style={[styles.buttonText]}>Login</Text>
                        )}
                    </TouchableOpacity>


                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Register');
                        }}
                        style={[styles.buttonContainer, { marginTop: 10, backgroundColor: Colors.secondaryBrand }]}>
                        <Text style={[styles.buttonText]}>Create an Account</Text>
                    </TouchableOpacity>

                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
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
    forgottenPassContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 10
    },
    touchableForgot: {
        color: Colors.primaryBrand, fontWeight: '700', fontSize: 16, fontFamily: 'Roboto-Medium'
    },
    buttonContainer: {
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 30,
    },
    buttonText: {
        color: 'white', fontSize: 20, textAlign: 'center', fontFamily: 'Roboto-Medium'
    },

});