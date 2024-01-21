import { useContext, useState } from "react";
import { Image, Keyboard, LayoutAnimation, SafeAreaView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { ProgressBar, TextInput } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { AuthContext } from "../../../context/AuthContext";
import { useToast } from "react-native-toast-notifications";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Images } from "../../../utils/Images";
import { Colors } from "../../../utils/Config";
import { UserContext } from "../../../context/UserContext";

interface EditEmailScreenProps {
    navigation: any;
    route: any;
}

export const EditEmailScreen: React.FC<EditEmailScreenProps> = ({ navigation }) => {
    const toast = useToast();
    const { verifyEmailNewUser, verifyCode, emailAvailability } = useContext(AuthContext);
    const { changeEmail } = useContext(UserContext);

    const [currentView, setCurrentView] = useState('EmailView');
    const [progress, setProgress] = useState(0.4);

    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');


    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isEmailAvailable, setIsEmailAvailable] = useState(true);
    const [isVerificationCodeValid, setIsVerificationCodeValid] = useState(true);


    const credentialTextTheme = { colors: { primary: '#3373B0' } };

    const validateEmail = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);

        setIsValidEmail(isValid);

        if (isValid) {
            const result = emailAvailability ? await emailAvailability(email) : undefined;
            if (result) {
                setIsEmailAvailable(true);
                handleNext();
            } else {
                setIsEmailAvailable(false);
            }
        }
    };
    const validateVerificationCode = async () => {
        const trimmedVerificationCode = verificationCode.trim();
        setIsVerificationCodeValid(!!trimmedVerificationCode && trimmedVerificationCode.length == 6);

        if (!!trimmedVerificationCode && trimmedVerificationCode.length == 6) {
            handleNext();
        }
    }

    const handleNext = async () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        if (currentView === 'EmailView') {
            try {
                const result = verifyEmailNewUser ? await verifyEmailNewUser(email) : undefined;
                if (result == "Email sent successfully!") {
                    setCurrentView('VerifyCodeView');
                    setProgress(0.8);
                } else {
                    toast.show(result, {
                        type: "warning",
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                toast.show("An unexpected error occurred", { type: 'danger' });
            }
        } else if (currentView === 'VerifyCodeView') {
            try {
                const verificationResult = verifyCode ? await verifyCode(email, verificationCode) : undefined;

                if (verificationResult === true) {
                    try {
                        const changeResult = changeEmail ? await changeEmail(email) : undefined;

                        if (changeResult.id) {
                            toast.show('Email changed successfully!', { type: 'success' });
                            navigation.pop();
                        }else{
                            toast.show(changeResult, {
                                type: 'warning'
                            });
                            
                        }

                    } catch (error) {
                        console.error('Error:', error);
                        toast.show("An unexpected error occurred", { type: 'danger' });
                    }
                } else if (verificationResult.result) {
                    toast.show(verificationResult.result, { type: 'warning' });
                } else {
                    setIsVerificationCodeValid(false);
                }

            } catch (error) {
                console.error('Error:', error);
                toast.show("An unexpected error occurred", { type: 'danger' });
            }
        }
    };

    const getButtonText = () => {
        switch (currentView) {
            case 'EmailView':
                return 'Send Email Verification';
            case 'VerifyCodeView':
                return 'Confirm';
            default:
                return '';
        }
    };
    const renderView = () => {
        switch (currentView) {
            case 'EmailView':
                return (
                    <>
                        <View style={[styles.credentialContainer, { marginBottom: isValidEmail ? 10 : 0 }]}>
                            <MaterialIcons name="alternate-email" size={20} color="#666" style={{ marginHorizontal: 5 }} />
                            <TextInput
                                placeholder="Enter new email address"
                                style={[styles.text, styles.credentialText]}
                                value={email}
                                onChangeText={setEmail}
                                theme={credentialTextTheme}
                                placeholderTextColor={'#666'}
                            />

                        </View>
                        {!isValidEmail && (
                            <Text style={styles.textValidation}>Please enter a valid email address.</Text>
                        )}
                        {!isEmailAvailable && (
                            <Text style={styles.textValidation}>This email is already in use. Please use a different email address.</Text>
                        )}
                    </>
                );
            case 'VerifyCodeView':
                return (
                    <>
                        <View style={[styles.credentialContainer, { marginBottom: isVerificationCodeValid ? 10 : 0 }]}>
                            <MaterialCommunityIcons name="email-check-outline" size={30} color="#666" style={{ marginHorizontal: 5 }} />
                            <TextInput placeholder="Verification Code" theme={credentialTextTheme} style={[styles.text, styles.credentialText]} placeholderTextColor={'#666'} value={verificationCode} onChangeText={setVerificationCode} />
                        </View>
                        {!isVerificationCodeValid && (
                            <Text style={styles.textValidation}>Please enter the verification code sent in the email</Text>
                        )}
                    </>
                )
            default:
                return null;
        }
    };
    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1, justifyContent: "center" }}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View>
                    <View style={{ alignItems: 'center' }}>
                        <Image
                            source={Images.logo_wide_dark}
                            style={{ width: 130, height: 35 }} />
                        <Image
                            source={Images.email}
                            style={{ width: 350, height: 230 }} />
                        <Text
                            style={[styles.subHeaderTitle, styles.text]}>
                            Socialize. Connect. Paste It!
                        </Text>
                        <Text
                            style={[styles.headerTitle, styles.text]}>
                            Change Account Email
                        </Text>

                    </View>

                    <ProgressBar
                        progress={progress}
                        color="#007aff"
                        style={[styles.progressBar]}
                    />

                    {renderView()}

                    <TouchableOpacity
                        onPress={() => {
                            if (currentView == 'EmailView') {
                                validateEmail();
                            } else if (currentView == 'VerifyCodeView') {
                                validateVerificationCode();
                            }
                        }}
                        style={[styles.buttonContainer, { marginTop: 20, backgroundColor: Colors.primaryBrand }]}>
                        <Text style={[styles.buttonText, styles.text]}>{getButtonText()}</Text>
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
        marginBottom: 15
    },
    subHeaderTitle: {
        fontSize: 16,
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
        color: 'black', fontSize: 18, flex: 1, backgroundColor: 'transparent'
    },
    buttonContainer: {
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 30,
    },
    buttonText: {
        color: 'white', fontSize: 20, textAlign: 'center'
    },
    progressBar: {
        marginHorizontal: 30,
        marginBottom: 30,
        height: 8,
        borderRadius: 5
    },
    textValidation: {
        color: 'red', marginStart: 30
    }




});