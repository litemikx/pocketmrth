import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import * as Crypto from 'expo-crypto';
import { ScrollView } from 'react-native-gesture-handler';

const colors = require('../../assets/colors.json');
const fonts = require('../../assets/fonts.json');

const AddConnection = () => {

	const navigation = useNavigation();

	const [name, setName] = useState('');
	const [host, setHost] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	
	// custom header for http request
	const [header, setHeader] = useState('');

	const [success, setSuccess] = useState('');

	const [errorMsg, setErrorMsg] = useState('');

	const handleAddConnection = async () => {

		var uuid = Crypto.randomUUID();
		const currentUserId = await AsyncStorage.getItem('currentUserId');
		// validate that username and password are not empty
		if (name === '' && host === '' && username === '' && password === '') {
			setErrorMsg('All fields are required.');
			return;
		} else {
			try {
				const connection = {
					id: uuid,
					user_id: currentUserId,
					name,
					host,
					header
				};
				const connections = await AsyncStorage.getItem('connections');
				const connectionsArray = connections ? JSON.parse(connections) : [];
				connectionsArray.push(connection);
				await AsyncStorage.setItem(
					'connections',
					JSON.stringify(connectionsArray),
				);

				// save connection uuid, username and password to secure store
				await SecureStore.setItemAsync(uuid, JSON.stringify({ username, password }));
				setSuccess(true);
				
			} catch (error) {
				console.log(error);
			}
		}
	};

	const handleSaveConnection = () => {
		// clear set data form
		setName('');
		setHost('');
		setHeader('');
		setUsername('');
		setPassword('');
		setSuccess('');
		setErrorMsg('');
		navigation.navigate('Add Connection');
	}

	return (
		<ScrollView contentContainerStyle={styles.container}> 
		{ success == '' ?
			<>
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
				value={password}
				secureTextEntry
			/>

			<TextInput
				style={styles.input}
				placeholder="Additional Header as JSON. Ex. { x-device-id: 123456789 }"
				onChangeText={setHeader}
				value={header}
				multiline={true}
				numberOfLines={4}
			/>

			<Button title="Save" onPress={handleAddConnection} color={colors.button.background} />
			{errorMsg !== '' ? <Text style={{ color: colors.error.text }}>{errorMsg}</Text> : null}

			<Text style={styles.description}>
				Note: Add details of your Mirth Connect Client API here.
				Information are saved locally in your device. Username and password are saved securely using Expo's Secure Store.
			</Text>
		</>
		: success == false ?
			<>
				<Text>Saving Connection...</Text>
			</>

		: success == true ? 
			<>
				<Text style={styles.header}>Connection Added</Text>
				<Button title="Close" onPress={handleSaveConnection} color={colors.button.background} />
			</> 
		: null 
		}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
        fontSize: fonts.body.size,
        flexGrow: 1,
		padding: 20,
		backgroundColor: colors.body.background,
		alignItems: 'center'
	},
	input: {
		width: '80%',
		marginBottom: 10,
		padding: 10,
		borderWidth: 1,
		borderColor: 'gray',
	},
	description: {
		fontSize: fonts.body.size,
		padding: 20,
		marginBottom: 10,
	},
	header: {
		fontSize: fonts.header3.size,
	}
});

export default AddConnection;
