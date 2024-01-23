import React, { useContext, useState } from "react"
import { Image, Keyboard, LayoutAnimation, SafeAreaView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { Images } from "../../../utils/Images"
import { ProgressBar, TextInput } from "react-native-paper"
import { useToast } from "react-native-toast-notifications"
import { Colors, credentialTextTheme } from "../../../utils/Config"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { UserContext, useUser } from "../../../context/UserContext"

interface EditPasswordScreenProps {
    navigation: any;
    route: any;
}

export const EditPasswordScreen: React.FC<EditPasswordScreenProps> = ({ navigation }) => {
    const toast = useToast();
    const { checkCurrentPassword, changePassword } = useUser();

    const [currentView, setCurrentView] = useState('CurrentPasswordView');
    const [progress, setProgress] = useState(0.45);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(true);
    const [isNewPasswordValid, setIsNewPasswordValid] = useState(true);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);


    const validateCurrentPassword = async () => {
        const trimmedPassword = currentPassword.trim();
        setIsCurrentPasswordValid(!!trimmedPassword);

        if (!!trimmedPassword) {
            handleNext();
        }
    }
    const validateNewPassword = async () => {
        const trimmedPassword = newPassword.trim();
        setIsNewPasswordValid(!!trimmedPassword && trimmedPassword.length >= 8);

        const trimmedConfirmPassword = confirmNewPassword.trim();
        setIsConfirmPasswordValid(!!trimmedConfirmPassword && trimmedConfirmPassword === trimmedPassword);

        if (!!trimmedPassword && !!trimmedConfirmPassword && trimmedPassword === trimmedConfirmPassword && trimmedPassword.length >= 8) {
            handleNext();
        }
    }


    const handleNext = async () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        if (currentView === 'CurrentPasswordView') {
            try {
                const result = checkCurrentPassword ? await checkCurrentPassword(currentPassword) : undefined;
                console.log(result)
                if (result === true) {
                    setCurrentView('NewPasswordView');
                    setProgress(0.5);
                } else {
                    toast.show(result, { type: "warning", });
                }
            } catch (error) {
                console.error('Error:', error);
                toast.show("An unexpected error occurred", { type: 'danger' });
            }
        } else if (currentView === 'NewPasswordView') {
            try {
                const result = changePassword ? await changePassword(newPassword) : undefined;
                
                if (result.id) {
                    toast.show('Password changed successfully', { type: 'success' });
                    navigation.pop();
                } 
                else{
                    toast.show(result, { type: 'warning' });
                }
            } catch (error) {
                console.error('Error:', error);
                toast.show("An unexpected error occurred", { type: 'danger' });
            }
        }
    };

    const getButtonText = () => {
        switch (currentView) {
            case 'CurrentPasswordView':
                return 'Confirm Password';
            case 'NewPasswordView':
                return 'Confirm New Password';
            default:
                return '';
        }
    };
    const renderView = () => {

        const [showCurrentPassword, setShowCurrentPassword] = useState(false);

        const [showNewPassword, setShowNewPassword] = useState(false);
        const [showConfirmPassword, setShowConfirmPassword] = useState(false);

        const toggleCurrentPasswordVisibility = () => {
            setShowCurrentPassword(!showCurrentPassword);
        };

        const toggleNewPasswordVisibility = () => {
            setShowNewPassword(!showNewPassword);
        };
        const toggleConfirmPasswordVisibility = () => {
            setShowConfirmPassword(!showConfirmPassword);
        };
        switch (currentView) {
            case 'CurrentPasswordView':
                return (
                    <>
                        <View style={[styles.credentialContainer, { marginBottom: isCurrentPasswordValid ? 10 : 0 }]}>
                            <MaterialIcons name="lock-outline" size={20} color="#666" style={{ marginHorizontal: 5 }} />
                            <TextInput placeholder="Current Password" theme={credentialTextTheme} right={<TextInput.Icon icon={showCurrentPassword ? 'eye-off' : 'eye'} onPress={toggleCurrentPasswordVisibility} />} secureTextEntry={!showCurrentPassword} style={[styles.text, styles.credentialText]} placeholderTextColor={'#666'} value={currentPassword} onChangeText={setCurrentPassword} />
                        </View>
                        {!isCurrentPasswordValid && (
                            <Text style={styles.textValidation}>Password invalid, try again</Text>
                        )}
                    </>
                );
            case 'NewPasswordView':
                return (
                    <>
                        <View style={[styles.credentialContainer, { marginBottom: isNewPasswordValid ? 10 : 0 }]}>
                            <MaterialIcons name="lock-outline" size={20} color="#666" style={{ marginHorizontal: 5 }} />
                            <TextInput placeholder="Password" theme={credentialTextTheme} right={<TextInput.Icon icon={showNewPassword ? 'eye-off' : 'eye'} onPress={toggleNewPasswordVisibility} />} secureTextEntry={!showNewPassword} style={[styles.text, styles.credentialText]} placeholderTextColor={'#666'} value={newPassword} onChangeText={setNewPassword} />
                        </View>
                        {!isNewPasswordValid && (
                            <Text style={styles.textValidation}>Please enter a valid password (min 8 chars)</Text>
                        )}
                        <View style={[styles.credentialContainer, {}]}>
                            <MaterialIcons name="lock-outline" size={20} color="#666" style={{ marginHorizontal: 5 }} />
                            <TextInput placeholder="Confirm Password" theme={credentialTextTheme} right={<TextInput.Icon icon={showConfirmPassword ? 'eye-off' : 'eye'} onPress={toggleConfirmPasswordVisibility} />} secureTextEntry={!showConfirmPassword} style={[styles.text, styles.credentialText]} placeholderTextColor={'#666'} value={confirmNewPassword} onChangeText={setConfirmNewPassword} />
                        </View>
                        {!isConfirmPasswordValid && (
                            <Text style={styles.textValidation}>Passwords do not match</Text>
                        )}
                    </>
                )
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1, justifyContent: 'center' }}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View>
                    <View style={{ alignItems: 'center' }}>
                        <Image
                            source={Images.logo_wide_dark}
                            style={{ width: 130, height: 35 }} />
                        <Image
                            source={Images.lock}
                            style={{ width: 350, height: 230 }} />
                        <Text
                            style={[styles.subHeaderTitle, styles.text]}>
                            Socialize. Connect. Paste It!
                        </Text>
                        <Text
                            style={[styles.headerTitle, styles.text]}>
                            Change Account Password
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
                            if (currentView == 'CurrentPasswordView') {
                                validateCurrentPassword();
                            } else if (currentView == 'NewPasswordView') {
                                validateNewPassword();
                            }
                        }}
                        style={[styles.buttonContainer, { marginTop: 20, backgroundColor: Colors.primaryBrand }]}>
                        <Text style={[styles.buttonText, styles.text]}>{getButtonText()}</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
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