import BottomSheet from "@gorhom/bottom-sheet";
import { FlatList, Image, Text, TouchableOpacity, TextInput, View, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { IndividualComment } from "../IndividualComment";
import { RefObject, useCallback, useMemo, useState } from "react";
import { Colors, globalStyles } from "../../utils/GlobalStyles";
import { Images } from "../../utils/Images";
import { useToast } from "react-native-toast-notifications";
import { useComment } from "../../context/CommentContext";

interface CommentBottomSheetProps {
    comments: any;
    profilePicture: any;
    selectedPoster: any;
    selectedPostId: string;
    onGetComments: (postId: string) => Promise<any>;
    getPosts: () => void;

    commentBottomSheetRef: RefObject<BottomSheet>;
    isCommentBottomSheetVisible: boolean;
    setIsCommentBottomSheetVisible: (isVisible: boolean) => void;
    navigation: any;
    route: any;
}

export const CommentBottomSheet: React.FC<CommentBottomSheetProps> = ({ comments, profilePicture, selectedPoster, selectedPostId, onGetComments, getPosts, commentBottomSheetRef, isCommentBottomSheetVisible, setIsCommentBottomSheetVisible, navigation, route }) => {
    const toast = useToast();
    const { addComment } = useComment();

    const [commentContent, setCommentContent] = useState('');

    const snapPoints = useMemo(() => ['45%', '95%'], []);
    const handleCommentSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            setIsCommentBottomSheetVisible(false);
        }
    }, []);

    const onAddComment = async () => {
        if (commentContent.trim()) {
            try {
                const result = addComment ? await addComment(commentContent, selectedPostId) : undefined;
                if (result) {
                    onGetComments(selectedPostId);
                    getPosts();
                }
                setCommentContent('');
            } catch (error: any) {
                toast.show("An unexpected error occurred", { type: 'danger' });
                console.log(error);
            }
        }
    }

    return (
        <>
            <BottomSheet
                ref={commentBottomSheetRef}
                index={isCommentBottomSheetVisible ? 0 : -1}
                snapPoints={snapPoints}
                onChange={handleCommentSheetChanges}
                enablePanDownToClose
                style={styles.bottomSheetContainer}>
                <View style={{ flex: 1 }}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>Comments</Text>
                    </View>

                    <View style={styles.inputCommentContainer}>
                        <View style={styles.inputCommentSubContainer}>
                            <Image
                                source={
                                    profilePicture ? { uri: profilePicture } : Images.sample_avatar_neutral
                                }
                                resizeMode="cover"
                                style={styles.inputCommentImage} />

                            <TextInput
                                placeholder={selectedPoster ? `Add a comment for ${selectedPoster.firstName.toLowerCase().replace(/\s/g, '')}.${selectedPoster.lastName.toLowerCase()} ...` : ``}
                                style={[globalStyles.textDefaults, styles.inputCommentText]}
                                value={commentContent}
                                onChangeText={setCommentContent}
                                placeholderTextColor={Colors.placeholderColor} />

                            <TouchableOpacity onPress={onAddComment}>
                                <MaterialCommunityIcons name="send" size={26} color={Colors.primaryBrand} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ flex: 1, marginVertical: 20 }}>
                        {comments.length > 0 ? (
                            <FlatList
                                data={comments}
                                renderItem={({ item }) => <IndividualComment comment={item} navigation={navigation} route={route} />}
                                keyExtractor={(item) => item.id}
                                showsVerticalScrollIndicator={false} />
                        ) : (
                            <View style={styles.noCommentsContainer}>
                                <Text style={styles.noCommentsHeaderText}>No comments yet</Text>
                                <Text style={styles.noCommentsSubHeaderText}>Start the conversation.</Text>
                            </View>
                        )}
                    </View>
                </View>
            </BottomSheet>
        </>
    );
}

const styles = StyleSheet.create({
    bottomSheetContainer: {
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        shadowRadius: 20,
        shadowColor: 'black',
        elevation: 20,
        zIndex: 1,
    },
    headerContainer: {
        flex: 0,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.2,
        paddingTop: 20,
        paddingBottom: 10
    },
    headerText: {
        textAlign: 'center',
        fontSize: 16,
        color: 'black',
        fontWeight: '500'
    },
    inputCommentContainer: {
        flex: 0,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.2
    },
    inputCommentSubContainer: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 5,
        gap: 10,
        alignItems: "center",
    },
    inputCommentImage: {
        aspectRatio: 1,
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: Colors.orange
    },
    inputCommentText: {
        fontSize: 15,
        flex: 1,
        backgroundColor: 'transparent'
    },
    noCommentsContainer: {
        flex: 1, 
        alignItems: "center", 
        marginTop: 50
    },
    noCommentsHeaderText: {
        color: 'black', 
        fontWeight: '700', 
        fontSize: 22
    },
    noCommentsSubHeaderText: {
        color: '#263238', 
        fontWeight: '500', 
        fontSize: 15
    }

});