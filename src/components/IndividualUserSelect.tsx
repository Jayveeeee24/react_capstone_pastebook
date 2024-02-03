import { Image, Text, TouchableNativeFeedback, View } from "react-native";
import { Images } from "../utils/Images";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MmkvStorage } from "../utils/GlobalConfig";
import { useEffect, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";


interface IndividualUserSelectProps {
    item: any;
    setPostedUserId: (userId: string) => void;
    navigation: any;
    route: any;
    bottomSheetRef: React.RefObject<BottomSheet>;
}

export const IndividualUserSelect: React.FC<IndividualUserSelectProps> = ({ item, navigation, route, setPostedUserId, bottomSheetRef }) => {

    return (
        <View>
            <TouchableOpacity onPress={async () => {
                setPostedUserId(await item.id);
                bottomSheetRef && bottomSheetRef.current?.close();
            }}>
                <View style={{ flexDirection: 'row', width: '100%', paddingVertical: 8, paddingHorizontal: 12, alignItems: "center" }}>
                    <Image source={item.photo.photoImageURL ? { uri: item.photo.photoImageURL } : Images.sample_avatar_neutral} resizeMode="cover" style={{ aspectRatio: 1, width: 60, height: 60, borderRadius: 30 }} />
                    <View>
                        <Text style={{ fontSize: 18, fontFamily: 'Roboto-Medium', fontWeight: '900', color: 'black', marginStart: 25 }}>
                            {`${item.firstName.toLowerCase().replace(/\s/g, '')}.${item.lastName.toLowerCase()}`}
                        </Text>
                        <Text style={{ fontSize: 16, fontFamily: 'Roboto-Medium', color: 'darkgray', marginStart: 25 }}>
                            {`${item.firstName} ${item.lastName}`}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}