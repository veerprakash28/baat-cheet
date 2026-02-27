import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const MessageBubble = ({ message, isMine }) => {
    return (
        <View style={[styles.container, isMine ? styles.mine : styles.other]}>
            {message.messageType === 'image' ? (
                <Image source={{ uri: message.content }} style={styles.image} resizeMode="cover" />
            ) : (
                <Text style={[styles.text, isMine ? styles.mineText : styles.otherText]}>
                    {message.content}
                </Text>
            )}
            <Text style={[styles.time, isMine ? styles.mineTime : styles.otherTime]}>
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        maxWidth: '80%',
        padding: 10,
        borderRadius: 15,
        marginVertical: 5,
        marginHorizontal: 10,
    },
    mine: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
        borderBottomRightRadius: 2,
    },
    other: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderBottomLeftRadius: 2,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    text: {
        fontSize: 16,
    },
    mineText: {
        color: '#000',
    },
    otherText: {
        color: '#000',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    time: {
        fontSize: 10,
        marginTop: 5,
        alignSelf: 'flex-end',
    },
    mineTime: {
        color: '#555',
    },
    otherTime: {
        color: '#888',
    },
});

export default MessageBubble;
