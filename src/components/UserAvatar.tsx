import { View } from "react-native";
import { Card, Title } from "react-native-paper";
import { images } from "../utils/Images";

export const UserAvatar = (name: string, imageUrl: string) => {
    return (
        <View>
            <Card style={{ borderRadius: 30, width: 60, height: 60 }}>
                <Card.Cover source={{uri: imageUrl}} style={{ height: '100%', borderRadius: 30 }} />
            </Card>
            <View style={{ alignItems: 'center' }}>
                <Title style={{fontSize: 14, fontFamily: 'Roboto-Medium'}}>{ name }</Title>
            </View>
        </View>
    );
}