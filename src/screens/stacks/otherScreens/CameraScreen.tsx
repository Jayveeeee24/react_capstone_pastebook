import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera";

export const CameraScreen = ({ navigation, route }: any) => {

    const { hasPermission, requestPermission } = useCameraPermission()
    const [isActive, setIsActive] = useState(false);
    const camera = useRef<Camera>(null);
    const [isCameraOkay, setIsCameraOkay] = useState(true);
    const [isFlashUp, setIsFlashUp] = useState(false);

    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission]);

    useFocusEffect(
        useCallback(() => {
            setIsActive(true);
            return () => {
                setIsActive(false);
            }
        }, [])
    );

    const device = useCameraDevice('back');
    if (!device) {
        return (<Text>Camera device not found</Text>)
    }

    const onTakePicture = async () => {
        setIsCameraOkay(false);
        const photo = await camera.current?.takePhoto({ flash: isFlashUp ? 'on' : 'off' });
        if (photo) {
            const restructuredData = {
                node: {
                    group_name: [],
                    id: "1000000049",
                    image: {
                        extension: null,
                        fileSize: null,
                        filename: null,
                        height: photo?.height,
                        orientation: photo?.orientation,
                        playableDuration: null,
                        uri: `file://${photo?.path}`,
                        width: photo?.width,
                    },
                    location: null,
                    modificationTimestamp: Date.now() / 1000,
                    subTypes: [],
                    timestamp: Date.now() / 1000,
                    type: "image/jpeg",
                },
            };
            setIsCameraOkay(true);
            navigation.navigate({
                name: 'CreatePostTab',
                params: { image: restructuredData },
                merge: true,
            });
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <View style={{ position: "absolute", top: 15, zIndex: 1, left: 20 }}>
                    <TouchableOpacity style={{ width: 75, height: 65 }} onPress={() => { navigation.navigate('CreatePostTab') }}>
                        <MaterialIcons name="arrow-back-ios" size={26} color={'white'} />
                    </TouchableOpacity>
                </View>



                <Camera
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={isActive}
                    ref={camera}
                    photo={true}
                    enableZoomGesture={true} />

                <View style={{ position: "absolute", bottom: 20, alignSelf: "center" }}>
                    <TouchableOpacity style={{ width: 75, height: 65 }} onPress={onTakePicture} disabled={isCameraOkay ? false : true}>
                        <MaterialIcons name="camera" size={70} color={"white"} />
                    </TouchableOpacity>
                </View>

                <View style={{ position: "absolute", bottom: 15, left: 20, alignSelf: "flex-start" }}>
                    <TouchableOpacity style={{ width: 45, height: 55 }} onPress={() => {
                        setIsFlashUp(!isFlashUp);
                    }}>
                        <MaterialIcons name={isFlashUp ? "flash-off" : "flash-on"} size={40} color={"white"} />
                    </TouchableOpacity>
                </View>

                {/* <View style={{ position: "absolute", bottom: 15, right: 20, alignSelf: "flex-start" }}>
                    <TouchableOpacity style={{ width: 45, height: 55 }} onPress={() => {
                        device.physicalDevices
                    }}>
                        <MaterialIcons name='cameraswitch' size={40} color={"white"} />
                    </TouchableOpacity>
                </View> */}

            </View>
        </SafeAreaView>
    );
}
