import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    FlatList,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Image,
    ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import MessageBubble from '../components/MessageBubble';

const ChatScreen = ({ route }) => {
    const { chatId } = route.params;
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const { user, authAxios } = useAuth();
    const socket = useSocket();
    const flatListRef = useRef();

    useEffect(() => {
        fetchMessages();

        if (socket) {
            socket.emit("join chat", chatId);

            socket.on("message recieved", (newMessage) => {
                if (newMessage.chatId._id === chatId) {
                    setMessages((prev) => [...prev, newMessage]);
                }
            });

            return () => {
                socket.off("message recieved");
            };
        }
    }, [socket, chatId]);

    const fetchMessages = async () => {
        try {
            const { data } = await authAxios.get(`/messages/${chatId}`);
            setMessages(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (content, type = 'text') => {
        if (!content && type === 'text') return;

        try {
            const { data } = await authAxios.post('/messages', {
                chatId,
                content,
                messageType: type
            });

            socket.emit("new message", data);
            setMessages((prev) => [...prev, data]);
            setInput('');
        } catch (error) {
            console.error(error);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            setSending(true);
            const formData = new FormData();
            formData.append('image', {
                uri: result.assets[0].uri,
                type: 'image/jpeg',
                name: 'upload.jpg',
            });

            try {
                const { data } = await authAxios.post('/messages/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                await sendMessage(data.url, 'image');
            } catch (error) {
                console.error(error);
            } finally {
                setSending(false);
            }
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#075E54" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <Image
                source={{ uri: 'https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png' }}
                style={StyleSheet.absoluteFill}
                opacity={0.06}
            />

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <MessageBubble message={item} isMine={item.sender._id === user._id} />
                )}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            <View style={styles.inputContainer}>
                <TouchableOpacity onPress={pickImage} disabled={sending}>
                    <Feather name="image" size={24} color="#075E54" style={styles.icon} />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={input}
                    onChangeText={setInput}
                    multiline
                />
                <TouchableOpacity onPress={() => sendMessage(input)} disabled={!input.trim()}>
                    <View style={styles.sendButton}>
                        <Feather name="send" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5DDD5',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginHorizontal: 10,
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#075E54',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        paddingHorizontal: 5,
    },
});

export default ChatScreen;
