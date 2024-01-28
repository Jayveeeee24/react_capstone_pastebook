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
    const { getAllNotifications } = useNotification();

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
            if (result) {
                // for (let i = 0; i < result.length; i++) {
                //     console.log(result[i].notifier);
                // }
                    console.log(result[0].notifiedDate);


                setNotifications(result);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    }
    //scrollviews
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
                setLoading(false);
            }, 1000);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <FlatList
                data={notifications}
                renderItem={({ item }) => (
                    <IndividualNotification key={item.id} notification={item} navigation={navigation} route={route} />
                )}
                keyExtractor={(item) => item.id}
                // numColumns={3}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                showsVerticalScrollIndicator={false}
                // maxToRenderPerBatch={10}
                // updateCellsBatchingPeriod={100}
                // initialNumToRender={10}
                ListHeaderComponent={() => (
                    <View>
                        <TouchableOpacity style={{ flexDirection: "row", marginHorizontal: 20, justifyContent: "flex-end", alignItems: "center" }}>
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

        </SafeAreaView>
    );
}