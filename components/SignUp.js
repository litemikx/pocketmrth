import React, { useEffect, useState } from 'react';
import { Switch, Modal, View, TextInput, Button, StyleSheet, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { Buffer } from 'buffer';
import { keyDecoder, keyEncoder } from '@otplib/plugin-thirty-two';
import { Authenticator, TOTP } from '@otplib/core-async';
import { createDigest, createRandomBytes } from '@otplib/plugin-crypto-js';
import TOSModal from './Info/TOSModal';
import logo from '../assets/logo.png';

const salt = process.env.EXPO_PUBLIC_SALT_PASSWORD;

const colors = require('../assets/colors.json');
const fonts = require('../assets/fonts.json');
const size = require('../assets/size.json');

const SignUp = ({ navigation }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
	const [secretKey, setSecretKey] = useState('');
	const [isModalVisible, setModalVisible] = useState(false);
	const [tosAgreed, setTOSAgreed] = useState(false);

	const toggleModal = () => {
		setModalVisible(!isModalVisible);
	};

	const handleSignup = async () => {

		try {

			// validate that username and password are not empty
			if (username === '' || password === '') {
				setErrorMsg('Username and password cannot be empty');
				return;
			} else if (!tosAgreed) {
				setErrorMsg('You must agree to the Terms of Service');
				return;
			} else {
				var uuid = Crypto.randomUUID();

				const saltedpassword = password + salt;
				const hashedPwd = await Crypto.digestStringAsync(
					Crypto.CryptoDigestAlgorithm.SHA256,
					saltedpassword
				);
				
				const user = {
					id: uuid,
					username: username,
					password: hashedPwd,
					secretKey: secretKey,
					twofactor: false,
					tosAgreed: true
				};

				// Save signup details to local storage
				const users = await AsyncStorage.getItem('users');
				const usersArray = users ? JSON.parse(users) : [];
				// find existing user on usersArray
				const existingUser = usersArray.find(
					(item) => item.username === username,
				);

				if (!existingUser) {
					usersArray.push(user);
					await AsyncStorage.setItem(
						'users',
						JSON.stringify(usersArray),
					);
					// Navigate to HomeScreen
					navigation.navigate('Login');
				} else {
					setErrorMsg('User already exists');
				}
			}
		} catch (error) {
			console.error('Error saving signup details:', error);
		}
	};

	return (
		<View style={styles.container}>
			<Image source={logo} style={{ width: 200, height: 200 }} />
			<TextInput
				placeholder="Username"
				value={username}
				onChangeText={setUsername}
				style={styles.input}
			/>
			<TextInput
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				style={styles.input}
			/>
			<Button style={styles.button} title="Show TOS" onPress={toggleModal} color={colors.button.background} />
			<TOSModal isVisible={isModalVisible} onClose={toggleModal} />
			<Switch
                trackColor={{ false: "#767577", true: "#f28482" }}
                thumbColor={tosAgreed ? "#f28482" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={setTOSAgreed}
                value={tosAgreed}
				style={styles.switch}
            />
			<Text>I agree to the Terms of Service</Text>
			<Text>{'\n'}</Text>

			<Button style={styles.button} title="Signup" onPress={handleSignup} color={colors.button.background} />
			{errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: colors.body.background
	},
	errorText: {
		color: colors.error.text,
		marginTop: 10,
	},
	input: {
		width: '80%',
		marginBottom: 10,
		padding: 10,
		borderWidth: 1,
		borderColor: colors.input.border,
		color: colors.input.text
	},
	switch: {
		transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
		paddingTop: 10,
	},
	button: {
		height: size.button.height
	}
	
});

export default SignUp;
