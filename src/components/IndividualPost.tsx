import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType, Dimensions } from "react-native";
import { Card, Menu, PaperProvider } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ReadMore from 'react-native-read-more-text';
import { Images } from "../utils/Images";

interface IndividualPostProps {
    post: any;
    likes: number,
    comments: number,
    onLikePress: () => void,
    setIsBottomSheetVisible: (isTrue: boolean) => void,
    navigation: any;
    route: any;
}

export const IndividualPost: React.FC<IndividualPostProps> = ({ post, likes, comments, onLikePress, setIsBottomSheetVisible, navigation, route }) => {
    const width = Dimensions.get('window').width;


    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => { }}>
                        <View style={styles.avatarContainer}>
                            <Card style={styles.avatarCard}>
                                <Card.Cover resizeMode="cover" source={Images.sample_avatar_female} style={styles.avatarImage} />
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

                <View style={styles.postImageContainer}>
                    <Image source={Images.sample_post_image_10} resizeMode="cover" style={[styles.postImage, { width: width, height: width }]} />
                </View>

                <View style={{ flexDirection: "column" }}>
                    <View style={styles.footerButtonContainer}>
                        <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
                            <TouchableOpacity onPress={() => { }}>
                                <MaterialCommunityIcons name="cards-heart-outline" size={30} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setIsBottomSheetVisible(true)}>
                                <MaterialCommunityIcons name="comment-outline" size={26} color="black" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.text}>22 hours ago</Text>
                    </View>

                    <View style={{ flexDirection: "column", marginStart: 12, gap: 2, marginBottom: 10 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('Likes')}>
                            <Text style={[{ fontWeight: "500", color: 'black' }]}>{likes.toLocaleString()} likes</Text>
                        </TouchableOpacity>
                        
                        <ReadMore
                            numberOfLines={2}
                            renderTruncatedFooter={(handlePress: () => void) => <Text style={[styles.text, { fontWeight: '500' }]} onPress={handlePress}>... more</Text>}
                            renderRevealedFooter={(handlePress: () => void) => <Text style={[styles.text, { fontWeight: '500' }]} onPress={handlePress}>... less</Text>}
                            onReady={() => { }}>
                            <Text style={[styles.text, { fontWeight: "900" }]}>This is a title</Text>
                            <Text> </Text>
                            <Text style={styles.text}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maxime deleniti sequi, aliquid laborum aperiam mollitia non officia eos repellat velit voluptatem animi corporis asperiores rem labore perspiciatis expedita impedit delectus?</Text>
                        </ReadMore>

                        <TouchableOpacity onPress={() => setIsBottomSheetVisible(true)}>
                            <Text style={{ color: 'gray' }}>View all {comments} comments</Text>
                        </TouchableOpacity>
                    </View>
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
