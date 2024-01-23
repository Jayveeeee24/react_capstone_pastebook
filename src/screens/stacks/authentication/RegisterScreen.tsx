import { ActivityIndicator, Button, Image, Keyboard, LayoutAnimation, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Images } from "../../../utils/Images";
import { useContext, useState } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Card, ProgressBar, TextInput } from "react-native-paper";
import { AuthContext, useAuth } from "../../../context/AuthContext";
import { GenderDropdown } from "../../../components/customComponents/GenderDropdown";
import { DatePickerComponent } from "../../../components/customComponents/DatePickerComponent";
import { Colors, credentialTextTheme } from "../../../utils/Config";
import { useToast } from "react-native-toast-notifications";

interface RegisterScreenProps {
    navigation: any;
    route: any;
}

export const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
    const toast = useToast();
    const { register, emailAvailability, verifyEmailNewUser, verifyCode } = useAuth();

    const [currentView, setCurrentView] = useState('EmailView');
    const [progress, setProgress] = useState(0.3);
    const [isLoading, setIsLoading] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const genders = [
        { label: 'Male', value: '1' },
        { label: 'Female', value: '2' },
        { label: 'Rather not say', value: '3' }
    ];
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');

    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isEmailAvailable, setIsEmailAvailable] = useState(true);
    const [isVerificationCodeValid, setIsVerificationCodeValid] = useState(true);
    const [isFirstNameValid, setIsFirstNameValid] = useState(true);
    const [isLastNameValid, setIsLastNameValid] = useState(true);
    const [isGenderValid, setIsGenderValid] = useState(true);
    const [isDateOfBirthValid, setIsDateOfBirthValid] = useState(true);

    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);


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
    const validateDetails = async () => {
        const trimmedFirstName = firstName.trim();
        setIsFirstNameValid(!!trimmedFirstName);

        const trimmedLastName = lastName.trim();
        setIsLastNameValid(!!trimmedLastName);

        const trimmedGender = gender.trim();
        setIsGenderValid(!!trimmedGender);

        const currentDate = new Date();
        const userBirthDate = new Date(dateOfBirth);
        const age = currentDate.getFullYear() - userBirthDate.getFullYear();

        setIsDateOfBirthValid(age >= 13);

        if (!!trimmedFirstName && !!trimmedLastName && !!trimmedGender && age >= 13) {
            handleNext();
        }

    }
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
                const result = verifyEmailNewUser ? await verifyEmailNewUser(email) : undefined;
                if (result == "Email sent successfully!") {
                    setCurrentView('VerifyCodeView');
                    setProgress(0.5);
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
                const result = verifyCode ? await verifyCode(email, verificationCode) : undefined;
                if (result === true) {
                    setCurrentView('OtherDetailsView');
                    setProgress(0.7);
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
        }
        else if (currentView === 'OtherDetailsView') {
            setCurrentView('PasswordView');
            setProgress(0.9);
        } else {
            try {
                setIsLoading(true);
                const result = register ? await register(firstName, lastName, email, password, dateOfBirth, gender, phoneNumber) : undefined;

                if (result == "User Registered Successfully") {
                    toast.show(result, { type: 'success' });
                    setIsLoading(false);
                    setTimeout(() => {
                        navigation.navigate('Login');
                    }, 1000);
                } else {
                    toast.show(result, { type: 'warning' });
                }
            } catch (error: any) {
                toast.show("An unexpected error occurred", { type: 'danger' });
            }

        }
    };
    const getButtonText = () => {
        switch (currentView) {
            case 'EmailView':
                return 'Send Email Verification';
            case 'VerifyCodeView':
                return 'Verify Email';
            case 'OtherDetailsView':
                return 'Next';
            case 'PasswordView':
                return 'Sign Up';
            default:
                return '';
        }
    };
    const renderView = () => {
        const [showPassword, setShowPassword] = useState(false);
        const [showConfirmPassword, setShowConfirmPassword] = useState(false);

        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword);
        };
        const toggleConfirmPasswordVisibility = () => {
            setShowConfirmPassword(!showConfirmPassword);
        };

        switch (currentView) {
            case 'EmailView':
                return (
                    <>
                        <View style={[styles.credentialContainer, { marginBottom: isValidEmail ? 10 : 0 }]}>
                            <MaterialIcons name="alternate-email" size={20} color="#666" style={{ marginHorizontal: 5 }} />
                            <TextInput
                                placeholder="Email Address"
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
            case 'OtherDetailsView':
                return (
                    <>
                        <ScrollView>
                            <View style={[styles.credentialContainer, { marginBottom: isFirstNameValid ? 10 : 0 }]}>
                                <MaterialCommunityIcons name="account-box-outline" size={30} color="#666" style={{ marginHorizontal: 5 }} />
                                <TextInput placeholder="First Name" theme={credentialTextTheme} style={[styles.text, styles.credentialText]} placeholderTextColor={'#666'} value={firstName} onChangeText={setFirstName} />
                            </View>
                            {!isFirstNameValid && (
                                <Text style={styles.textValidation}>Please enter a valid first name</Text>
                            )}
                            <View style={[styles.credentialContainer, { marginBottom: isLastNameValid ? 10 : 0 }]}>
                                <MaterialCommunityIcons name="account-box-outline" size={30} color="#666" style={{ marginHorizontal: 5 }} />
                                <TextInput placeholder="Last Name" theme={credentialTextTheme} style={[styles.text, styles.credentialText]} placeholderTextColor={'#666'} value={lastName} onChangeText={setLastName} />
                            </View>
                            {!isLastNameValid && (
                                <Text style={styles.textValidation}>Please enter a valid last name</Text>
                            )}
                            <View style={[styles.credentialContainer, {}]}>
                                <MaterialCommunityIcons name="phone-outline" size={30} color="#666" style={{ marginHorizontal: 5 }} />
                                <TextInput placeholder="Phone Number" theme={credentialTextTheme}
                                    style={[styles.text, styles.credentialText]} placeholderTextColor={'#666'} keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} />
                            </View>

                            <View style={{ marginHorizontal: 30 }}>
                                <GenderDropdown data={genders} value={genders.find(item => item.label === gender)?.value || ''} onValueChange={(value) => setGender(genders.find(item => item.value === value)?.label || '')} isGenderValid={isGenderValid} placeholder={"Gender"} />
                            </View>

                            <View style={{ marginHorizontal: 30 }}>
                                <DatePickerComponent
                                    dateOfBirth={dateOfBirth}
                                    setDateOfBirth={setDateOfBirth}
                                    isDateOfBirthValid={isDateOfBirthValid} />
                            </View>
                        </ScrollView>
                    </>
                );
            case 'PasswordView':
                return (
                    <>
                        <View style={[styles.credentialContainer, { marginBottom: isPasswordValid ? 10 : 0 }]}>
                            <MaterialIcons name="lock-outline" size={20} color="#666" style={{ marginHorizontal: 5 }} />
                            <TextInput placeholder="Password" theme={credentialTextTheme} right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={togglePasswordVisibility} />} secureTextEntry={!showPassword} style={[styles.text, styles.credentialText]} placeholderTextColor={'#666'} value={password} onChangeText={setPassword} />
                        </View>
                        {!isPasswordValid && (
                            <Text style={styles.textValidation}>Please enter a valid password (min 8 chars)</Text>
                        )}
                        <View style={[styles.credentialContainer, {}]}>
                            <MaterialIcons name="lock-outline" size={20} color="#666" style={{ marginHorizontal: 5 }} />
                            <TextInput placeholder="Confirm Password" theme={credentialTextTheme} right={<TextInput.Icon icon={showConfirmPassword ? 'eye-off' : 'eye'} onPress={toggleConfirmPasswordVisibility} />} secureTextEntry={!showConfirmPassword} style={[styles.text, styles.credentialText]} placeholderTextColor={'#666'} value={confirmPassword} onChangeText={setConfirmPassword} />
                        </View>
                        {!isConfirmPasswordValid && (
                            <Text style={styles.textValidation}>Passwords do not match</Text>
                        )}
                    </>
                );
            default:
                return null;
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
            <TouchableWithoutFeedback
                onPress={() => Keyboard.dismiss()}>
                <View>

                    <View style={{ alignItems: 'center' }}>
                        <Image
                            source={Images.logo_wide_dark}
                            style={{ width: 130, height: 35, marginBottom: 15 }}
                        />
                        <Image
                            source={Images.register}
                            style={{ width: 320, height: 210 }}
                        />
                        <Text
                            style={[styles.subHeaderTitle, styles.text]}>
                            Socialize. Connect. Paste It!
                        </Text>
                        <Text
                            style={[styles.text, styles.headerTitle]}>
                            Register an Account
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
                            else if (currentView == 'OtherDetailsView') {
                                validateDetails();
                            }
                            else {
                                validatePassword();
                            }
                        }}
                        style={[styles.buttonContainer, { marginTop: 20, backgroundColor: Colors.primaryBrand }]}>
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



