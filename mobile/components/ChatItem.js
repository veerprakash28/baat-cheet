import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';

const ChatItem = ({ item, onPress, currentUser }) => {
    // Determine the name and pic based on whether it's a group or 1-on-1
    const isGroup = item.isGroup;
    const otherMember = item.members.find(m => m._id !== currentUser._id);
    const title = isGroup ? item.groupName : otherMember?.username;
    const pic = isGroup ? item.groupPic : otherMember?.profilePic;

    // Get last message preview
    const lastMsgContent = item.lastMessage ? (item.lastMessage.messageType === 'image' ? '[Image]' : item.lastMessage.content) : 'No messages yet';
    const lastMsgTime = item.lastMessage ? new Date(item.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Image source={{ uri: pic }} style={styles.avatar} />
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>
                    <Text style={styles.time}>{lastMsgTime}</Text>
                </View>
                <Text style={styles.lastMessage} numberOfLines={1}>{lastMsgContent}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        alignItems: 'center',
    },
    avatar: {
        width: 55,
        height: 55,
        borderRadius: 27.5,
        backgroundColor: '#eee',
    },
    content: {
        flex: 1,
        marginLeft: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    time: {
        fontSize: 12,
        color: '#888',
    },
    lastMessage: {
        fontSize: 14,
        color: '#666',
    },
});

export default ChatItem;
