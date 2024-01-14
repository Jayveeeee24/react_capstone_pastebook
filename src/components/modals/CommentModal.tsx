import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

interface CommentModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export const CommentModal: React.FC<CommentModalProps> = ({ isVisible, onClose }) => {
    const [comments, setComments] = useState<string[]>([]);
    const [newComment, setNewComment] = useState<string>('');

    const addComment = () => {
        if (newComment.trim() !== '') {
            setComments((prevComments) => [...prevComments, newComment.trim()]);
            setNewComment('');
        }
    };

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            onSwipeComplete={onClose}
            swipeDirection={['down']}
            style={styles.modal}
        >
            <View style={styles.modalContent}>
                <FlatList
                    data={comments}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.commentContainer}>
                            <Text style={styles.commentText}>{item}</Text>
                        </View>
                    )}
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Add a comment..."
                        value={newComment}
                        onChangeText={(text) => setNewComment(text)}
                        onSubmitEditing={addComment}
                    />
                    <TouchableOpacity style={styles.postButton} onPress={addComment}>
                        <Text style={styles.postButtonText}>Post</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        margin: 0,
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 20,
    },
    commentContainer: {
        marginBottom: 10,
    },
    commentText: {
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    postButton: {
        marginLeft: 10,
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 5,
    },
    postButtonText: {
        color: 'white',
    },
});

