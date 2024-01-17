import { useCallback, useState } from "react";
import { RefreshControl, SafeAreaView, ScrollView, Text, View } from "react-native";
import { IndividualFriendRequest } from "../../components/IndividualFriendRequest";

interface FriendRequestScreenProps {
    navigation: any;
    route: any;
}

export const FriendRequestScreen: React.FC<FriendRequestScreenProps> = ({ navigation, route }) => {
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);


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
                <View style={{ flexDirection: "column", backgroundColor: 'white', flex: 1 }}>
                    <IndividualFriendRequest />
                    <IndividualFriendRequest />
                    <IndividualFriendRequest />
                    <IndividualFriendRequest />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}