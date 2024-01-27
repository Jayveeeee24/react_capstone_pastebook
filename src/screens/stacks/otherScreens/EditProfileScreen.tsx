import { useEffect, useState } from "react";
import { Image, Keyboard, SafeAreaView, ScrollView, Text, TouchableOpacity, TextInput as TextArea, TouchableWithoutFeedback, View, StyleSheet, ActivityIndicator } from "react-native";
import { Images } from "../../../utils/Images";
import { Colors, Storage, credentialTextTheme } from "../../../utils/Config";
import { GenderDropdown } from "../../../components/customComponents/GenderDropdown";
import { DatePickerComponent } from "../../../components/customComponents/DatePickerComponent";
import { TextInput } from "react-native-paper";
import { useToast } from "react-native-toast-notifications";
import { useUser } from "../../../context/UserContext";
import { usePhoto } from "../../../context/PhotoContext";
import { MediaType, launchImageLibrary } from "react-native-image-picker";
import { useAlbum } from "../../../context/AlbumContext";

interface EditProfileScreenProps {
    navigation: any;
    route: any;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation, route }) => {
    const toast = useToast();
    const { editProfile, getProfile, changeProfilePic } = useUser();
    const { getPhotoById, addPhoto } = usePhoto();
    const { getUploadsAlbumId } = useAlbum();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [bio, setBio] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [gender, setGender] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [profilePicture, setProfilePicture] = useState<any>();
    const [albumId, setAlbumId] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const genders = [
        { label: 'Male', value: '1' },
        { label: 'Female', value: '2' },
        { label: 'Rather not say', value: '3' }
    ];

    const [isFirstNameValid, setIsFirstNameValid] = useState(true);
    const [isLastNameValid, setIsLastNameValid] = useState(true);
    const [isGenderValid, setIsGenderValid] = useState(true);
    const [isDateOfBirthValid, setIsDateOfBirthValid] = useState(true);


    useEffect(() => {
        loadProfile();

    }, []);
    const loadProfile = async () => {
        const userId = Storage.getString('userId');
        const albumIdResult = getUploadsAlbumId ? await getUploadsAlbumId() : undefined;
        if (albumIdResult) {
            setAlbumId(albumIdResult);
        }

        if (userId) {
            const result = getProfile ? await getProfile(userId) : undefined;

            if (result.id) {
                setFirstName(result.firstName);
                setLastName(result.lastName);
                setBio(result.aboutMe);
                setPhoneNumber(result.phoneNumber);

                setGender(result.sex);
                setDateOfBirth(new Date(result.birthDate));

                const pictureResult = getPhotoById ? await getPhotoById(result.photo.id) : undefined;

                if (pictureResult) {
                    setProfilePicture(pictureResult);
                }
            }
        }
    }

    //api functions
    const ImagePicker = () => {
        const options = {
            mediaType: 'photo' as MediaType,
            storageOptions: {
                path: 'image',
                mediaType: 'photo'
            }
        };

        launchImageLibrary(options, async response => {
            setIsLoading(true);
            if (response?.assets) {
                const file = response.assets[0].uri;
                const name = file?.split('/').pop();

                const formData = new FormData();
                formData.append('albumId', albumId);
                formData.append('file', {
                    uri: file,
                    name: name,
                    type: 'image/jpg'
                });

                try {
                    const result = addPhoto ? await addPhoto(formData) : undefined;
                    if (result) {
                        try {
                            const profilePicResult = changeProfilePic ? await changeProfilePic(result) : undefined;
                            if (profilePicResult.id) {
                                loadProfile();
                            } else {
                                toast.show("An unexpected error occurred", { type: 'danger' });
                            }
                        } catch (error: any) {
                            toast.show("An unexpected error occurred", { type: 'danger' });
                            console.log(error);
                        }
                    } else {
                        toast.show(result, { type: 'warning' });
                    }
                } catch (error: any) {
                    toast.show("An unexpected error occurred", { type: 'danger' });
                    console.log(error);
                }
            }
            setIsLoading(false);
        });
    }
    const onEditProfile = async () => {
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
            try {
                const result = editProfile ? await editProfile(firstName, lastName, dateOfBirth, gender, phoneNumber, bio) : undefined;
                if (result.firstName) {
                    toast.show('Profile changed successfully', {
                        type: "success",
                    });
                    navigation.pop();
                    navigation.navigate('ProfileTab', { refresh: true })
                } else {
                    toast.show(result, {
                        type: "warning",
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                toast.show("An unexpected error occurred", { type: 'danger' });
            }
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={{ flexDirection: "column", backgroundColor: 'white', flex: 1 }}>
                        <View style={{ marginTop: 20, alignItems: "center" }}>
                            {isLoading ? (
                                <ActivityIndicator size="large" color={Colors.primaryBrand} style={{ width: 80, height: 80, }} />
                            ) : (
                                <Image source={profilePicture ? { uri: profilePicture } : Images.sample_avatar_neutral} resizeMode="cover" style={{ aspectRatio: 1, width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: Colors.orange }} />
                            )}
                            <TouchableOpacity onPress={ImagePicker}>
                                <Text style={{ color: Colors.primaryBrand, marginTop: 10, fontWeight: '500' }}>Edit profile picture</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginHorizontal: 15, marginTop: 20 }}>

                            <Text style={{ fontSize: 12, marginTop: 10 }}>First Name</Text>
                            <TextInput placeholder="First Name" theme={credentialTextTheme} style={[styles.text, styles.credentialText]} value={firstName} onChangeText={setFirstName} />
                            {!isFirstNameValid && (
                                <Text style={styles.textValidation}>Please enter a valid first name</Text>
                            )}

                            <Text style={{ fontSize: 12, marginTop: 10 }}>Last Name</Text>
                            <TextInput placeholder="Last Name" theme={credentialTextTheme} style={[styles.text, styles.credentialText]} value={lastName} onChangeText={setLastName} />
                            {!isLastNameValid && (
                                <Text style={styles.textValidation}>Please enter a valid last name</Text>
                            )}

                            <Text style={{ fontSize: 12, marginTop: 10 }}>Phone Number</Text>
                            <TextInput placeholder="Phone Number" theme={credentialTextTheme} style={[styles.text, styles.credentialText]} value={phoneNumber} onChangeText={setPhoneNumber} />

                            <Text style={{ fontSize: 12, marginTop: 10 }}>Bio</Text>
                            <TextArea
                                placeholder="Bio"
                                style={styles.textArea}
                                value={bio}
                                onChangeText={(text) => setBio(text.slice(0, 65))}
                                multiline
                                placeholderTextColor={'#666'} />

                            <Text style={{ fontSize: 12, marginTop: 10 }}>Gender</Text>
                            <GenderDropdown data={genders} value={genders.find(item => item.label === gender)?.value || ''} onValueChange={(value) => setGender(genders.find(item => item.value === value)?.label || '')} isGenderValid={isGenderValid} placeholder={"Gender"} />

                            <Text style={{ fontSize: 12, marginTop: 10 }}>Birthdate </Text>
                            <DatePickerComponent
                                dateOfBirth={dateOfBirth}
                                setDateOfBirth={setDateOfBirth}
                                isDateOfBirthValid={isDateOfBirthValid} />

                            <TouchableOpacity
                                onPress={onEditProfile}
                                style={[{ padding: 15, borderRadius: 10, marginTop: 20, backgroundColor: Colors.secondaryBrand }]}>
                                <Text style={[{ fontFamily: 'Roboto-Medium', color: 'white', fontSize: 20, textAlign: 'center' }]}>Save Profile</Text>
                            </TouchableOpacity>


                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    textValidation: {
        color: 'red'
    },
    credentialText: {
        color: 'black', fontSize: 16, flex: 1, backgroundColor: 'transparent'
    },
    text: {
        fontFamily: 'Roboto-Medium'
    },
    textArea: {
        borderBottomWidth: 0.8,
        paddingStart: 15,
        borderBottomColor: 'darkgray',
        fontFamily: 'Roboto-Medium',
        color: 'black',
        fontSize: 16,
        backgroundColor: 'transparent',
        maxHeight: 80
    },
});