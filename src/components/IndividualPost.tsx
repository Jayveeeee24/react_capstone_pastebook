import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType, Dimensions } from "react-native";
import { Card, Menu, PaperProvider } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Images } from "../utils/Images";
import ReadMore from '@fawazahmed/react-native-read-more';

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
                                <Card.Cover resizeMode="cover" source={{uri: post.poster.photo.photoImageURL}} style={styles.avatarImage} />
                            </Card>
                            <Text style={[styles.avatarText, styles.text]}>
                                {`${post.poster.firstName.toLowerCase().replace(/\s/g, '')}.${post.poster.lastName.toLowerCase()}` +
                                    (post.poster.id === post.timeline.userId
                                        ? ''
                                        : ` @ ${post.timeline.user.firstName.toLowerCase().replace(/\s/g, '')}.${post.timeline.user.lastName.toLowerCase()}`)}
                            </Text>

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
                        <Text style={[styles.text]}>{post.datePosted}</Text>
                    </View>

                    <View style={{ flexDirection: "column", marginStart: 12, gap: 2, marginBottom: 10 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('Likes')}>
                            <Text style={[{ fontWeight: "500", color: 'black' }]}>{likes.toLocaleString()} likes</Text>
                        </TouchableOpacity>


                        <View style={{ width: width, maxWidth: '95%' }}>
                            <ReadMore numberOfLines={3} style={{ fontSize: 14, color: '#455A64', fontFamily: 'Roboto-Medium' }} seeLessStyle={{ color: 'black', fontWeight: '700' }} seeMoreStyle={{ color: 'black', fontWeight: '700' }}>
                                {
                                    <Text style={{}}>{post.postTitle}: {post.postBody}</Text>
                                }
                            </ReadMore>
                        </View>



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
