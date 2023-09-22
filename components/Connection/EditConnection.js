

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import GetConnections from './GetConnections';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const colors = require('../../assets/colors.json');
const fonts = require('../../assets/fonts.json');

const EditConnection = ({ route }) => {

    const navigation = useNavigation();

    const { connectionDetails } = route.params;
    const [name, setName] = useState(connectionDetails.name);
    const [host, setHost] = useState(connectionDetails.host);

	// custom header for http request
	const [header, setHeader] = useState(connectionDetails.header);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [success, setSuccess] = useState('');

    useEffect(() => {
        getUsernameAndPassword();
    }, []);

    async function getUsernameAndPassword() {
        try {
            var credentials = await SecureStore.getItemAsync(connectionDetails.id);
            var username = JSON.parse(credentials).username;
            var password = JSON.parse(credentials).password;
            setUsername(username);
            setPassword(password);
        } catch (error) {
            console.error('Error getting credentials:', error);
        }
    }

    const handleEditConnection = async () => {

        var uuid = connectionDetails.id;
        const currentUserId = await AsyncStorage.getItem('currentUserId');

        try {
            const connection = {
                id: uuid,
                user_id: currentUserId,
                name,
                host,
                header
            };
            const connectionsRaw = await AsyncStorage.getItem('connections');
            const connections = JSON.parse(connectionsRaw);

            var newConns = connections ? connections.filter((conn) => conn.id !== connectionDetails.id) : [];
            
            const connectionsArray = newConns;
            
            connectionsArray.push(connection);
            await AsyncStorage.setItem(
                'connections',
                JSON.stringify(connectionsArray),
            );

            // save connection uuid, username and password to secure store
            await SecureStore.setItemAsync(uuid, JSON.stringify({ username, password }));

            setSuccess('Connection updated');
        } catch (error) {
            console.log(error);
        }
    };

    return (success == '' ?
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Name"
                onChangeText={setName}
                value={name}
            />
            <TextInput
                style={styles.input}
                placeholder="Host"
                onChangeText={setHost}
                value={host}
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                onChangeText={setUsername}
                value={username}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={setPassword}
                secureTextEntry={true}
                value={password}
            />

            <TextInput
				style={styles.input}
				placeholder="Additional Header as JSON. Ex. { x-device-id: 123456789 }"
				onChangeText={setHeader}
				value={header}
				multiline={true}
				numberOfLines={4}
			/>

            <Button title="Save" onPress={handleEditConnection} color={colors.button.background} />
            
        </View>
        : <View style={styles.container}>
            <Text>{success}</Text>
            <Button title="Back" onPress={() => navigation.navigate('Main Connection')} color={colors.button.background} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor:'#f7ede2',
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

export default EditConnection;

