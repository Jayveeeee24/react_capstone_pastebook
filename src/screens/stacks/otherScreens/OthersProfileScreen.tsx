import { useCallback, useEffect, useState } from "react";
import { usePhoto } from "../../../context/PhotoContext";
import { useUser } from "../../../context/UserContext";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import { MmkvStorage } from "../../../utils/GlobalConfig";
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ProfileTabView } from "../../tabViews/ProfileTabView";
import { Images } from "../../../utils/Images";
import { useFriend } from "../../../context/FriendContext";
import axios from "axios";
import { Colors, globalStyles } from "../../../utils/GlobalStyles";

interface OthersProfileScreenProps {
    navigation: any;
    route: any;
}

export const OthersProfileScreen: React.FC<OthersProfileScreenProps> = ({ navigation, route }) => {
    const { getProfile } = useUser();
    const { getPhotoById } = usePhoto();
    const { getFriendExist, addFriend, removeFriend, rejectFriendRequest, acceptFriendRequest } = useFriend();

    const [dynamicTitle, setDynamicTitle] = useState("");

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [bio, setBio] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [gender, setGender] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [profilePicture, setProfilePicture] = useState<any>();
    const [friendStatus, setFriendStatus] = useState('loading');
    const [friendId, setFriendId] = useState('');

    const [postCount, setPostCount] = useState(0);
    const [friendCount, setFriendCount] = useState(0);
    const [albumCount, setAlbumCount] = useState(0);
    const [receiverId, setReceiverId] = useState('');
    const [senderId, setSenderId] = useState('');

    //useEffects
    useEffect(() => {
        loadProfile();
        loadIsFriend();

    }, [friendStatus, receiverId, senderId, getProfile, setFirstName, setLastName, setBio, setPhoneNumber, setGender, setDateOfBirth, setDynamicTitle, navigation])
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <View style={{ flexDirection: "row", alignItems: "center", marginStart: 10 }}>
                    <TouchableOpacity onPress={() => {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [
                                    { name: 'HomeTab' },
                                ],
                            })
                        );
                    }} style={{ flexDirection: "row", alignItems: "center", marginStart: 5 }}>
                        <MaterialIcons name='arrow-back' size={32} color={'black'} />
                    </TouchableOpacity>
                    <View style={{ marginStart: 15, flexDirection: "row", alignItems: "center" }}>
                        <MaterialIcons name="lock-outline" size={24} color='black' />
                        <Text style={{ marginStart: 8, fontSize: 22, color: 'black', fontWeight: '700', alignItems: "center" }}>{dynamicTitle}</Text>
                    </View>
                </View>
            ),
            headerTitle: '',
            headerStyle: {
                elevation: 0,
                shadowOpacity: 0,
            },
        });
    }, [dynamicTitle, navigation]);


    //api functions
    const loadProfile = async () => {
        const id = MmkvStorage.getString('userId');
        if (id) {
            setSenderId(id);
        }
        if (route.params?.userId) {

            setReceiverId(route.params.userId);

            const result = getProfile ? await getProfile(route.params.userId) : undefined;
            if (result.id) {
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

                // console.log(result.photo)
                const pictureResult = getPhotoById ? await getPhotoById(result.photo.id) : undefined;

                if (pictureResult) {
                    setProfilePicture(pictureResult);
                }

            }
        }
    }
    const handleFriend = async () => {
        if (friendStatus == "not_friend") {
            const result = addFriend ? await addFriend(receiverId) : undefined;

            if (result.result == "friend_request_successfully") {
                console.log(result);
                setFriendStatus("friend");
            }
        } else if (friendStatus == "friend") {
            const result = removeFriend ? await removeFriend(receiverId) : undefined;

            if (result.result == "friend_removed") {
                console.log(result);
                setFriendStatus("friend");
            }
        } else if (friendStatus == "i_requested") {
            // console.log(friendId)
            const result = rejectFriendRequest ? await rejectFriendRequest(friendId) : undefined;

            if (result.result == "friend_request_rejected") {
                console.log(result);
                setFriendStatus("not_friend");
            }
        } else if (friendStatus == "they_requested") {
            const result = acceptFriendRequest ? await acceptFriendRequest(friendId) : undefined;

            if (result.result == "friend_request_accepted") {
                console.log(result);
                setFriendStatus("friend");
            }
        }


    }



    const loadIsFriend = async () => {
        try {
            const result = getFriendExist ? await getFriendExist(receiverId, senderId) : undefined;
            // axios.interceptors.request.use(request => {
            //     console.log('Starting Request', request);
            //     return request;
            // });
            if (result.result) {
                setFriendStatus('not_friend');
            } else if (result.isFriend) {
                setFriendStatus('friend');
                setFriendId(result.id);
            } else if (!result.isFriend) {
                setFriendId(result.id);
                if (result.senderId === senderId) {
                    setFriendStatus('i_requested');
                } else {
                    setFriendStatus('they_requested');
                }
            }
        } catch (error: any) {
            console.error("Error fetching friend exist:", error);
        }
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flexDirection: "column", flex: 1 }}>
                <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
                    <View style={{ flexDirection: "row", gap: 20, }}>
                        <View style={{ flex: 1 }}>
                            <Image source={profilePicture ? { uri: profilePicture } : Images.sample_avatar_neutral} resizeMode="cover" style={{ aspectRatio: 1, width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: Colors.orange }} />
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
                                <Text style={{ color: 'black', fontFamily: 'Roboto-Medium', marginStart: 5 }}>
                                    {
                                        dateOfBirth.toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })
                                    }
                                </Text>
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


                    {
                        // navigation.navigate('CreatePostTab', {
                        //     screen: 'CreatePost',
                        //     params: {
                        //         postedId: userId,
                        //     }
                        // })
                    }


                    {friendStatus !== 'loading' && (
                        <TouchableOpacity
                            onPress={() => {
                                handleFriend();
                            }}
                            style={{
                                backgroundColor: friendStatus == "not_friend" ? Colors.success : friendStatus == "friend" ? Colors.danger : friendStatus == "i_requested" ? Colors.danger : friendStatus == "they_requested" ? Colors.success : "",
                                borderRadius: 5,
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                alignSelf: "center",
                                marginTop: 10
                            }}>
                            <Text style={[{ fontFamily: 'Roboto-Medium', color: 'white', fontWeight: '500', fontSize: 16 }]}>
                                {friendStatus == "not_friend" ? 'Add Friend' : friendStatus == "friend" ? 'Remove Friend' : friendStatus == "i_requested" ? "Remove Friend Request" : friendStatus == "they_requested" ? "Accept Friend Request" : ""}
                            </Text>
                        </TouchableOpacity>
                    )}

                </View>
                <View style={{ flex: 1 }}>
                    <ProfileTabView navigation={navigation} route={route} userId={receiverId} />
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