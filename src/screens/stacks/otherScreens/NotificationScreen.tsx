import { FlatList, RefreshControl, SafeAreaView, ScrollView, Text, View } from "react-native";
import { IndividualNotification } from "../../../components/IndividualNotification";
import { useCallback, useEffect, useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native-gesture-handler";
import axios from "axios";
import { BASE_URL } from "../../../utils/Config";
import { useNotification } from "../../../context/NotificationContext";

interface NotificationScreenProps {
    navigation: any;
    route: any;
}

export const NotificationScreen: React.FC<NotificationScreenProps> = ({ navigation, route }) => {
    const { getAllNotifications, clearAllNotifications } = useNotification();

    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [notifications, setNotifications] = useState<any>([]);


    //useEffect
    useEffect(() => {
        getNotifications();
    }, []);

    //api functions
    const getNotifications = async () => {
        try {
            const result = getAllNotifications ? await getAllNotifications() : undefined;
            if (result && Array.isArray(result)) {
                // for (let i = 0; i < result.length; i++) {
                //     console.log(result[i].notifier);
                // }
                // console.log(result[0].notifiedDate);
                setNotifications(result);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
        setRefreshing(false);
    }
    const onClearNotification = async () => {
        try {
            const result = clearAllNotifications ? await clearAllNotifications() : undefined;
            if (result) {
                getNotifications();
            }
        } catch (error) {
            console.error("Error clearing notifications:", error);
        }
    }
    

    //scrollviews
    const handleRefresh = useCallback(() => {
        setRefreshing(true);

        getNotifications();
    }, []);
    const handleScroll = (event: { nativeEvent: { layoutMeasurement: any; contentOffset: any; contentSize: any; }; }) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isEndReached = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

        if (isEndReached && !loading) {
            setLoading(true);

            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            {notifications.length > 0 ? (
                <FlatList
                    data={notifications}
                    renderItem={({ item }) => (
                        <IndividualNotification key={item.id} notification={item} getNotifications={getNotifications} navigation={navigation} route={route} />
                    )}
                    keyExtractor={(item) => item.id}
                    // numColumns={3}
                    onScroll={handleScroll}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                    showsVerticalScrollIndicator={false}
                    // maxToRenderPerBatch={10}
                    // updateCellsBatchingPeriod={100}
                    // initialNumToRender={10}
                    ListHeaderComponent={() => (
                        <View>
                            <TouchableOpacity onPress={onClearNotification} style={{ display: notifications.length > 0 ? 'flex' : 'none', flexDirection: "row", marginHorizontal: 20, justifyContent: "flex-end", alignItems: "center" }}>
                                <MaterialCommunityIcons name="notification-clear-all" size={25} color={'black'} />
                                <Text style={{ color: 'black', marginStart: 5 }}>Clear all</Text>
                            </TouchableOpacity>
                            {/* <Text style={{ marginHorizontal: 10, marginVertical: 13, fontSize: 18, color: 'black', fontFamily: 'Roboto-Medium' }}>Yesterday</Text>
                    <IndividualNotification />
                    <Text style={{ marginHorizontal: 10, marginVertical: 13, fontSize: 18, color: 'black', fontFamily: 'Roboto-Medium' }}>Last 7 days</Text>
                    <IndividualNotification />
                    */}
                        </View>
                    )}
                />
            ) : (
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{ color: 'black', fontWeight: '700', fontSize: 22 }}>No Notifications yet</Text>
                    <Text style={{ color: '#263238', fontWeight: '500', fontSize: 15 }}>Interact with others.</Text>
                </View>
            )}

        </SafeAreaView>
    );
}