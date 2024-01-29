import * as React from 'react';
import { View, useWindowDimensions, StyleSheet, TouchableOpacity, Text, ScrollView, FlatList } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { IndividualPost } from '../../components/IndividualPost';
import { Images } from '../../utils/Images';
import { Colors, Storage } from '../../utils/Config';
import { useEffect, useState } from 'react';
import { usePost } from '../../context/PostContext';



const FirstRoute = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'column', alignItems: 'center' }} >
            {/* <IndividualPost name='jayvee.artemis' avatarUrl={Images.sample_avatar} postImageUrl={Images.sample_post_image} postTitle="This is a post" postCaption="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus voluptates et quas numquam, ducimus autem asperiores itaque non provident, quam doloribus rerum, ullam fugit iste magni! Laboriosam iste modi possimus." comments={910} likes={1654432} onLikePress={() => { }} /> */}
        </View>
    </ScrollView>
    // <FlatList
    //     data={comments}
    //     renderItem={({ item }) => <IndividualComment key={item.id} comment={item} navigation={navigation} route={route} />}
    //     keyExtractor={(item) => item.id}
    //     showsVerticalScrollIndicator={false} />
);

const SecondRoute = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'column', alignItems: 'center' }} >
            {/* <IndividualPost name='yashimallow' avatarUrl={Images.sample_avatar_female} postImageUrl={Images.sample_post_image_2} postTitle="This is a post 2" postCaption="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus voluptates et quas numquam, ducimus autem asperiores itaque non provident, quam doloribus rerum, ullam fugit iste magni! Laboriosam iste modi possimus." comments={754} likes={31321} onLikePress={() => { }} /> */}
            {/* <IndividualPost name='blec_siopao' avatarUrl={Images.sample_avatar_female} postImageUrl={Images.sample_post_image_3} postTitle="This is a post 3" postCaption="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus voluptates et quas numquam, ducimus autem asperiores itaque non provident, quam doloribus rerum, ullam fugit iste magni! Laboriosam iste modi possimus." comments={3} likes={5} onLikePress={() => { }} /> */}
            {/* <IndividualPost name='hmzzjin' avatarUrl={Images.sample_avatar_female} postImageUrl={Images.sample_post_image_4} postTitle="This is a post 4" postCaption="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus voluptates et quas numquam, ducimus autem asperiores itaque non provident, quam doloribus rerum, ullam fugit iste magni! Laboriosam iste modi possimus." comments={10341} likes={3134221} onLikePress={() => { }} /> */}
        </View>
    </ScrollView>
);

const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
});

const renderTabBar = (props: { navigationState: { routes: any[]; index: any; }; jumpTo: (arg0: any) => void; }) => (
    <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, index) => (
            <TouchableOpacity
                key={index}
                style={[styles.tabItem, index === props.navigationState.index && styles.selectedTab]}
                onPress={() => props.jumpTo(route.key)}>
                <MaterialCommunityIcons name={route.key === 'first' ? 'grid' : 'account-box-outline'} size={26} color={Colors.primaryBrand} />
            </TouchableOpacity>
        ))}
    </View>
);

export const ProfileTabView = () => {
    const layout = useWindowDimensions();

    //useEffect
    useEffect(() => {
        getOwnPost();
        // getOthersPost();
    }, [])

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'First' },
        { key: 'second', title: 'Second' },
    ]);

    const { getMyOwnPosts, getOthersPosts } = usePost();


    const [ownPosts, setOwnPosts] = useState<any>([]);
    const [othersPosts, setOthersPosts] = useState<any>([]);


    const getOwnPost = async () => {
        const userId = Storage.getString('userId');
        if(userId){
            try {
                const result = getMyOwnPosts ? await getMyOwnPosts(userId) : undefined;
                if (await result) {
                    console.log(result);
                }
            } catch (error: any) {
                console.error("Error fetching photos:", error.response);
            }
        }
    }

    const getOthersPost = async () => {
        const userId = Storage.getString('userId');
        if(userId){
            try {
                const result = getOthersPosts ? await getOthersPosts(userId) : undefined;
                if (await result) {
                    console.log(result);
                }
            } catch (error: any) {
                console.error("Error fetching photos:", error.response);
            }
        }
    }

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={renderTabBar}
        />
    );
};

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
    },
    selectedTab: {
        backgroundColor: 'white',
        borderBottomWidth: 0.8,
        borderBottomColor: Colors.primaryBrand
    },
    tabText: {
        fontWeight: 'bold',
    },
});

