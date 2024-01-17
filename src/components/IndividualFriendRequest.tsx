import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Images } from "../utils/Images";
import { colors } from "../utils/Config";

export const IndividualFriendRequest = () => {
    return (
        <TouchableOpacity style={{marginVertical: 5}}>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image source={Images.sample_avatar} resizeMode="cover" style={styles.avatarImage} />
                </View>
                <View style={styles.textContainer}>
                    <Text>
                        <Text style={styles.textUserName}>John Bernard Tinio</Text>
                        <Text> started following you.</Text>
                        <Text> 1 d</Text>
                    </Text>
                </View>
                <TouchableOpacity style={styles.followContainer}>
                    <Text style={styles.followText}>Follow</Text>
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
        backgroundColor: colors.primaryBrand,
        borderRadius: 5,
        paddingHorizontal: 14,
        paddingVertical: 5
    },
    followText: {
        color: 'white', fontWeight: '500'
    }
});