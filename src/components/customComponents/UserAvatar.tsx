import { ImageSourcePropType, StyleSheet, View } from "react-native";
import { Card, Title } from "react-native-paper";
import { Images } from "../../utils/Images";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Colors, Storage } from "../../utils/Config";

interface UserAvatarProps {
    item: any;
    navigation: any;
    route: any;
}


export const UserAvatar: React.FC<UserAvatarProps> = ({ item, navigation, route }) => {
    const userId = Storage.getString('userId');

    return (
        <View>
            <TouchableOpacity>
                <Card style={styles.avatarContainer}>
                    <Card.Cover resizeMode="cover" source={item.photo.photoImageURL ? { uri: item.photo.photoImageURL } : Images.sample_avatar_neutral} style={styles.avatarImage} />
                </Card>
            </TouchableOpacity>
            <View style={styles.textContainer}>
                <Title style={[styles.text, {fontWeight: item.id == userId ? '900' : '300', fontFamily: 'Roboto-Medium'}]}>{item.id == userId ? 'You' : item.firstName.split(' ')[0]}</Title>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    avatarContainer: {
        borderRadius: 50,
        width: 60,
        height: 60,
        borderWidth: 3,
        borderColor: Colors.orange
    },
    avatarImage: {
        height: '100%',
        borderRadius: 50
    },
    textContainer: {
        alignItems: 'center',
        padding: 0
    },
    text: {
        fontSize: 14,
        fontFamily: 'Roboto-Medium'
    }
})