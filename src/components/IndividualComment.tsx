import { Image, Text, View, TouchableOpacity } from "react-native";
import { Images } from "../utils/Images";
import { convertToRelativeTime } from "../utils/HelperFunctions";
import { Colors } from "../utils/GlobalStyles";

interface IndividualCommentProps {
    comment: any;
    navigation: any;
    route: any;
}

export const IndividualComment: React.FC<IndividualCommentProps> = ({comment, navigation, route}) => {
    return (
        <View style={{ marginHorizontal: 10, flexDirection: "row", width: '100%', marginVertical: 8 }}>
            <Image source={comment.commenter.photo.photoImageURL ? {uri : comment.commenter.photo.photoImageURL} : Images.sample_avatar_neutral} resizeMode="cover" style={{ aspectRatio: 1, width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: Colors.orange }} />
            <View style={{ flexDirection: "column", marginStart: 15 }}>
                <View style={{flexDirection: "row"}}>
                    <TouchableOpacity >
                        <Text style={{ fontSize: 16, fontWeight: '700', color: 'black', alignSelf: "flex-start" }}>{`${comment.commenter.firstName.toLowerCase().replace(/\s/g, '')}.${comment.commenter.lastName.toLowerCase()}`}</Text>
                    </TouchableOpacity>
                    <Text style={{fontSize: 14, color: 'black', marginStart: 10, alignSelf: "center"}}>{convertToRelativeTime(comment.dateCommented)}</Text>
                </View>
                <Text style={{ fontSize: 14, color: 'black' }}>{comment.commentContent}</Text>
            </View>
        </View>
    );
}