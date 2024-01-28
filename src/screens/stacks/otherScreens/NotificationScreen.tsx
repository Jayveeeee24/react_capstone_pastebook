import { RefreshControl, SafeAreaView, ScrollView, Text, View } from "react-native";
import { IndividualNotification } from "../../../components/IndividualNotification";
import { useCallback, useEffect, useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native-gesture-handler";
import axios from "axios";
import { BASE_URL } from "../../../utils/Config";

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

    useEffect(() => {
        const loadNotification = async () => {
            const result = await axios.get(`${BASE_URL}/api/notification/get-notifications`);
            console.log('\n\nNOTIFICATION LIST\n\n', result.data);
            return result.data;
        }

        const loadContext = async () => {
            const notifications = await loadNotification(); 
            
            if (notifications.length > 0) {
                const contextResult = await axios.get(`${BASE_URL}/api/notification/get-notification-context/${notifications[1].id}`);
                console.log('\n\nNOTIFICATION CONTEXT \n\n', contextResult.data);
            }
        }

        loadContext();

    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }>
                <View style={{ flexDirection: "column", backgroundColor: 'white', flex: 1 }}>
                    <TouchableOpacity style={{ flexDirection: "row", marginHorizontal: 20, justifyContent: "flex-end", alignItems: "center" }}>
                        <MaterialCommunityIcons name="notification-clear-all" size={25} color={'black'} />
                        <Text style={{ color: 'black', marginStart: 5 }}>Clear all</Text>
                    </TouchableOpacity>
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