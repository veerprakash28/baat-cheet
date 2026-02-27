import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '../context/AuthContext';
import ChatItem from '../components/ChatItem';

const ChatListScreen = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { user, authAxios } = useAuth();

    const fetchChats = async () => {
        try {
            const { data } = await authAxios.get('/chats');
            setChats(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchChats();

        // Refresh when screen focuses
        const unsubscribe = navigation.addListener('focus', () => {
            fetchChats();
        });
        return unsubscribe;
    }, [navigation]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchChats();
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#075E54" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={chats}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <ChatItem
                        item={item}
                        currentUser={user}
                        onPress={() => navigation.navigate('Chat', {
                            chatId: item._id,
                            name: item.isGroup ? item.groupName : item.members.find(m => m._id !== user._id)?.username
                        })}
                    />
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} color="#075E54" />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChatListScreen;
