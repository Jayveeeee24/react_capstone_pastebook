import { useContext } from "react";
import { Button, Image, SafeAreaView, Text, TouchableNativeFeedback, View } from "react-native";
import { AuthContext } from "../../../context/AuthContext";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Images } from "../../../utils/Images";
import { useToast } from "react-native-toast-notifications";

interface SettingsScreenProps {
    navigation: any;
    route: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation, route }) => {
    const toast = useToast();

    const { logout } = useContext(AuthContext);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, flexDirection: "column" }}>
                <View style={{ backgroundColor: 'white' }}>
                    <View style={{ justifyContent: "space-between", flexDirection: "row", paddingHorizontal: 15, paddingVertical: 10 }}>
                        <Text>Your Account</Text>
                        <Image source={Images.logo_wide_dark} resizeMode="contain" style={{ width: 70, height: 25 }} />
                    </View>

                    <TouchableNativeFeedback onPress={() => navigation.navigate('EditProfile')}>
                        <View style={{ paddingHorizontal: 15, paddingVertical: 10, flexDirection: "row", alignItems: "center" }}>
                            <MaterialCommunityIcons name="account-circle-outline" size={34} color={'black'} style={{ flex: 0 }} />
                            <View style={{ marginStart: 10, alignSelf: "center", flex: 1 }}>
                                <Text style={{ fontSize: 16, color: 'black', fontFamily: 'Roboto-Medium' }}>Personal Details</Text>
                                <Text style={{ fontFamily: 'Roboto-Medium', color: 'gray' }}>Name, bio, gender, birthdate</Text>
                            </View>
                            <MaterialIcons name="arrow-forward-ios" size={20} color={'black'} style={{ flex: 0 }} />
                        </View>
                    </TouchableNativeFeedback>

                    <TouchableNativeFeedback onPress={() => navigation.navigate('EditEmail')}>
                        <View style={{ paddingHorizontal: 15, paddingVertical: 10, flexDirection: "row", alignItems: "center" }}>
                            <MaterialCommunityIcons name="email-check-outline" size={34} color={'black'} style={{ flex: 0 }} />
                            <View style={{ marginStart: 10, alignSelf: "center", flex: 1 }}>
                                <Text style={{ fontSize: 16, color: 'black', fontFamily: 'Roboto-Medium' }}>Email</Text>
                                <Text style={{ fontFamily: 'Roboto-Medium', color: 'gray' }}>Email Address linked to your account</Text>
                            </View>
                            <MaterialIcons name="arrow-forward-ios" size={20} color={'black'} style={{ flex: 0 }} />
                        </View>
                    </TouchableNativeFeedback>

                    <TouchableNativeFeedback onPress={() => navigation.navigate('EditPassword')}>
                        <View style={{ paddingHorizontal: 15, paddingVertical: 10, flexDirection: "row", alignItems: "center" }}>
                            <MaterialCommunityIcons name="lock-outline" size={34} color={'black'} style={{ flex: 0 }} />
                            <View style={{ marginStart: 10, alignSelf: "center", flex: 1 }}>
                                <Text style={{ fontSize: 16, color: 'black', fontFamily: 'Roboto-Medium' }}>Password</Text>
                                <Text style={{ fontFamily: 'Roboto-Medium', color: 'gray' }}>Protect your account</Text>
                            </View>
                            <MaterialIcons name="arrow-forward-ios" size={20} color={'black'} style={{ flex: 0 }} />
                        </View>
                    </TouchableNativeFeedback>
                </View>

                <View style={{ backgroundColor: 'white', marginTop: 10 }}>
                    <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
                        <Text>Logout Settings</Text>
                    </View>
                    <TouchableNativeFeedback onPress={async () => {
                        const success = logout ? await logout() : undefined;

                        if (success) {
                            navigation.navigate('Login');
                        } else {
                            toast.show("Logout error, please try again", {type: 'warning'});
                        }
                    }}>
                        <View style={{ paddingHorizontal: 15, paddingVertical: 10, flexDirection: "row", alignItems: "center" }}>
                            <MaterialCommunityIcons name="logout" size={34} color={'#EF5350'} style={{ flex: 0 }} />
                            <View style={{ marginStart: 10, alignSelf: "center", flex: 1 }}>
                                <Text style={{ fontSize: 16, color: '#EF5350', fontFamily: 'Roboto-Medium' }}>Log out</Text>
                            </View>
                            <MaterialIcons name="arrow-forward-ios" size={20} color={'#EF5350'} style={{ flex: 0 }} />
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        </SafeAreaView>
    );
}