import { Image, Keyboard, LayoutAnimation, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { images } from "../../../utils/Images";
import { useContext, useState } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Card, ProgressBar } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { AuthContext } from "../../../context/AuthContext";
import ToastManager, { Toast } from "toastify-react-native";

interface RegisterScreenProps {
    navigation: any;
    route: any;
}

export const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
    const { register } = useContext(AuthContext);

    const [currentView, setCurrentView] = useState('EmailView');
    const [progress, setProgress] = useState(0.3);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isFirstNameValid, setIsFirstNameValid] = useState(true);
    const [isLastNameValid, setIsLastNameValid] = useState(true);
    const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
    const [isGenderValid, setIsGenderValid] = useState(true);
    const [isDateOfBirthValid, setIsDateOfBirthValid] = useState(true);

    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);


    const DropdownComponent = () => {
        const genders = [
            { label: 'Male', value: '1' },
            { label: 'Female', value: '2' },
            { label: 'Rather not say', value: '3' }
        ];

        const renderItem = (item: any) => {
            return (
                <View style={styles.item}>
                    <Text style={styles.textItem}>{item.label}</Text>
                    {item.value === gender && (
                        <MaterialCommunityIcons
                            style={styles.icon}
                            color="black"
                            name="gender-male-female"
                            size={20}
                        />
                    )}
                </View>
            );
        };

        return (
            <>
                <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.textStyle}
                    selectedTextStyle={styles.textStyle}
                    iconStyle={styles.iconStyle}
                    data={genders}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Gender"
                    value={gender}
                    onChange={item => {
                        setGender(item.value);
                    }}
                    renderLeftIcon={() => (
                        <MaterialCommunityIcons style={styles.icon} color="black" name="gender-male-female" size={20} />
                    )}
                    renderItem={renderItem}
                />
                {!isGenderValid && (
                    <Text style={[styles.textValidation, { marginTop: 5 }]}>Please choose a valid gender</Text>
                )}
            </>


        );
    }
    const DatePickerComponent = () => {
        const [show, setShow] = useState(false);

        const onChange = (e: DateTimePickerEvent, selectedDate?: Date) => {
            if (selectedDate) {
                setDateOfBirth(selectedDate);
                setShow(false);
            }
        };

        return (
            <View>
                {show && (
                    <DateTimePicker
                        value={dateOfBirth}
                        mode={"date"}
                        is24Hour={true}
                        onChange={onChange}
                    />
                )}
                <TouchableWithoutFeedback onPress={() => { setShow(true) }}>
                    <Card style={styles.datePickerCard}>
                        <Card.Content style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={[styles.text, styles.textStyle]}>{dateOfBirth.toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}</Text>
                            <MaterialCommunityIcons name="calendar" size={26} />
                        </Card.Content>
                    </Card>
                </TouchableWithoutFeedback>
                {!isDateOfBirthValid && (
                    <Text style={[styles.textValidation, { marginTop: 5 }]}>Please enter a valid birthdate (13 y.o. up)</Text>
                )}
            </View>
        );
    }

    const validateEmail = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);

        //change this and add in verifying if the email is already existing
        setIsValidEmail(isValid);

        if (isValid) {
            handleNext();
        }
    };
    const validateDetails = async () => {
        const trimmedFirstName = firstName.trim();
        setIsFirstNameValid(!!trimmedFirstName);

        const trimmedLastName = lastName.trim();
        setIsLastNameValid(!!trimmedLastName);

        const trimmedPhoneNumber = phoneNumber.trim();
        setIsPhoneNumberValid(!!trimmedPhoneNumber);

        const trimmedGender = gender.trim();
        setIsGenderValid(!!trimmedGender);

        const currentDate = new Date();
        const userBirthDate = new Date(dateOfBirth);
        const age = currentDate.getFullYear() - userBirthDate.getFullYear();

        setIsDateOfBirthValid(age >= 13);

        if (!!trimmedFirstName && !!trimmedLastName && !!trimmedPhoneNumber && !!trimmedGender && age >= 13) {
            handleNext();
        }

    }
    const validatePassword = async () => {
        const trimmedPassword = password.trim();
        setIsPasswordValid(!!trimmedPassword && trimmedPassword.length >= 8);

        const trimmedConfirmPassword = confirmPassword.trim();
        setIsConfirmPasswordValid(!!trimmedConfirmPassword && trimmedConfirmPassword === trimmedPassword);

        if (!!trimmedPassword && !!trimmedConfirmPassword && trimmedPassword === trimmedConfirmPassword) {
            handleNext();
        }

    }

    const handleNext = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        if (currentView === 'EmailView') {
            setCurrentView('OtherDetailsView');
            setProgress(0.5);
        } else if (currentView === 'OtherDetailsView') {
            setCurrentView('PasswordView');
            setProgress(0.9);
        } else {
            const result = register ? register(firstName, lastName, email, password, dateOfBirth, gender, phoneNumber) : undefined;
            if (result) {
                Toast.success('Sign up success!', 'top');
                setTimeout(() => {
                    navigation.navigate({
                        name: 'Login',
                        params: { success: true },
                        merge: true,
                    });
                }, 2500);
            } else {
                Toast.warn('Sign up error, please try again', 'top');
            }
        }
    };
    const getButtonText = () => {
        switch (currentView) {
            case 'EmailView':
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
                    <>
                        <View style={[styles.credentialContainer, { marginBottom: isValidEmail ? 10 : 0 }]}>
                            <MaterialIcons name="alternate-email" size={20} color="#666" style={{ marginHorizontal: 5 }} />
                            <TextInput
                                placeholder="Email Address"
                                style={[styles.text, styles.credentialText]}
                                value={email}
                                onChangeText={setEmail}
                                placeholderTextColor={'#666'}
                            />

                        </View>
                        {!isValidEmail && (
                            <Text style={styles.textValidation}>Please enter a valid email address.</Text>
                        )}
                    </>
                );
            case 'OtherDetailsView':
                return (
                    <>
                        <ScrollView>
                            <View style={[styles.credentialContainer, { marginBottom: isFirstNameValid ? 10 : 0 }]}>
                                <MaterialCommunityIcons name="account-box-outline" size={30} color="#666" style={{ marginHorizontal: 5 }} />
                                <TextInput placeholder="First Name" style={[styles.text, styles.credentialText]} placeholderTextColor={'#666'} value={firstName} onChangeText={setFirstName} />
                            </View>
                            {!isFirstNameValid && (
                                <Text style={styles.textValidation}>Please enter a valid first name</Text>
                            )}
                            <View style={[styles.credentialContainer, { marginBottom: isLastNameValid ? 10 : 0 }]}>
                                <MaterialCommunityIcons name="account-box-outline" size={30} color="#666" style={{ marginHorizontal: 5 }} />
                                <TextInput placeholder="Last Name" style={[styles.text, styles.credentialText]} placeholderTextColor={'#666'} value={lastName} onChangeText={setLastName} />
                            </View>
                            {!isLastNameValid && (
                                <Text style={styles.textValidation}>Please enter a valid last name</Text>
                            )}
                            <View style={[styles.credentialContainer, {}]}>
                                <MaterialCommunityIcons name="phone-outline" size={30} color="#666" style={{ marginHorizontal: 5 }} />
                                <TextInput placeholder="Phone Number" style={[styles.text, styles.credentialText]} placeholderTextColor={'#666'} keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} />
                            </View>
                            {!isPhoneNumberValid && (
                                <Text style={styles.textValidation}>Please enter a valid phone number</Text>
                            )}

                            <DropdownComponent />
                            <DatePickerComponent />
                        </ScrollView>
                    </>
                );
            case 'PasswordView':
                return (
                    <>
                        <View style={[styles.credentialContainer, { marginBottom: isPasswordValid ? 10 : 0 }]}>
                            <MaterialIcons name="lock-outline" size={20} color="#666" style={{ marginHorizontal: 5 }} />
                            <TextInput placeholder="Password" secureTextEntry style={[styles.text, styles.credentialText]} placeholderTextColor={'#666'} value={password} onChangeText={setPassword} />
                        </View>
                        {!isPasswordValid && (
                            <Text style={styles.textValidation}>Please enter a valid password (min 8 chars)</Text>
                        )}
                        <View style={[styles.credentialContainer, {}]}>
                            <MaterialIcons name="lock-outline" size={20} color="#666" style={{ marginHorizontal: 5 }} />
                            <TextInput placeholder="Confirm Password" secureTextEntry style={[styles.text, styles.credentialText]} placeholderTextColor={'#666'} value={confirmPassword} onChangeText={setConfirmPassword} />
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
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
            <TouchableWithoutFeedback
                onPress={() => Keyboard.dismiss()}>
                <View>
                    <ToastManager />

                    <View style={{ alignItems: 'center' }}>
                        {/* TODO: STILL NEEDS A LOADER AND MODAL {isSuccess && <ActivityIndicator animating={true} size="large" color="#0000ff" />} */}
                        <Image
                            source={images.logo_wide_dark}
                            style={{ width: 130, height: 35, marginBottom: 15 }}
                        />
                        <Image
                            source={images.register}
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
                            } else if (currentView == 'OtherDetailsView') {
                                validateDetails();
                            }
                            else {
                                validatePassword();
                            }
                        }}
                        style={[styles.buttonContainer, { marginTop: 20, backgroundColor: '#3373B0' }]}>
                        <Text style={[styles.buttonText, styles.text]}>{getButtonText()}</Text>
                    </TouchableOpacity>



                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}
                        style={[styles.buttonContainer, { marginTop: 10, backgroundColor: '#eab676', display: "none" }]}>
                        <Text style={[styles.buttonText, styles.text]}>Sign in to your account</Text>
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
        borderBottomWidth: 1,
        marginHorizontal: 30,
        alignItems: "center"
    },
    credentialText: {
        color: 'black', fontSize: 18, flex: 1,
    },
    buttonContainer: {
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 30,
    },
    buttonText: {
        color: 'white', fontSize: 20, textAlign: 'center'
    },
    dropdown: {
        marginHorizontal: 30,
        marginTop: 10,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: 16,
    },
    textStyle: {
        color: '#666',
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    datePickerCard: {
        backgroundColor: "white",
        borderRadius: 10,
        marginHorizontal: 30,
        marginTop: 10
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



