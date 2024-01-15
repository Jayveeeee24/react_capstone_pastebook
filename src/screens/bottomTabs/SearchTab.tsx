import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Keyboard, SafeAreaView, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Searchbar, TextInput } from "react-native-paper";
import SearchBar from "react-native-dynamic-search-bar";
import { IndividualSearch } from "../../components/IndividualSearch";

interface SearchTabProps {
    navigation: any;
    route: any;
}

export const SearchTab: React.FC<SearchTabProps> = ({ navigation, route }) => {
    const [searchQuery, setSearchQuery] = useState('');



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

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <ScrollView>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={{ flex: 1, flexDirection: "column", marginTop: 10 }}>
                        <IndividualSearch />
                        <IndividualSearch />
                        <IndividualSearch />
                        <IndividualSearch />
                        <IndividualSearch />
                        <IndividualSearch />
                        <IndividualSearch />
                        <IndividualSearch />
                        <IndividualSearch />
                        <IndividualSearch />
                        <IndividualSearch />
                        <IndividualSearch />
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </SafeAreaView>
    );
}