import { useEffect, useState } from "react";
import { Image, SafeAreaView, StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { images } from "../../utils/Images";
import { black } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import {ProfileTabView} from "../tabViews/ProfileTabView";

interface ProfileTabProps {
    navigation: any;
    route: any;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ navigation, route }) => {
    const [dynamicTitle, setDynamicTitle] = useState("Profile Tab");


    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <View style={{ flexDirection: "row", alignItems: "center", marginStart: 10 }}>
                    <MaterialIcons name="lock-outline" size={24} color="black" />
                    <Text style={{ marginStart: 8, fontSize: 22, color: 'black', fontWeight: '700', alignItems: "center" }}>artemis.jayvee</Text>
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity>
                    <View style={{ flexDirection: "row", marginEnd: 12 }}>
                        <SimpleLineIcons name="settings" size={20} color="black" />
                    </View>
                </TouchableOpacity>
            ),

            headerTitle: '',
            headerStyle: {
                elevation: 0,
                shadowOpacity: 0,
            },
        });
    }, [dynamicTitle, navigation]);


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flexDirection: "column", backgroundColor: 'white', flex: 1 }}>
                <View style={{paddingHorizontal: 20, paddingVertical: 15 }}>
                    <View style={{ flexDirection: "row", gap: 20, }}>
                        <Image source={images.sample_avatar} resizeMode="cover" style={{ flex: 1, aspectRatio: 1, width: 60, height: 60 }} />
                        <TouchableOpacity style={{ flex: 1, justifyContent: "center" }}>
                            <Text style={styles.textMetricsTitle}>19</Text>
                            <Text style={styles.textMetricsSub}>Posts</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, justifyContent: "center" }}>
                            <Text style={styles.textMetricsTitle}>62</Text>
                            <Text style={styles.textMetricsSub}>Followers</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, justifyContent: "center" }}>
                            <Text style={styles.textMetricsTitle}>12</Text>
                            <Text style={styles.textMetricsSub}>Albums</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ color: 'black', fontFamily: 'Roboto-Medium', marginTop: 5 }}>
                        <Text style={{ fontWeight: '700' }}>John Bernard Tinio</Text>
                        <Text>{'\n'}Full-time Bug Sprayer{'\n'}Aspiring Photographer</Text>
                    </Text>
                    <TouchableOpacity style={{ borderWidth: 0.8, borderColor: 'gray', marginTop: 8, padding: 5 }}>
                        <Text style={{ color: 'black', fontFamily: 'Roboto-Medium', fontWeight: '700', textAlign: "center" }}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>
                <ProfileTabView />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    textMetricsTitle: {
        fontFamily: 'Roboto-Medium',
        fontSize: 20,
        textAlign: "center",
        color: 'black',
        fontWeight: '700'
    },
    textMetricsSub: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        textAlign: "center",
        color: 'black'
    }
});