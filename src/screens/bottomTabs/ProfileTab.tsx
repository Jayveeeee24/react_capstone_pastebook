import { useContext, useEffect, useState } from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { Images } from "../../utils/Images";
import { ProfileTabView } from "../tabViews/ProfileTabView";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Storage } from "../../utils/Config";
import { useUser } from "../../context/UserContext";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { usePhoto } from "../../context/PhotoContext";

interface ProfileTabProps {
    navigation: any;
    route: any;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ navigation, route }) => {
    const { getProfile } = useUser();
    const { getPhotoById } = usePhoto();

    const [dynamicTitle, setDynamicTitle] = useState("Profile Tab");

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [bio, setBio] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [gender, setGender] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [profilePicture, setProfilePicture] = useState<any>();

    const [postCount, setPostCount] = useState(0);
    const [friendCount, setFriendCount] = useState(0);
    const [albumCount, setAlbumCount] = useState(0);

    useFocusEffect(
        React.useCallback(() => {
            const loadProfile = async () => {
                const userId = Storage.getString('userId');

                if (userId) {
                    const result = getProfile ? await getProfile(userId) : undefined;
                    if (await result.id) {
                        setFirstName(result.firstName);
                        setLastName(result.lastName);
                        setBio(result.aboutMe ? result.aboutMe : '');
                        setPhoneNumber(result.phoneNumber);
                        setGender(result.sex);
                        setDateOfBirth(new Date(result.birthDate));
                        setFriendCount(result.friendCount);
                        setAlbumCount(result.albumCount);
                        setPostCount(result.postCount);
                        setDynamicTitle(`${result.firstName.toLowerCase().replace(/\s/g, '')}.${result.lastName.toLowerCase()}`);

                        const pictureResult = getPhotoById ? await getPhotoById(result.photo.id) : undefined;

                        if (pictureResult) {
                            setProfilePicture(pictureResult);
                        }

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
                        <View style={{ flex: 1 }}>
                            <Image source={profilePicture ? { uri: profilePicture } : Images.sample_avatar_neutral} resizeMode="contain" style={{ aspectRatio: 1, width: 80, height: 80 }} />
                        </View>

                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <Text style={styles.textMetricsTitle}>{postCount}</Text>
                            <Text style={styles.textMetricsSub}>Posts</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('Followers')} style={{ flex: 1, justifyContent: "center" }}>
                            <Text style={styles.textMetricsTitle}>{friendCount}</Text>
                            <Text style={styles.textMetricsSub}>Followers</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('AlbumsTab')} style={{ flex: 1, justifyContent: "center" }}>
                            <Text style={styles.textMetricsTitle}>{albumCount}</Text>
                            <Text style={styles.textMetricsSub}>Albums</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={{ marginTop: 5, color: 'black', fontFamily: 'Roboto-Medium', fontWeight: '700' }}>{firstName + ' ' + lastName}</Text>

                    <View style={{ flexDirection: "row", justifyContent: bio ? "space-between" : "flex-start", alignItems: "flex-start", marginTop: 5 }}>
                        <View style={{ justifyContent: "center" }}>
                            <Text style={{ color: 'black', fontFamily: 'Roboto-Medium' }}>{"\n" + bio ? bio : ''}</Text>
                        </View>
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
                                    {gender}
                                </Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <MaterialCommunityIcons name="phone-outline" size={16} color={'black'} />
                                <Text style={{ color: 'black', fontFamily: 'Roboto-Medium', marginStart: 5 }}>{phoneNumber ? phoneNumber : ''}</Text>
                            </View>
                        </View>
                    </View>


                    <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={{ borderWidth: 0.8, borderColor: 'gray', marginTop: 15, padding: 5 }}>
                        <Text style={{ color: 'black', fontFamily: 'Roboto-Medium', fontWeight: '700', textAlign: "center" }}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <ProfileTabView />
                </View>
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