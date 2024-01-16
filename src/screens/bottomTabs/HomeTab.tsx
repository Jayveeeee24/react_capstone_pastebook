import { FlatList, Image, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { UserAvatar } from "../../components/UserAvatar";
import { images } from "../../utils/Images";
import { IndividualPost } from "../../components/IndividualPost";
import { useCallback, useState } from "react";

export const HomeTab = () => {


    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [friends, setFriends] = useState([
        {
            id: '1',
            name: "Jb",
            imageUrl: images.sample_avatar

        },
        {
            id: "2",
            name: "Sam",
            imageUrl: images.sample_avatar_female
        },
        {
            id: "3",
            name: "Stan",
            imageUrl: images.sample_avatar
        },
        {
            id: "4",
            name: "Jean",
            imageUrl: images.sample_avatar_female
        },
        {
            id: "5",
            name: "Jiggs",
            imageUrl: images.sample_avatar
        },
        {
            id: "6",
            name: "Blessie",
            imageUrl: images.sample_avatar_female
        },
        {
            id: "7",
            name: "Ejay",
            imageUrl: images.sample_avatar
        },
        {
            id: "8",
            name: "Marliss",
            imageUrl: images.sample_avatar_female
        },
        {
            id: "9",
            name: "Geo",
            imageUrl: images.sample_avatar
        },
        {
            id: "10",
            name: "Mariel",
            imageUrl: images.sample_avatar_female
        },
    ]);

    const handleRefresh = useCallback(() => {
        setRefreshing(true);

        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    const handleScroll = (event: { nativeEvent: { layoutMeasurement: any; contentOffset: any; contentSize: any; }; }) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isEndReached = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

        if (isEndReached && !loading) {
            setLoading(true);

            setTimeout(() => {
                // setFriends((prevFriends) => [...prevFriends, ...newData]);
                setLoading(false);
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
                    <FlatList
                        data={friends}
                        renderItem={({ item }) => <UserAvatar name={item.name} imageUrl={item.imageUrl} />}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={[styles.friendsView]}
                        horizontal
                        showsHorizontalScrollIndicator={false} />
                </View>
                <View style={styles.postsContainer}>
                    <IndividualPost name='jayvee.artemis' avatarUrl={images.sample_avatar} postImageUrl={images.sample_post_image} postTitle="This is a post" postCaption="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus voluptates et quas numquam, ducimus autem asperiores itaque non provident, quam doloribus rerum, ullam fugit iste magni! Laboriosam iste modi possimus." comments={910} likes={1654432} onLikePress={() => { }} />
                    <IndividualPost name='yashimallow' avatarUrl={images.sample_avatar_female} postImageUrl={images.sample_post_image_2} postTitle="This is a post 2" postCaption="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus voluptates et quas numquam, ducimus autem asperiores itaque non provident, quam doloribus rerum, ullam fugit iste magni! Laboriosam iste modi possimus." comments={754} likes={31321} onLikePress={() => { }} />
                    <IndividualPost name='blec_siopao' avatarUrl={images.sample_avatar_female} postImageUrl={images.sample_post_image_3} postTitle="This is a post 3" postCaption="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus voluptates et quas numquam, ducimus autem asperiores itaque non provident, quam doloribus rerum, ullam fugit iste magni! Laboriosam iste modi possimus." comments={3} likes={5} onLikePress={() => { }} />
                    <IndividualPost name='hmzzjin' avatarUrl={images.sample_avatar_female} postImageUrl={images.sample_post_image_4} postTitle="This is a post 4" postCaption="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus voluptates et quas numquam, ducimus autem asperiores itaque non provident, quam doloribus rerum, ullam fugit iste magni! Laboriosam iste modi possimus." comments={10341} likes={3134221} onLikePress={() => { }} />
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