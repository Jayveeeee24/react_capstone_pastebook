import { RefreshControl, SafeAreaView, ScrollView, Text, View } from "react-native";
import { IndividualNotification } from "../../components/IndividualNotification";
import { useCallback, useState } from "react";

interface NotificationScreenProps {
    navigation: any;
    route: any;
}

export const NotificationScreen: React.FC<NotificationScreenProps> = ({ navigation, route }) => {
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
                    <Text style={{ marginHorizontal: 10, marginVertical: 13, fontSize: 18, color: 'black', fontFamily: 'Roboto-Medium' }}>Yesterday</Text>
                    <IndividualNotification />
                    <IndividualNotification />
                    <IndividualNotification />
                    <Text style={{ marginHorizontal: 10, marginVertical: 13, fontSize: 18, color: 'black', fontFamily: 'Roboto-Medium' }}>Last 7 days</Text>
                    <IndividualNotification />
                    <IndividualNotification />
                    <IndividualNotification />
                    <IndividualNotification />
                    <IndividualNotification />
                    <IndividualNotification />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}