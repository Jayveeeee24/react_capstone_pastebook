import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType, Button } from "react-native";
import { images } from "../utils/Images";
import { Card } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ReadMore from 'react-native-read-more-text';


interface IndividualPostProps {
    username: string;
    avatarUrl: ImageSourcePropType;
    postImageUrl: ImageSourcePropType,
    likes: number,
    onLikePress: () => void
}

export const IndividualPost: React.FC<IndividualPostProps> = () => {


    return (
        <View style={styles.container}>

            {/* Header buttons */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => { }}>
                    <View style={styles.avatarContainer}>
                        <Card style={styles.avatarCard}>
                            <Card.Cover resizeMode="cover" source={images.sample_avatar} style={styles.avatarImage} />
                        </Card>
                        <Text style={[styles.avatarText, styles.text]}>jayvee.artemis</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <TouchableOpacity style={{ backgroundColor: 'lightgray', borderRadius: 5, paddingHorizontal: 14, paddingVertical: 5 }}>
                        <Text style={[styles.text, { fontWeight: '500' }]}>Follow</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { }}>
                        <MaterialCommunityIcons name="dots-vertical" size={20} color="#666" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Post Image */}
            <View style={styles.postImageContainer}>
                <Image source={images.sample_post_image} resizeMode="cover" style={styles.postImage} />
            </View>


            <View style={{ flexDirection: "column" }}>
                <View style={styles.footerButtonContainer}>
                    <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
                        <TouchableOpacity onPress={() => { }}>
                            <MaterialCommunityIcons name="cards-heart-outline" size={30} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { }}>
                            <MaterialCommunityIcons name="comment-outline" size={26} color="black" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.text}>22 hours ago</Text>
                </View>
                <View style={{ flexDirection: "column", marginStart: 12, gap: 2 }}>
                    <Text style={styles.text}>
                        <Text>Liked by </Text>
                        <Text style={[{ fontWeight: "900" }]}>Marliss</Text>
                        <Text> and </Text>
                        <Text style={[{ fontWeight: "900" }]}>1,600,234 others</Text>
                    </Text>
                    <View>
                        <ReadMore
                            numberOfLines={2}
                            renderTruncatedFooter={(handlePress: () => void) => <Text onPress={handlePress}> more</Text>}
                            renderRevealedFooter={(handlePress: () => void) => <Text onPress={handlePress}>... less</Text>}
                            onReady={() => { }}>
                            <Text style={[styles.text, { fontWeight: "900" }]}>This is a title</Text>
                            <Text> </Text>
                            <Text style={styles.text}> Lorem ipsum, dolor sit amet consectetur adipisicing elit. Et nemo ut laboriosam velit omnis quaerat non sapiente sunt sequi distinctio vitae repudiandae reiciendis ipsa, error perspiciatis at. Omnis, obcaecati. Deleniti?</Text>
                        </ReadMore>
                    </View>

                    <Text style={{ color: 'gray' }}>View all 900 comments</Text>
                </View>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        color: 'black'!,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        borderBottomWidth: 0.8,
        borderBottomColor: 'gray'
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        width: '100%'
    },
    avatarContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    avatarCard: {
        borderRadius: 15,
        width: 30,
        height: 30
    },
    avatarImage: {
        height: '100%',
        borderRadius: 50
    },
    avatarText: {
        fontSize: 14,
        marginStart: 10,
        fontWeight: '500'
    },
    postImageContainer: {
        flexDirection: 'row',
        width: '100%'
    },
    postImage: {
        width: '100%',
        height: 350,
        aspectRatio: 1
    },
    footerButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 15,
        alignItems: "center",
        width: '100%',
    },


});
