import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { UserAvatar } from "../../components/UserAvatar";

export const HomeTab = ({ navigation }: any) => {
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
            <ScrollView>
                <View
                    style={[styles.friendsView, { paddingBottom: 10 }]}>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Roboto-Medium'
    },
        
    friendsView: {
        flexDirection: "row",
        gap: 15,
        borderBottomWidth: 0.8,
        paddingHorizontal: 20,
        borderBottomColor: 'lightgray'
    }
})