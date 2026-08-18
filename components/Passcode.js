import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useSession } from '../SessionProvider';
import { Buffer } from 'buffer';
import { keyDecoder, keyEncoder } from '@otplib/plugin-thirty-two';
import { Authenticator, TOTP } from '@otplib/core-async';
import { createDigest, createRandomBytes } from '@otplib/plugin-crypto-js';

// assign global variable buffer to Buffer
global.Buffer = Buffer;

const colors = require('../assets/colors.json');
const fonts = require('../assets/fonts.json');

const EnterOTP = () => {

    const navigation = useNavigation();
    const { setSession } = useSession();

    const [otp, setOtp] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        let isActive = true;

        const ensurePendingAuth = async () => {
            const pendingUserId = await AsyncStorage.getItem('pendingUserId');
            const pendingUserToken = await AsyncStorage.getItem('pendingUserToken');

            if (isActive && (!pendingUserId || !pendingUserToken)) {
                navigation.navigate('Login');
            }
        };

        ensurePendingAuth();

        return () => {
            isActive = false;
        };
    }, [navigation]);

    const verifyTotp = async (otp, secret) => {
        const auth = new Authenticator({ createDigest, keyDecoder, keyEncoder, createRandomBytes });
        const isValid = auth.verify({ token: otp, secret: secret });
        
        return isValid;
    };

    const handleEnterOTP = async () => {

        try {
            const pendingUserId = await AsyncStorage.getItem('pendingUserId');
            const users = await AsyncStorage.getItem('users');
            const usersArray = JSON.parse(users);

            if (!pendingUserId || !usersArray) {
                setSuccess(false);
                return;
            }

            const user = usersArray.find((user) => user.id === pendingUserId);
            if (!user || !user.secretKey) {
                setSuccess(false);
                return;
            }

            const isValid = await verifyTotp(otp, user.secretKey);

            if (isValid === true) {
                setSuccess(true);
            } else {
                setSuccess(false);
            }

        } catch (error) {
            console.error('Error Validating TOTP:', error);
        }
    }

    const handleContinue = async () => {
        try {
            const pendingUserId = await AsyncStorage.getItem('pendingUserId');
            const pendingUserToken = await AsyncStorage.getItem('pendingUserToken');

            if (!pendingUserId || !pendingUserToken) {
                setSuccess(false);
                navigation.navigate('Login');
                return;
            }

            await setSession(pendingUserToken);
            await AsyncStorage.setItem('currentUserId', pendingUserId);
            await AsyncStorage.multiRemove(['pendingUserId', 'pendingUserToken']);
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        } catch (error) {
            console.error('Error finalizing OTP login:', error);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter OTP</Text>
            <TextInput
                style={styles.input}
                value={otp}
                onChangeText={(text) => setOtp(text)}
                autoCapitalize="none"
                autoCorrect={false}
            />
            <Button title="Enter OTP" onPress={handleEnterOTP} color={colors.button.background} />
            {success == true ? <Text style={styles.success}>Success!</Text> : null}
            {success == false ? <Text style={styles.error}>Incorrect OTP</Text> : null}
            {success == true ? <Button title="Continue" onPress={handleContinue} color={colors.button.background} /> : null}
        </View>
    );
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.body.background
	},
	error: {
		color: colors.error.text,
		marginTop: 10,
	},
    success: {
        color: colors.success.text,
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
	
});

export default EnterOTP;