import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Image source={{ uri: user.profilePic }} style={styles.avatar} />
                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.email}>{user.email}</Text>
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Status</Text>
                    <Text style={styles.infoValue}>Available</Text>
                </View>
                <View style={[styles.infoItem, { borderBottomWidth: 0 }]}>
                    <Text style={styles.infoLabel}>Member Since</Text>
                    <Text style={styles.infoValue}>{new Date(user.createdAt).toLocaleDateString()}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#fff',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    email: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    infoContainer: {
        marginTop: 20,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    infoItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    infoLabel: {
        fontSize: 14,
        color: '#888',
        marginBottom: 5,
    },
    infoValue: {
        fontSize: 18,
        color: '#333',
    },
    logoutButton: {
        marginTop: 40,
        backgroundColor: '#fff',
        padding: 15,
        alignItems: 'center',
    },
    logoutText: {
        color: '#d32f2f',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default ProfileScreen;
