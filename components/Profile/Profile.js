// Main Profile Page

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const colors = require('../../assets/colors.json');
const fonts = require('../../assets/fonts.json');

const Profile = () => {
    
        const navigation = useNavigation();
    
        const [username, setUsername] = useState('');
        const [userId, setUserId] = useState('');
        const [secretKey, setSecretKey] = useState('');
        const [password, setPassword] = useState('');
        const [twofactor, setTwofactor] = useState('');
        const [success, setSuccess] = useState('');
    
        useEffect(() => {
            getProfile();
        }, []);

        useFocusEffect(
            React.useCallback(() => {
                getProfile();
            }, [])
        );
    
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
                setTwofactor(user.twofactor);
    
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        }

        // return user details as static text
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Profile</Text>
                <Text style={styles.label}>Username</Text>
                <Text style={styles.text}>{username}</Text>
                <Text style={styles.label}>Password</Text>
                <Text style={styles.text}>****</Text>
                <Text style={styles.label}>Secret Key</Text>
                <Text style={styles.text}>{secretKey}</Text>
                <Text style={styles.label}>Two Factor</Text>
                <Text style={styles.text}>{twofactor ? 'Yes' : 'No'}</Text>
                <Button title="Edit Profile" onPress={() => navigation.navigate('Edit Profile')} color={colors.button.background}/>
                <Text>{'\n'}</Text>
                <Button title="Delete Profile" onPress={() => navigation.navigate('Delete Profile')} color={colors.button.background} />
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
    
    export default Profile;

    
        