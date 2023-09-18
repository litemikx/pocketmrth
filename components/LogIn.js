import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { useSession } from '../SessionProvider';
import logo from '../assets/logo.png';
import * as Font from 'expo-font';
const colors = require('../assets/colors.json');
const salt = process.env.EXPO_PUBLIC_SALT_PASSWORD;

const LogIn = ({ navigation }) => {
	const { setSession, checkSession } = useSession();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	
	useEffect(() => {
		var loggedin = checkSession();
		if(loggedin) {
			navigation.navigate('Home');
		} else {
			navigation.navigate('Login');
		}
	}, []);

	const handleLogin = async () => {
		try {
			var getUsers = await AsyncStorage.getItem('users');
			var users = JSON.parse(getUsers);

			if (users === null) {
				setError('Username not found.');
				await AsyncStorage.removeItem('currentUserId');

			} else {
				const saltedpassword = password + salt;
				// Hash the combined data using SHA-256 algorithm
				const hashedPwd = await Crypto.digestStringAsync(
					Crypto.CryptoDigestAlgorithm.SHA256,
					saltedpassword
				);

				var checkUserPwd;

				// filter users array by username and password
				var user = users.filter((item) => item.username === username && item.password === hashedPwd);

				if (user.length > 0) {
					checkUserPwd = true;
				} else {
					checkUserPwd = false;
				}
				
				if (checkUserPwd) {
					setError('');
					// create token based on username and password using Crypto
					const token = await Crypto.digestStringAsync(
						Crypto.CryptoDigestAlgorithm.SHA256,
						username + password
					);

					if(user[0].twofactor) {
						setSession(token);
						await AsyncStorage.setItem('currentUserId', user[0].id);
						navigation.navigate('Passcode');
					} else {
						setSession(token);
						await AsyncStorage.setItem('currentUserId', user[0].id);
						navigation.navigate('Home');
					}
					
				} else {
					setError('Invalid username or password.');
					await AsyncStorage.removeItem('currentUserId');
				}
			}
		} catch (error) {
			console.error('Error retrieving login details:', error);
		}
	};

	return (
		<View style={styles.container}>
			<Image source={logo} style={{ width: 200, height: 200 }} />
			<Text style={styles.title}>PocketMRTH</Text>
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
			<Button title="Login" onPress={handleLogin} color={colors.button.background} />
			<Text style={styles.errorText}>{error}</Text>
			<TouchableOpacity onPress={() => navigation.navigate('Signup')}>
				<Text style={styles.signupLink}>Don't have an account? Sign up</Text>
			</TouchableOpacity>

			{/* About Page */}
			<TouchableOpacity onPress={() => navigation.navigate('About')}>
				<Text style={styles.signupLink}>About</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	title: {
		fontSize: 32,
		fontFamily: 'MajorMonoDisplay-Regular',
		width: '100%',
		textAlign: 'center',
	},
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: colors.body.background,
		width: '100%'
	},
	input: {
		width: '80%',
		marginBottom: 10,
		padding: 10,
		borderWidth: 1,
		borderColor: colors.input.border,
		color: colors.input.text,
	},
	errorText: {
		color: colors.error.text,
		marginTop: 10,
	},
	signupLink: {
		marginTop: 10,
		color: colors.link,
		textDecorationLine: 'underline',
	},
	
});

export default LogIn;
