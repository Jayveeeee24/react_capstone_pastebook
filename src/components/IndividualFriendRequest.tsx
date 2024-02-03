import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Images } from "../utils/Images";
import { BASE_URL } from "../utils/GlobalConfig";
import Entypo from "react-native-vector-icons/Entypo";
import axios from "axios";
import { useFriend } from "../context/FriendContext";
import { useToast } from "react-native-toast-notifications";
import { Colors } from "../utils/GlobalStyles";

interface IndividualFriendRequestProps {
    friendRequest: any;
    getFriendRequests: () => void;
    navigation: any;
    route: any;
}

export const IndividualFriendRequest: React.FC<IndividualFriendRequestProps> = ({ friendRequest, getFriendRequests, navigation, route }) => {
    const toast = useToast();
    const { acceptFriendRequest, rejectFriendRequest } = useFriend();

    const acceptFriend = async () => {
        try {
            const result = acceptFriendRequest ? await acceptFriendRequest(friendRequest.id) : undefined;
            if (result) {
                toast.show('Friend Request Accepted!', {
                    type: "success",
                });
                getFriendRequests();
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

    const rejectFriend = async () => {
        try {
            const result = rejectFriendRequest ? await rejectFriendRequest(friendRequest.id) : undefined;
            console.log(result);
            if (result) {
                toast.show('Friend Request Rejected!', {
                    type: "success",
                });
                getFriendRequests();
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


    return (
        <TouchableOpacity style={{ marginVertical: 5 }} onPress={() => { }}>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image source={friendRequest.sender.photo.photoImageURL ? { uri: friendRequest.sender.photo.photoImageURL } : Images.sample_avatar_neutral} resizeMode="cover" style={styles.avatarImage} />
                </View>
                <View style={styles.textContainer}>
                    <Text>
                        <Text style={styles.textUserName}>{`${friendRequest.sender.firstName.toLowerCase().replace(/\s/g, '')}.${friendRequest.sender.lastName.toLowerCase()}`}</Text>
                        <Text> started following you.</Text>
                    </Text>
                </View>
                <TouchableOpacity style={styles.followContainer} onPress={() => {
                    acceptFriend();
                }}>
                    <Text style={styles.followText}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ flex: 0, marginStart: 3 }} onPress={() => {
                    rejectFriend();
                }}>
                    <Entypo name="cross" size={25} color={'black'} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: "center"
    },
    imageContainer: {
        flex: 0, marginEnd: 10
    },
    avatarImage: {
        aspectRatio: 1, width: 50, height: 50, borderRadius: 25
    },
    textContainer: {
        flex: 1, justifyContent: 'flex-start'
    },
    textUserName: {
        color: 'black', fontWeight: '900'
    },
    followContainer: {
        flex: 0,
        alignItems: "center",
        backgroundColor: Colors.primaryBrand,
        borderRadius: 5,
        paddingHorizontal: 14,
        paddingVertical: 5
    },
    followText: {
        color: 'white', fontWeight: '500'
    }
});