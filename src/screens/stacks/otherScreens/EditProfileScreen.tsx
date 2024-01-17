import { useEffect, useState } from "react";
import { Image, Keyboard, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Images } from "../../../utils/Images";
import { colors } from "../../../utils/Config";
import { CustomDropdown } from "../../../components/CustomDropdown";
import { DatePickerComponent } from "../../../components/DatePickerComponent";

interface EditProfileScreenProps {
    navigation: any;
    route: any;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation, route }) => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [bio, setBio] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [isDateOfBirthValid, setIsDateOfBirthValid] = useState(true);

    const [gender, setGender] = useState('');
    const [isGenderValid, setIsGenderValid] = useState(true);
    const genders = [
        { label: 'Male', value: '1' },
        { label: 'Female', value: '2' },
        { label: 'Rather not say', value: '3' }
    ];

    useEffect(() => {
        navigation.setOptions({
            headerStyle: {
                elevation: 0,
                shadowOpacity: 0,
            },
        });
    }, [navigation]);


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={{ flexDirection: "column", backgroundColor: 'white', flex: 1 }}>
                        <View style={{ marginTop: 20, alignItems: "center" }}>
                            <Image source={Images.sample_avatar} resizeMode="cover" style={{ aspectRatio: 1, width: 80, height: 80, borderRadius: 30 }} />
                            <TouchableOpacity>
                                <Text style={{ color: colors.primaryBrand, marginTop: 10 }}>Edit profile picture</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginHorizontal: 15, marginTop: 20 }}>
                            <Text style={{ fontSize: 12 }}>First Name</Text>
                            <TextInput
                                style={{ borderBottomWidth: 0.8, paddingStart: 0, borderBottomColor: 'darkgray', fontFamily: 'Roboto-Medium', color: 'black', fontSize: 16, backgroundColor: 'transparent', height: 38 }}
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholderTextColor={'#666'} />
                            <Text style={{ fontSize: 12, marginTop: 10 }}>Last Name</Text>
                            <TextInput
                                style={{ borderBottomWidth: 0.8, paddingStart: 0, borderBottomColor: 'darkgray', fontFamily: 'Roboto-Medium', color: 'black', fontSize: 16, backgroundColor: 'transparent', height: 38 }}
                                value={lastName}
                                onChangeText={setLastName}
                                placeholderTextColor={'#666'} />
                            <Text style={{ fontSize: 12, marginTop: 10 }}>Gender</Text>
                            <CustomDropdown data={genders} value={gender} onValueChange={(value) => setGender(value)} isGenderValid={isGenderValid} placeholder={"Gender"} />

                            <Text style={{ fontSize: 12, marginTop: 10 }}>Birthdate </Text>
                            <DatePickerComponent
                                dateOfBirth={dateOfBirth}
                                setDateOfBirth={setDateOfBirth}
                                isDateOfBirthValid={isDateOfBirthValid} />

                            <Text style={{ fontSize: 12, marginTop: 10 }}>Bio</Text>
                            <TextInput
                                style={{ borderBottomWidth: 0.8, paddingStart: 0, borderBottomColor: 'darkgray', fontFamily: 'Roboto-Medium', color: 'black', fontSize: 16, backgroundColor: 'transparent', height: 'auto' }}
                                value={bio}
                                onChangeText={setBio}
                                multiline
                                placeholderTextColor={'#666'} />


                            <TouchableOpacity
                                onPress={() => {

                                }}
                                style={[{ padding: 15, borderRadius: 10, marginTop: 40, backgroundColor: colors.secondaryBrand }]}>
                                <Text style={[{ fontFamily: 'Roboto-Medium', color: 'white', fontSize: 20, textAlign: 'center' }]}>Save Profile</Text>
                            </TouchableOpacity>


                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </SafeAreaView>
    );
}