import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export const FriendRequestWithBadge = ({ onPress, badgeCount }: any) => {
    return (
        <TouchableOpacity onPress={onPress} style={{ marginRight: 10 }}>
            <MaterialCommunityIcons name="account-plus-outline" size={ 27 } color='black' />
            {badgeCount > 0 && (
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: '#1565C0',
                        borderRadius: 8,
                        width: 16,
                        height: 16,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: 'white', fontSize: 12 }}>{badgeCount}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};