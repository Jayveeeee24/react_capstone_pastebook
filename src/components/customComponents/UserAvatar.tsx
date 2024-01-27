import { ImageSourcePropType, StyleSheet, View } from "react-native";
import { Card, Title } from "react-native-paper";
import { Images } from "../../utils/Images";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Colors } from "../../utils/Config";

interface UserAvatarProps {
    item: any;
    navigation: any;
    route: any;
}


export const UserAvatar: React.FC<UserAvatarProps> = ({ item, navigation, route }) => {
    return (
        <View>
            <TouchableOpacity>
                <Card style={styles.avatarContainer}>
                    <Card.Cover resizeMode="cover" source={{ uri: item.photo.photoImageURL }} style={styles.avatarImage} />
                </Card>
            </TouchableOpacity>
            <View style={styles.textContainer}>
                <Title style={styles.text}>{item.firstName.split(' ')[0]}</Title>
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
        borderColor: Colors.secondaryBrand
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