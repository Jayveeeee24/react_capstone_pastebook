import { Image, Text, TouchableOpacity, View } from "react-native";
import { Images } from "../utils/Images";
import { convertToRelativeTime } from "../utils/Config";
import { useNotification } from "../context/NotificationContext";

interface IndividualNotificationProps {
    navigation: any;
    notification: any;
    getNotifications: () => void;
    route: any;
}



export const IndividualNotification: React.FC<IndividualNotificationProps> = ({ notification, getNotifications, navigation, route }) => {
    const {updateReadNotification} = useNotification();


    const readNotification = async () => {
        try {
            const result = updateReadNotification ? await updateReadNotification(await notification.id) : undefined;
            if (result) {
                getNotifications();
            }
        } catch (error) {
            console.error("Error updating read notifications:", error);
        }
    }

    return (
        <View>
            <TouchableOpacity style={{ marginVertical: 5 }} onPress={() => readNotification()}>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: "space-between", paddingVertical: 8, paddingHorizontal: 12, alignItems: "center" }}>
                    <View style={{ flex: 0 }}>
                        <Image source={notification.notifier.photo.photoImageURL ? { uri: notification.notifier.photo.photoImageURL } : Images.sample_avatar_neutral} resizeMode="cover" style={{ aspectRatio: 1, width: 50, height: 50, borderRadius: 25 }} />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                        <Text style={{ fontSize: 14, fontFamily: 'Roboto-Medium', color: 'gray', marginStart: 10 }}>
                            <Text style={{ color: 'black', fontWeight: '700' }}>{(notification.notifier.firstName && notification.notifier.lastName) && `${notification.notifier.firstName.toLowerCase().replace(/\s/g, '')}.${notification.notifier.lastName.toLowerCase()}`}</Text>
                            <Text style={{ color: '#263238' }}>
                                {
                                    notification.notificationType === 'like' ? ' has liked your post' :
                                        notification.notificationType === 'comment' ? ' has commented on your post' :
                                            notification.notificationType === 'accept-friend-request' ? ' has accepted your friend request' : ''
                                }
                            </Text>
                            <Text style={{color: "#263238"}}> {convertToRelativeTime(notification.notifiedDate)}</Text>
                            <Text style={{ color: 'red', fontSize: 18 }}>{!notification.isRead && ' *'}</Text>
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>


        </View>
    );
}