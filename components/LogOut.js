import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSession } from '../SessionProvider'; // Import the SessionContext
import { useNavigation } from '@react-navigation/native';

const colors = require('../assets/colors.json');
const fonts = require('../assets/fonts.json');

const LogoutScreen = () => {
    const navigation = useNavigation();
    const { clearSession } = useSession(); // Use the clearSession function from the context

    const handleLogout = async () => {
        try {
            await clearSession(); // Clear the user session
            // Navigate to the login screen or perform other actions
            navigation.navigate('Login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Leaving already?</Text>
            <Button title="Log Out" onPress={handleLogout} color={colors.button.background} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.body.background,
    },
    header: {
        fontSize: fonts.header3.size,
    }
});

export default LogoutScreen;
