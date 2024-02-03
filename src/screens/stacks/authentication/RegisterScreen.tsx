import { Image, Keyboard, LayoutAnimation, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Images } from "../../../utils/Images";
import { useState } from "react";
import { ActivityIndicator, ProgressBar } from "react-native-paper";
import { useAuth } from "../../../context/AuthContext";
import { GenderDropdown } from "../../../components/customComponents/GenderDropdown";
import { DatePickerComponent } from "../../../components/customComponents/DatePickerComponent";
import { useToast } from "react-native-toast-notifications";
import { EmailComponent } from "../../../components/customComponents/TextInputs/EmailComponent";
import { Colors, globalStyles } from "../../../utils/GlobalStyles";
import { PasswordComponent } from "../../../components/customComponents/TextInputs/PasswordComponent";
import { NameComponent } from "../../../components/customComponents/TextInputs/NameComponent";
import { PhoneComponent } from "../../../components/customComponents/TextInputs/PhoneComponent";
import { VerificationComponent } from "../../../components/customComponents/TextInputs/VerificationComponent";

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
                setIsLoading(true);
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
            setIsLoading(false);
        } else if (currentView === 'VerifyCodeView') {
            try {
                setIsLoading(true);
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
            setIsLoading(false);
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
                    navigation.navigate('Login');
                } else {
                    toast.show(result, { type: 'warning' });
                }
            } catch (error: any) {
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
            case 'OtherDetailsView':
                return 'Next';
            case 'PasswordView':
                return 'Sign Up';
            default:
                return '';
        }
    };
    const renderView = () => {
        switch (currentView) {
            case 'EmailView':
                return (
                    <EmailComponent
                        email={email}
                        setEmail={setEmail}
                        isValidEmail={isValidEmail}
                        isEmailAvailable={isEmailAvailable} />
                );
            case 'VerifyCodeView':
                return (
                    <>
                        <VerificationComponent
                            verificationCode={verificationCode}
                            setVerificationCode={setVerificationCode}
                            isVerificationCodeValid={isVerificationCodeValid} />
                    </>
                )
            case 'OtherDetailsView':
                return (
                    <>
                        <ScrollView>
                            <NameComponent
                                name={firstName}
                                setName={setFirstName}
                                isNameValid={isFirstNameValid}
                                placeholderText="First Name"
                                warningText="Please enter a valid first name" />
                            <NameComponent
                                name={lastName}
                                setName={setLastName}
                                isNameValid={isLastNameValid}
                                placeholderText="Last Name"
                                warningText="Please enter a valid last name" />
                            <PhoneComponent
                                phoneNumber={phoneNumber}
                                setPhoneNumber={setPhoneNumber} />
                            <GenderDropdown
                                data={genders}
                                value={genders.find(item => item.label === gender)?.value || ''}
                                onValueChange={(value) => setGender(genders.find(item => item.value === value)?.label || '')}
                                isGenderValid={isGenderValid} />
                            <DatePickerComponent
                                dateOfBirth={dateOfBirth}
                                setDateOfBirth={setDateOfBirth}
                                isDateOfBirthValid={isDateOfBirthValid} />
                        </ScrollView>
                    </>
                );
            case 'PasswordView':
                return (
                    <>
                        <PasswordComponent
                            password={password}
                            setPassword={setPassword}
                            isPasswordValid={isPasswordValid}
                            warningText="Please enter a valid password (min 8 chars)"
                            placeholderText="Password" />
                        <PasswordComponent
                            password={confirmPassword}
                            setPassword={setConfirmPassword}
                            isPasswordValid={isConfirmPasswordValid}
                            warningText="Passwords do not match"
                            placeholderText="Confirm Password" />
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
                            style={[styles.subHeaderTitle, globalStyles.textDefaults]}>
                            Socialize. Connect. Paste It!
                        </Text>
                        <Text
                            style={[globalStyles.textDefaults, styles.headerTitle]}>
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
                            if (!isLoading) {
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
                            }
                        }}
                        style={[styles.buttonContainer, { marginTop: 10, backgroundColor: Colors.primaryBrand }]}>
                        {isLoading ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text style={[styles.buttonText, { fontFamily: 'Roboto-Medium' }]}>{getButtonText()}</Text>
                        )}
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
        marginBottom: 15
    },
    subHeaderTitle: {
        fontSize: 16,
        marginTop: 20,
        color: '#333',
        fontWeight: '700',
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
});



