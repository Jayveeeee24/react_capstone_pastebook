import { useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import SearchBar from "react-native-dynamic-search-bar";
import { IndividualFollower } from "../../../components/IndividualFollower";

export const FollowersScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
                <View style={{ marginHorizontal: 10 }}>
                    <SearchBar
                        placeholder="Search"
                        onPress={() => setSearchQuery('')}
                        onChangeText={setSearchQuery}
                        style={{ backgroundColor: '#ECEFF1', width: '100%' }}/>
                </View>
                <View style={{flexDirection: "column", marginTop: 15}}>
                    <IndividualFollower />
                    <IndividualFollower />
                    <IndividualFollower />
                    <IndividualFollower />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}