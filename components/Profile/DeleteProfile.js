// Delete profile from storage "users" and associated "connections"
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

const colors = require('../../assets/colors.json');
const fonts = require('../../assets/fonts.json');

const DeleteProfile = () => {
    
        const navigation = useNavigation();
    
        const [username, setUsername] = useState('');
        const [userId, setUserId] = useState('');
        const [secretKey, setSecretKey] = useState('');
        const [password, setPassword] = useState('');
        const [success, setSuccess] = useState('');
    
        useEffect(() => {
            getProfile();
        }, []);
    
        async function getProfile() {
            try {
            
                const currentUserId = await AsyncStorage.getItem('currentUserId');
                const users = await AsyncStorage.getItem('users');
                const usersArray = JSON.parse(users);
    
                const user = usersArray.find((user) => user.id === currentUserId);
    
                setUsername(user.username);
                setUserId(user.id);
                setPassword('');
                setSecretKey(user.secretKey);
    
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        }
    
        const handleDeleteProfile = async () => {
    
            try {
                const users = await AsyncStorage.getItem('users');
                const usersArray = JSON.parse(users);
    
                var newUsers = usersArray ? usersArray.filter((user) => user.id !== userId) : [];
    
                await AsyncStorage.setItem(
                    'users',
                    JSON.stringify(newUsers),
                );
    
                // delete all connections for this user
                const connections = await AsyncStorage.getItem('connections');
                const connectionsArray = JSON.parse(connections);
                var newConns = connectionsArray ? connectionsArray.filter((conn) => conn.user_id !== userId) : [];
                await AsyncStorage.setItem(
                    'connections',
                    JSON.stringify(newConns),
                );
    
                // delete secure store credentials for this user
                await SecureStore.deleteItemAsync(userId);
    
                // clear currentUserId
                await AsyncStorage.setItem(
                    'currentUserId',
                    '',
                );
    
                // navigate to login page
                navigation.navigate('Login');
    
            } catch (error) {
                console.log(error);
            }
        };
    
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Delete Profile</Text>
                <Text style={styles.label}>Username</Text>
                <Text style={styles.text}>{username}</Text>
                <Text style={styles.label}>Password</Text>
                <Text style={styles.text}>{password}</Text>
                <Text style={styles.label}>Secret Key</Text>
                <Text style={styles.text}>{secretKey}</Text>
                <Button title="Delete Profile" onPress={handleDeleteProfile} color={colors.button.background} />
            </View>
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: colors.body.background,
            height: '100%',
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 20,
        },
        label: {
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 5,
        },
        text: {
            fontSize: 16,
            marginBottom: 20,
        },
    });

export default DeleteProfile;