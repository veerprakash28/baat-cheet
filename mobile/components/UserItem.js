import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const UserItem = ({ user, onPress, onAddFriend, isFriend }) => {
    return (
        <View style={styles.container}>
            <Image source={{ uri: user.profilePic }} style={styles.avatar} />
            <View style={styles.info}>
                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.email}>{user.email}</Text>
            </View>
            {onAddFriend && !isFriend && (
                <TouchableOpacity style={styles.addButton} onPress={() => onAddFriend(user._id)}>
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            )}
            {onPress && (
                <TouchableOpacity style={styles.chatButton} onPress={onPress}>
                    <Text style={styles.chatButtonText}>Chat</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#eee',
    },
    info: {
        flex: 1,
        marginLeft: 15,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 14,
        color: '#666',
    },
    addButton: {
        backgroundColor: '#075E54',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    chatButton: {
        backgroundColor: '#25D366',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
    },
    chatButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default UserItem;
