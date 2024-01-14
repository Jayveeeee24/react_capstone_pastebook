import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { UserAvatar } from "../../components/UserAvatar";
import { images } from "../../utils/Images";
import { IndividualPost } from "../../components/IndividualPost";

export const HomeTab = ({ navigation }: any) => {

    const friends = [
        {
            id: '1',
            name: "Jb",
            imageUrl: images.sample_avatar

        },
        {
            id: "2",
            name: "Marliss",
            imageUrl: images.sample_avatar_female
        },
        {
            id: "3",
            name: "Ejay",
            imageUrl: images.sample_avatar
        },
        {
            id: "4",
            name: "Mariel",
            imageUrl: images.sample_avatar_female
        },
        {
            id: "5",
            name: "Barry",
            imageUrl: images.sample_avatar
        },
        {
            id: "6",
            name: "Sam",
            imageUrl: images.sample_avatar_female
        },
        {
            id: "7",
            name: "Blessie",
            imageUrl: images.sample_avatar_female
        },
        {
            id: "8",
            name: "Stan",
            imageUrl: images.sample_avatar
        },
        {
            id: "9",
            name: "Jean",
            imageUrl: images.sample_avatar_female
        },
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', borderBottomColor: 'lightgray', borderBottomWidth: 1 }}>
                <FlatList
                    data={friends}
                    renderItem={({ item }) => <UserAvatar name={item.name} imageUrl={item.imageUrl} />}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={[styles.friendsView]}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <View style={styles.postsContainer}>
                <IndividualPost username='Jb' avatarUrl={images.sample_avatar} postImageUrl={images.logo_wide_dark} likes={30} onLikePress={() => {}} />
            </View>
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