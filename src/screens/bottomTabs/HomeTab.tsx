import { FlatList, Image, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { UserAvatar } from "../../components/customComponents/UserAvatar";
import { Images } from "../../utils/Images";
import { IndividualPost } from "../../components/IndividualPost";
import { useCallback, useEffect, useState } from "react";
import { useFriend } from "../../context/FriendContext";
import { Storage } from "../../utils/Config";
import { useFocusEffect } from "@react-navigation/native";
import { useUser } from "../../context/UserContext";
import { usePhoto } from "../../context/PhotoContext";

interface HomeTabProps {
    navigation: any;
    route: any;
}

export const HomeTab: React.FC<HomeTabProps> = ({ navigation, route }) => {
    const { getAllFriends } = useFriend();
    const { getProfile } = useUser();
    const { getPhotoById } = usePhoto();

    const [isScrollLoading, setIsScrollLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [friends, setFriends] = useState<any>([]);

    const [firstName, setFirstName] = useState('');
    const [profilePicture, setProfilePicture] = useState<any>();
    const [userId, setUserId] = useState('');

    useFocusEffect(() => {
        loadProfile();
    })

    useEffect(() => {
        getFriends();
    }, []);

    const loadProfile = async () => {
        setUserId(Storage.getString('userId')!);

        if (userId != '') {
            const result = getProfile ? await getProfile(userId) : undefined;
            if (await result.id) {
                setFirstName(result.firstName);
                const pictureResult = getPhotoById ? await getPhotoById(result.photo.id) : undefined;

                if (pictureResult) {
                    setProfilePicture(pictureResult);
                }
            }
        }
    }

    //api functions
    const getFriends = async () => {
        try {
            const userId = Storage.getString('userId');

            if (userId) {
                const result = getAllFriends ? await getAllFriends(userId) : undefined;
                if (result) {
                    setFriends(result);
                }
            }
        } catch (error: any) {
            console.error("Error fetching photos:", error.response);
        }
    }

    //scroll refresh
    const handleRefresh = useCallback(() => {
        setRefreshing(true);

        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);
    const handleScroll = (event: { nativeEvent: { layoutMeasurement: any; contentOffset: any; contentSize: any; }; }) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isEndReached = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

        if (isEndReached && !isScrollLoading) {
            setIsScrollLoading(true);

            setTimeout(() => {
                // setFriends((prevFriends) => [...prevFriends, ...newData]);
                setIsScrollLoading(false);
            }, 1000);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', borderBottomColor: 'lightgray', borderBottomWidth: 1 }}>
                    <View style={{ marginStart: 15 }}>
                        <UserAvatar item={{ id: userId, photo: { photoImageURL: profilePicture }, firstName: firstName }} navigation={navigation} route={route} />
                    </View>
                    <FlatList
                        data={friends}
                        renderItem={({ item }) => <UserAvatar item={item} navigation={navigation} route={route} />}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={[styles.friendsView]}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />

                </View>
                <View style={styles.postsContainer}>
                    {/* <IndividualPost name='jayvee.artemis' avatarUrl={Images.sample_avatar} postImageUrl={Images.sample_post_image} postTitle="This is a post" postCaption="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus voluptates et quas numquam, ducimus autem asperiores itaque non provident, quam doloribus rerum, ullam fugit iste magni! Laboriosam iste modi possimus." comments={910} likes={1654432} onLikePress={() => { }} />
                    <IndividualPost name='yashimallow' avatarUrl={Images.sample_avatar_female} postImageUrl={Images.sample_post_image_2} postTitle="This is a post 2" postCaption="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus voluptates et quas numquam, ducimus autem asperiores itaque non provident, quam doloribus rerum, ullam fugit iste magni! Laboriosam iste modi possimus." comments={754} likes={31321} onLikePress={() => { }} />
                    <IndividualPost name='blec_siopao' avatarUrl={Images.sample_avatar_female} postImageUrl={Images.sample_post_image_3} postTitle="This is a post 3" postCaption="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus voluptates et quas numquam, ducimus autem asperiores itaque non provident, quam doloribus rerum, ullam fugit iste magni! Laboriosam iste modi possimus." comments={3} likes={5} onLikePress={() => { }} />
                    <IndividualPost name='hmzzjin' avatarUrl={Images.sample_avatar_female} postImageUrl={Images.sample_post_image_4} postTitle="This is a post 4" postCaption="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus voluptates et quas numquam, ducimus autem asperiores itaque non provident, quam doloribus rerum, ullam fugit iste magni! Laboriosam iste modi possimus." comments={10341} likes={3134221} onLikePress={() => { }} /> */}


                </View>
            </ScrollView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Roboto-Medium'
    },

    friendsView: {
        paddingHorizontal: 15,
        gap: 15,
        height: 85,
        marginBottom: 10,
    },
    postsContainer: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: "column",
        alignItems: 'center'
    }
})