import BottomSheet from "@gorhom/bottom-sheet";
import { RefObject, useCallback, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Colors } from "../../utils/GlobalStyles";
import { Modal } from "react-native-paper";
import { useToast } from "react-native-toast-notifications";
import { usePost } from "../../context/PostContext";

interface PostOptionsBottomSheetProps {
    selectedPostId: string;

    optionsRef: RefObject<BottomSheet>;
    isOptionsVisible: boolean;
    getPosts: () => void;
    setIsOptionsVisible: (isVisible: boolean) => void;
    navigation: any;
    route: any;
}

export const PostOptionsBottomSheet: React.FC<PostOptionsBottomSheetProps> = ({selectedPostId, getPosts, optionsRef, isOptionsVisible, setIsOptionsVisible, navigation, route}) => {
    const toast = useToast();
    const { deletePost } = usePost();
    
     //modal
     const [visible, setVisible] = useState(false);
     const showModal = () => setVisible(true);
     const hideModal = () => setVisible(false);
    

    //api call
    const onDeletePost = async () => {
        try {
            const result = deletePost ? await deletePost(selectedPostId) : undefined;
            if (result) {
                toast.show('Post Deleted!', {
                    type: "success",
                });
                hideModal();
                getPosts();
            } else {
                toast.show(result, {
                    type: "warning",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.show("An unexpected error occurred", { type: 'danger' });
        }
    }

    //bottom sheet
    const snapPoints = useMemo(() => ['30%', '35%'], []);
    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            setIsOptionsVisible(false);
        }
    }, []);


    return (
        <>
            <BottomSheet
                ref={optionsRef}
                index={isOptionsVisible ? 0 : -1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                enablePanDownToClose
                style={{
                    borderTopStartRadius: 20,
                    borderTopEndRadius: 20,
                    shadowRadius: 20,
                    shadowColor: 'black',
                    elevation: 20,
                    zIndex: 1,
                }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 0, borderBottomColor: 'gray', borderBottomWidth: 0.2, paddingTop: 20, paddingBottom: 10 }}>
                        <Text style={{ textAlign: 'center', fontSize: 16, color: 'black', fontWeight: '500' }}>Post Options</Text>
                    </View>

                    <TouchableOpacity onPress={() => {
                        optionsRef && optionsRef.current?.close();

                        navigation.navigate('CreatePostTab', {
                            screen: 'CreatePost',
                            params: {
                                postId: selectedPostId,
                            }
                        })
                    }}>
                        <View style={{ paddingHorizontal: 15, paddingVertical: 10, flexDirection: "row", alignItems: "center" }}>
                            <MaterialCommunityIcons name="comment-edit-outline" size={36} color={'black'} style={{ flex: 0 }} />
                            <View style={{ marginStart: 15, alignSelf: "center", flex: 1 }}>
                                <Text style={{ fontSize: 20, color: 'black', fontFamily: 'Roboto-Medium' }}>Edit Post</Text>
                            </View>
                            <MaterialIcons name="arrow-forward-ios" size={24} color={'black'} style={{ flex: 0 }} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        optionsRef && optionsRef.current?.close();
                        showModal()
                    }}>
                        <View style={{ paddingHorizontal: 15, paddingVertical: 10, flexDirection: "row", alignItems: "center" }}>
                            <MaterialCommunityIcons name="delete-outline" size={36} color={Colors.danger} style={{ flex: 0 }} />
                            <View style={{ marginStart: 15, alignSelf: "center", flex: 1 }}>
                                <Text style={{ fontSize: 20, color: Colors.danger, fontFamily: 'Roboto-Medium' }}>Delete Post</Text>
                            </View>
                            <MaterialIcons name="arrow-forward-ios" size={24} color={Colors.danger} style={{ flex: 0 }} />
                        </View>
                    </TouchableOpacity>
                </View>
            </BottomSheet>


            <Modal
                visible={visible}
                onDismiss={hideModal}
                contentContainerStyle={{
                    flexDirection: "column",
                    backgroundColor: 'white',
                    borderRadius: 15,
                    height: 300,
                    width: 250,
                    alignSelf: "center",
                    alignItems: "flex-start",
                }}>
                <View style={{ marginBottom: 10, padding: 20 }}>
                    <Text style={{ alignSelf: "center", fontSize: 18, textAlign: "center", fontWeight: '700', color: 'black', fontFamily: 'Roboto-Medium' }}>
                        Are you sure you want to delete this post?
                    </Text>
                    <Text style={{ marginTop: 10, alignSelf: "center", textAlign: "center" }}>
                        You're requesting to delete this post. You cannot revert this back, Confirm?
                    </Text>
                </View>
                <View style={{ height: 1, backgroundColor: 'darkgray', width: '100%' }} />
                <TouchableOpacity onPress={onDeletePost} style={{ width: '100%', alignSelf: "center", paddingVertical: 15 }}>
                    <Text style={{ color: Colors.danger, fontWeight: '700', fontFamily: 'Roboto-Medium', fontSize: 16, alignSelf: "center" }}>Continue delete post</Text>
                </TouchableOpacity>
                <View style={{ height: 1, backgroundColor: 'darkgray', width: '100%', marginBottom: 10 }} />
                <TouchableOpacity onPress={hideModal} style={{ width: '100%', alignSelf: "center", marginTop: 5, flex: 0 }}>
                    <Text style={{ color: 'black', fontWeight: '700', fontFamily: 'Roboto-Medium', fontSize: 16, alignSelf: "center" }}>Cancel</Text>
                </TouchableOpacity>
            </Modal>
        </>
    );
}