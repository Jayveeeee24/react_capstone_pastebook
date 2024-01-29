import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, FlatList, Keyboard, SafeAreaView, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Searchbar, TextInput } from "react-native-paper";
import SearchBar from "react-native-dynamic-search-bar";
import { useFriend } from "../../context/FriendContext";
import { Storage } from "../../utils/Config";
import { IndividualSearch } from "../../components/IndividualSearch";

interface SearchTabProps {
    navigation: any;
    route: any;
}

export const SearchTab: React.FC<SearchTabProps> = ({ navigation, route }) => {
    const { getAllFriendsByUserId } = useFriend();

    const [users, setUsers] = useState<any>([]);

    const [searchQuery, setSearchQuery] = useState('');


    //useEffect
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <View style={{ marginHorizontal: 15 }}>
                    <SearchBar
                        placeholder="Search"
                        onPress={() => setSearchQuery('')}
                        onChangeText={setSearchQuery}
                        style={{ backgroundColor: '#ECEFF1', width: '100%' }}
                        autoFocus />
                </View>
            ),
            headerTitle: '',
            headerStyle: {
                borderBottomWidth: 0.8,
                borderBottomColor: 'lightgray'
            },
        });
    }, [navigation, searchQuery]);

    useEffect(() => {
        getFriendsByUserId();
    }, [])

    //api functions
    const getFriendsByUserId = async () => {
        const userId = Storage.getString('userId');
        if (userId) {
            try {
                const result = getAllFriendsByUserId ? await getAllFriendsByUserId(userId) : undefined;
                if (await result) {
                    console.log(result)
                    setUsers(result);
                }
            } catch (error: any) {
                console.error("Error fetching photos:", error.response);
            }
        }
    }

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <ScrollView>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={{ flex: 1, flexDirection: "column", marginTop: 10 }}>
                        <FlatList
                            data={users}
                            renderItem={({ item }) => <IndividualSearch key={item.id} item={item} navigation={navigation} route={route} />}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false} />
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </SafeAreaView>
    );
}