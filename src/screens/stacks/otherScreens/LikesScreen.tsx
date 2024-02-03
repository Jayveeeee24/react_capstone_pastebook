import { SafeAreaView, Text, View } from "react-native";
import SearchBar from "react-native-dynamic-search-bar";
import { IndividualFollower } from "../../../components/IndividualFollower";

export const LikesScreen = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flex: 1 }}>
                <View style={{ marginBottom: 20, marginHorizontal: 10 }}>
                    <SearchBar
                        placeholder="Search"
                        onPress={() => {  }}
                        onChangeText={() => {}}
                        style={{ backgroundColor: '#ECEFF1', width: '100%', marginBottom: 10 }} />
                    <IndividualFollower />
                    <IndividualFollower />
                    <IndividualFollower />
                    <IndividualFollower />
                    <IndividualFollower />
                    <IndividualFollower />
                </View>
            </View>
        </SafeAreaView>
    );
}