import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import UserItem from '../components/UserItem';
import { Feather } from '@expo/vector-icons';

const FriendsScreen = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const { authAxios } = useAuth();

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = async () => {
        try {
            const { data } = await authAxios.get('/users/friends');
            setFriends(data.friends);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!search) return;
        setSearching(true);
        try {
            const { data } = await authAxios.get(`/users/search?search=${search}`);
            setSearchResults(data);
        } catch (error) {
            console.error(error);
        } finally {
            setSearching(false);
        }
    };

    const addFriend = async (friendId) => {
        try {
            await authAxios.post('/users/add-friend', { friendId });
            Alert.alert("Success", "Friend added!");
            fetchFriends();
            setSearchResults([]);
            setSearch('');
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Failed to add friend");
        }
    };

    const startChat = async (userId, username) => {
        try {
            const { data } = await authAxios.post('/chats', { userId });
            navigation.navigate('Chat', { chatId: data._id, name: username });
        } catch (error) {
            console.error(error);
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
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search users..."
                    value={search}
                    onChangeText={setSearch}
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity onPress={handleSearch}>
                    <Feather name="search" size={24} color="#075E54" />
                </TouchableOpacity>
            </View>

            {searching ? (
                <ActivityIndicator style={{ marginTop: 20 }} color="#075E54" />
            ) : searchResults.length > 0 ? (
                <View style={{ flex: 1 }}>
                    <Text style={styles.sectionTitle}>Search Results</Text>
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <UserItem
                                user={item}
                                onAddFriend={addFriend}
                                isFriend={friends.some(f => f._id === item._id)}
                            />
                        )}
                    />
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <View style={styles.friendHeader}>
                        <Text style={styles.sectionTitle}>My Friends</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('CreateGroup')}>
                            <Text style={styles.linkText}>Create Group</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={friends}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <UserItem
                                user={item}
                                onPress={() => startChat(item._id, item.username)}
                            />
                        )}
                        ListEmptyComponent={<Text style={styles.emptyText}>No friends yet. Search to add some!</Text>}
                    />
                </View>
            )}
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
    searchContainer: {
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eee',
        marginRight: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 15,
        backgroundColor: '#f5f5f5',
    },
    friendHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingRight: 15,
    },
    linkText: {
        color: '#075E54',
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#888',
        fontSize: 16,
    },
});

export default FriendsScreen;
