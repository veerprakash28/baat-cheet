import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Feather } from '@expo/vector-icons';

const CreateGroupScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [friends, setFriends] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
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

    const toggleMember = (id) => {
        if (selectedMembers.includes(id)) {
            setSelectedMembers(prev => prev.filter(m => m !== id));
        } else {
            setSelectedMembers(prev => [...prev, id]);
        }
    };

    const handleCreate = async () => {
        if (!name || selectedMembers.length < 2) {
            Alert.alert("Error", "Please enter a group name and select at least 2 members");
            return;
        }

        setCreating(true);
        try {
            const { data } = await authAxios.post('/chats/group', {
                name,
                members: JSON.stringify(selectedMembers)
            });
            navigation.replace('Chat', { chatId: data._id, name: data.groupName });
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Failed to create group");
        } finally {
            setCreating(false);
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
            <View style={styles.header}>
                <TextInput
                    style={styles.input}
                    placeholder="Group Name"
                    value={name}
                    onChangeText={setName}
                />
            </View>

            <Text style={styles.sectionTitle}>Select Members ({selectedMembers.length})</Text>

            <FlatList
                data={friends}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {
                    const isSelected = selectedMembers.includes(item._id);
                    return (
                        <TouchableOpacity
                            style={[styles.memberItem, isSelected && styles.selectedItem]}
                            onPress={() => toggleMember(item._id)}
                        >
                            <Text style={styles.memberName}>{item.username}</Text>
                            {isSelected && <Feather name="check-circle" size={20} color="#075E54" />}
                        </TouchableOpacity>
                    );
                }}
            />

            <TouchableOpacity
                style={[styles.createButton, (creating || !name || selectedMembers.length < 2) && styles.disabledButton]}
                onPress={handleCreate}
                disabled={creating || !name || selectedMembers.length < 2}
            >
                {creating ? <ActivityIndicator color="#fff" /> : <Text style={styles.createButtonText}>Create Group</Text>}
            </TouchableOpacity>
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
    header: {
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eee',
        fontSize: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        padding: 15,
        backgroundColor: '#f5f5f5',
    },
    memberItem: {
        flexDirection: 'row',
        padding: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    selectedItem: {
        backgroundColor: '#e8f5e9',
    },
    memberName: {
        fontSize: 16,
    },
    createButton: {
        backgroundColor: '#075E54',
        padding: 15,
        margin: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    createButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CreateGroupScreen;
