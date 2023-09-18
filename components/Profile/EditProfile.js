// Create a Profile component that displays the user's profile information
//
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import TwoFactorMethod from '../../TwoFactorMethod';
import * as Crypto from 'expo-crypto';
import { set } from 'react-native-reanimated';

const colors = require('../../assets/colors.json');
const fonts = require('../../assets/fonts.json');

const EditProfile = () => {

    const navigation = useNavigation();

    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [password, setPassword] = useState('');
    const [twofactor, setTwofactor] = useState(false); // [true, false
    const [initialTwofactor, setInitialTwofactor] = useState(false); // [true, false
    const [success, setSuccess] = useState('');

    const salt = process.env.EXPO_PUBLIC_SALT_PASSWORD;

    useEffect(() => {
        getProfile();
    }, []);

    async function getProfile() {
        try {

            const currentUserId = await AsyncStorage.getItem('currentUserId');
            const users = await AsyncStorage.getItem('users');
            const usersArray = JSON.parse(users);

            const user = usersArray.find((user) => user.id === currentUserId);

            setInitialTwofactor(user.twofactor);
            setUsername(user.username);
            setUserId(user.id);
            setPassword('');
            setSecretKey(user.secretKey);
            setTwofactor(user.twofactor);

        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }

    const handleEditProfile = async () => {

        try {
            // require to check password if empty
            if (password == '') {
                alert('Password is required');
                return;
            }

            const users = await AsyncStorage.getItem('users');
            const usersArray = JSON.parse(users);

            var existingUsers = usersArray ? usersArray.filter((user) => user.id !== userId) : [];

            const saltedpassword = password + salt;
            const hashedPwd = await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA256,
                saltedpassword
            );

            if (twofactor) {
                TwoFactorMethod.generateSecretKey().then((secretKey) => {
                    setSecretKey(secretKey);
                });
            } else {
                setSecretKey('');
            }

            var newUser = {
                id: userId,
                username,
                password: hashedPwd,
                secretKey,
                twofactor
            };

            existingUsers.push(newUser);

            await AsyncStorage.setItem(
                'users',
                JSON.stringify(existingUsers),
            );

            setSuccess(true);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSaveProfile = () => {
        // clear set data form
        setUsername('');
        setPassword('');
        setSecretKey('');
        setSuccess('');
        setTwofactor(false);
        navigation.navigate('Main Profile');
    }


    useEffect(() => {
        if (!initialTwofactor) {
            if (!twofactor) {
                setSecretKey('');
            } else {
                TwoFactorMethod.generateSecretKey().then((secretKey) => {
                    setSecretKey(secretKey);
                });
            }
        } else {
            setInitialTwofactor(twofactor);
        }
    }, [twofactor]);

    return (success == '' ?
        <View style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>
            <TextInput
                style={styles.input}
                placeholder='Username'
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder='Password'
                value={password}
                secureTextEntry
                onChangeText={setPassword}
            />
            <Text style={styles.title}>Two Factor Authentication</Text>
            <Switch
                trackColor={{ false: "#767577", true: "#f28482" }}
                thumbColor={twofactor ? "#f28482" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={setTwofactor}
                value={twofactor}
            />
            <Text style={styles.title}>Secret Key</Text>
            <TextInput
                style={styles.input}
                value={secretKey}
                onChangeText={setSecretKey}
            />

            <Button
                title='Save'
                onPress={() => handleEditProfile()}
                color={colors.button.background}
            />
        </View>
        :
        <View style={styles.container}>
            <Text style={styles.title}>Profile Updated</Text>
            <Button
                title='Back to Profile'
                onPress={() => handleSaveProfile()}
                color={colors.button.background}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7ede2',
        fontSize: fonts.body.size
    },
    input: {
        width: '80%',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
    },
});
export default EditProfile;