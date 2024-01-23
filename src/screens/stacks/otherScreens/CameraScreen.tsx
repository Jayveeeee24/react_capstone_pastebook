import { useEffect } from "react";
import { Text, View } from "react-native";
import React from 'react';

export const CameraScreen = ({ navigation, route }: any) => {
  return (
    <View>
      <Text onPress={() => {
        navigation.navigate({
            name: 'CreatePostTab',
            params: { pickedImage: 'haha' },
            merge: true,
          });
      }}>haha</Text>
      <Text></Text>
    </View>
  );
}
