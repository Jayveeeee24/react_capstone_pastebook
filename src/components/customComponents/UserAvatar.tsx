import { ImageSourcePropType, StyleSheet, View } from "react-native";
import { Card, Title } from "react-native-paper";
import { Images } from "../../utils/Images";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Colors } from "../../utils/Config";

interface UserAvatarProps {
    name: string;
    imageUrl: ImageSourcePropType;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ name, imageUrl }) => {
    return (
        <View>
            <TouchableOpacity>
                <Card style={styles.avatarContainer}>
                    <Card.Cover resizeMode="cover" source={imageUrl} style={styles.avatarImage} />
                </Card>
            </TouchableOpacity>
            <View style={styles.textContainer}>
                <Title style={styles.text}>{name}</Title>
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