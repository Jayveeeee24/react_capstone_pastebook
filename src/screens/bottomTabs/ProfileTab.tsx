import { useContext, useEffect, useState } from "react";
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { Images } from "../../utils/Images";
import { ProfileTabView } from "../tabViews/ProfileTabView";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Storage } from "../../utils/Config";
import { useUser } from "../../context/UserContext";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";

interface ProfileTabProps {
    navigation: any;
    route: any;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ navigation, route }) => {
    const { getProfile } = useUser();
    const [dynamicTitle, setDynamicTitle] = useState("Profile Tab");

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [bio, setBio] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [gender, setGender] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            const loadProfile = async () => {
                const userId = Storage.getString('userId');

                if (userId) {
                    const result = getProfile ? await getProfile(userId) : undefined;

                    if (result.id) {
                        setFirstName(result.firstName);
                        setLastName(result.lastName);
                        setBio(result.aboutMe);
                        setPhoneNumber(result.phoneNumber);
                        setGender(result.sex);
                        setDateOfBirth(new Date(result.birthDate));
                        setDynamicTitle(`${result.firstName.toLowerCase().replace(/\s/g, '')}.${result.lastName.toLowerCase()}`);
                    }
                }
            }

            loadProfile();

        }, [getProfile, setFirstName, setLastName, setBio, setPhoneNumber, setGender, setDateOfBirth, setDynamicTitle, navigation])
    );

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <View style={{ flexDirection: "row", alignItems: "center", marginStart: 10 }}>
                    <MaterialIcons name="lock-outline" size={24} color='black' />
                    <Text style={{ marginStart: 8, fontSize: 22, color: 'black', fontWeight: '700', alignItems: "center" }}>{dynamicTitle}</Text>
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                    <View style={{ flexDirection: "row", marginEnd: 12 }}>
                        <SimpleLineIcons name="settings" size={20} color='black' />
                    </View>
                </TouchableOpacity>
            ),
            headerTitle: '',
            headerStyle: {
                elevation: 0,
                shadowOpacity: 0,
            },
        });
    }, [dynamicTitle, navigation]);


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flexDirection: "column", flex: 1 }}>
                <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
                    <View style={{ flexDirection: "row", gap: 20, }}>
                        <Image source={Images.sample_avatar} resizeMode="cover" style={{ flex: 1, aspectRatio: 1, width: 60, height: 60 }} />
                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <Text style={styles.textMetricsTitle}>19</Text>
                            <Text style={styles.textMetricsSub}>Posts</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('Followers')} style={{ flex: 1, justifyContent: "center" }}>
                            <Text style={styles.textMetricsTitle}>62</Text>
                            <Text style={styles.textMetricsSub}>Followers</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('AlbumsTab')} style={{ flex: 1, justifyContent: "center" }}>
                            <Text style={styles.textMetricsTitle}>12</Text>
                            <Text style={styles.textMetricsSub}>Albums</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginTop: 5 }}>
                        <Text style={{ color: 'black', fontFamily: 'Roboto-Medium' }}>
                            <Text style={{ fontWeight: '700' }}>{firstName + ' ' + lastName}</Text>
                            <Text>{"\n" + bio}</Text>
                        </Text>
                        <View>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <MaterialCommunityIcons name="cake-variant-outline" size={16} color={'black'} />
                                <Text style={{ color: 'black', fontFamily: 'Roboto-Medium', marginStart: 5 }}>{dateOfBirth.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <MaterialCommunityIcons name="gender-male" size={16} color={'black'} />
                                <Text style={{ color: 'black', fontFamily: 'Roboto-Medium', marginStart: 5 }}>
                                    {gender === '1' ? 'Male' : (gender === '2' ? 'Female' : 'Rather not say')}
                                </Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <MaterialCommunityIcons name="phone-outline" size={16} color={'black'} />
                                <Text style={{ color: 'black', fontFamily: 'Roboto-Medium', marginStart: 5 }}>{phoneNumber}</Text>
                            </View>
                        </View>
                    </View>


                    <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={{ borderWidth: 0.8, borderColor: 'gray', marginTop: 15, padding: 5 }}>
                        <Text style={{ color: 'black', fontFamily: 'Roboto-Medium', fontWeight: '700', textAlign: "center" }}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>
                <ProfileTabView />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    textMetricsTitle: {
        fontFamily: 'Roboto-Medium',
        fontSize: 20,
        textAlign: "center",
        color: 'black',
        fontWeight: '700'
    },
    textMetricsSub: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        textAlign: "center",
        color: 'black'
    }
});