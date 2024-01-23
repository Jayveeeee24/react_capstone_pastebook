import { useEffect } from "react";
import { Text, View } from "react-native";

interface CameraProps{
    navigation: any;
    route: any;
}

export const CameraScreen: React.FC<CameraProps> = ({navigation}) => {

    return (
        <View>
            <Text onPress={() => navigation.navigate('CreatePostTab')}>haha</Text>
            
        </View>
    );
}