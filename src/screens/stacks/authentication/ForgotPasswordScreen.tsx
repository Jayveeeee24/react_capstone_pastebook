import { Image, Keyboard, LayoutAnimation, SafeAreaView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Images } from "../../../utils/Images";
import { ActivityIndicator, ProgressBar } from "react-native-paper";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "react-native-toast-notifications";
import { Colors } from "../../../utils/GlobalStyles";
import { EmailComponent } from "../../../components/customComponents/TextInputs/EmailComponent";
import { VerificationComponent } from "../../../components/customComponents/TextInputs/VerificationComponent";
import { PasswordComponent } from "../../../components/customComponents/TextInputs/PasswordComponent";

interface ForgotPasswordScreenProps {
    navigation: any;
    route: any;
}


export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
    const toast = useToast();

    const { verifyEmailForgot, verifyCode, changePassword } = useAuth();

    const [progress, setProgress] = useState(0.4);
    const [currentView, setCurrentView] = useState('EmailView');
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');

    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isVerificationCodeValid, setIsVerificationCodeValid] = useState(true);

    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);

    const validateEmail = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);

        setIsValidEmail(isValid);

        if (isValid) {
            handleNext();
        }
    };
    const validatePassword = async () => {
        const trimmedPassword = password.trim();
        setIsPasswordValid(!!trimmedPassword && trimmedPassword.length >= 8);

        const trimmedConfirmPassword = confirmPassword.trim();
        setIsConfirmPasswordValid(!!trimmedConfirmPassword && trimmedConfirmPassword === trimmedPassword);

        if (!!trimmedPassword && !!trimmedConfirmPassword && trimmedPassword === trimmedConfirmPassword && trimmedPassword.length >= 8) {
            handleNext();
        }

    }
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
                setIsLoading(true);
                const result = verifyEmailForgot ? await verifyEmailForgot(email) : undefined;
                if (result == "Email sent successfully!") {
                    setCurrentView('VerifyCodeView');
                    setProgress(0.6);
                } else {
                    toast.show(result, { type: 'warning' });
                }
            } catch (error) {
                toast.show("An unexpected error occurred", { type: 'danger' });
            }
            setIsLoading(false);
        } else if (currentView === 'VerifyCodeView') {
            try {
                setIsLoading(true);
                const result = verifyCode ? await verifyCode(email, verificationCode) : undefined;
                if (result === true) {
                    setCurrentView('PasswordView');
                    setProgress(0.8);
                } else if (result.result) {
                    toast.show(result.result, { type: 'warning' });
                }
                else {
                    setIsVerificationCodeValid(false);
                }
            } catch (error) {
                console.error('Error:', error);
                toast.show("An unexpected error occurred", { type: 'danger' });
            }
            setIsLoading(false);
        }
        else {
            try {
                setIsLoading(true);
                const result = changePassword ? await changePassword(email, password) : undefined;

                if (result == "password_changed_successfully") {
                    toast.show("Password Changed successfully", { type: 'success' });
                    setTimeout(() => {
                        navigation.navigate('Login');
                    }, 1000);
                } else {
                    toast.show(result, { type: 'warning' });
                }
            } catch (error) {
                toast.show("An unexpected error occurred", { type: 'danger' });
            }
            setIsLoading(false);
        }
    };
    const getButtonText = () => {
        switch (currentView) {
            case 'EmailView':
                return 'Send Email Verification';
            case 'VerifyCodeView':
                return 'Verify Email';
            case 'PasswordView':
                return 'Change Password';
            default:
                return '';
        }
    };
    const renderView = () => {
        switch (currentView) {
            case 'EmailView':
                return (
                    <>
                        <EmailComponent
                            email={email}
                            setEmail={setEmail}
                            isEmailAvailable
                            isValidEmail={isValidEmail} />
                    </>
                );
            case 'VerifyCodeView':
                return (
                    <>
                        <VerificationComponent
                            verificationCode={verificationCode}
                            setVerificationCode={setVerificationCode}
                            isVerificationCodeValid={isVerificationCodeValid} />
                    </>
                );
            case 'PasswordView':
                return (
                    <>
                        <PasswordComponent
                            password={password}
                            setPassword={setPassword}
                            isPasswordValid={isPasswordValid}
                            placeholderText="Password"
                            warningText="Please enter a valid password (min 8 chars)" />
                        <PasswordComponent
                            password={confirmPassword}
                            setPassword={setConfirmPassword}
                            isPasswordValid={isConfirmPasswordValid}
                            placeholderText="Confirm Password"
                            warningText="Passwords do not match" />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center' }}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View>

                    <View style={{ alignItems: 'center' }}>
                        <Image
                            source={Images.logo_wide_dark}
                            style={{ width: 130, height: 35, marginBottom: 15 }}
                        />
                        <Image
                            source={Images.privacy}
                            style={{ width: 320, height: 210 }}
                        />
                        <Text
                            style={[styles.subHeaderTitle, styles.text]}>
                            Socialize. Connect. Paste It!
                        </Text>
                        <Text
                            style={[styles.text, styles.headerTitle]}>
                            Recover your Account
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
                            else {
                                validatePassword();
                            }
                        }}
                        style={[styles.buttonContainer, { marginTop: 20, backgroundColor: Colors.secondaryBrand }]}>
                        {isLoading ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                        <Text style={[styles.buttonText, styles.text]}>{getButtonText()}</Text>
                        )}
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