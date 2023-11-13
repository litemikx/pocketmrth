// Create a Profile component that displays the user's profile information
//
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import TwoFactorMethod from '../../TwoFactorMethod';
import * as Crypto from 'expo-crypto';
import { set } from 'react-native-reanimated';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import AddBackgroundTask from '../Alert/AddBackgroundTaskAlert';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

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
    const [notification, setNotification] = useState(false); // [true, false
    const [pollTime, setPollTime] = useState(30); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    const [success, setSuccess] = useState('');

    const salt = process.env.EXPO_PUBLIC_SALT_PASSWORD;

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notificationMsg, setNotificationMsg] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        getProfile();
    }, []);

    useEffect(() => {
        if (notification) {
            // Notification
            registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
        }
    }, [notification]);

      async function registerForPushNotificationsAsync() {
        let token;
    
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
    
          });
        }
    
        if (Device.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          token = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig.extra.eas.projectId,
          });
          //console.log(token);
        } else {
          alert('Must use physical device for Push Notifications');
        }
    
        return token;
      }
    

    async function getProfile() {
        try {

            const currentUserId = await AsyncStorage.getItem('currentUserId');
            const users = await AsyncStorage.getItem('users');
            const usersArray = JSON.parse(users);

            const user = usersArray.find((user) => user.id === currentUserId);

            const defaultPollTime = user.pollTime ? user.pollTime : 30;

            setInitialTwofactor(user.twofactor);
            setUsername(user.username);
            setUserId(user.id);
            setPassword('');
            setSecretKey(user.secretKey);
            setTwofactor(user.twofactor);
            setNotification(user.notification);
            setPollTime(defaultPollTime);

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
                twofactor,
                notification,
                pollTime,
            };

            existingUsers.push(newUser);

            await AsyncStorage.setItem(
                'users',
                JSON.stringify(existingUsers),
            );

           var mins = pollTime * 60;
            await AddBackgroundTask(notification, mins);
            

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
        setNotification(false);
        setPollTime(30);
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
            <Text style={styles.title}>Credentials</Text>
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
            <Text>Secret Key</Text>
            <TextInput
                style={styles.input}
                value={secretKey}
                onChangeText={setSecretKey}
            />

            <Text style={styles.title}>Allow Background Notification Alert</Text>
            <Switch
                trackColor={{ false: "#767577", true: "#f28482" }}
                thumbColor={notification ? "#f28482" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={setNotification}
                value={notification}
            />
            <Text>Poll Time in Minutes</Text>
            <TextInput
                style={styles.input}
                value={pollTime.toString()}
                onChangeText={setPollTime}
                // type numeric
                keyboardType={'numeric'}
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
    title: {
		fontSize: fonts.label.size,
		fontWeight: fonts.label.weight,
		marginBottom: 10,
	},
});
export default EditProfile;