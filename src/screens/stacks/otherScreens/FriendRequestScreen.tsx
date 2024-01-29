import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, SafeAreaView, ScrollView, Text, View } from "react-native";
import { IndividualFriendRequest } from "../../../components/IndividualFriendRequest";
import { useFriend } from "../../../context/FriendContext";

interface FriendRequestScreenProps {
    navigation: any;
    route: any;
}

export const FriendRequestScreen: React.FC<FriendRequestScreenProps> = ({ navigation, route }) => {
    const { getAllFriendRequest } = useFriend();

    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [friendRequests, setFriendRequests] = useState<any>([]);

    //useEffect
    useEffect(() => {
        getFriendRequests();
    }, []);


    //scrollers
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

    const getFriendRequests = async () => {
        try {
            const result = getAllFriendRequest ? await getAllFriendRequest() : undefined;
            if (result && Array.isArray(result)) {
                setFriendRequests(result);
            }
        } catch (error: any) {
            console.error("Error fetching friend requests:", error.response);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <FlatList
                data={friendRequests}
                onScroll={handleScroll}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                renderItem={({ item }) => <IndividualFriendRequest key={item.id} friendRequest={item} getFriendRequests={getFriendRequests} navigation={navigation} route={route} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false} />
        </SafeAreaView>
    );
}