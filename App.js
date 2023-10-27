import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupScreen from './components/SignUp';
import LoginScreen from './components/LogIn';
import PasscodeScreen from './components/Passcode';
import AboutScreen from './components/Info/About';
import HomeDrawer from './components/Home';
import { SessionProvider } from './SessionProvider';
import * as Font from 'expo-font';
// AppLoading import
import * as SplashScreen from 'expo-splash-screen';
import AppLoading from 'expo-app-loading';

import * as Notifications from 'expo-notifications';

const colors = require('./assets/colors.json');
const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
	handleNotification: async () => ({
	  shouldShowAlert: true,
	  shouldPlaySound: true,
	  shouldSetBadge: false,
	}),
});

const styles = StyleSheet.create({
	cardStyleHeader: {
		headerMode: 'screen',
        headerTintColor: '#f7ede2',
        headerStyle: { backgroundColor: '#f28482' },
		headerShown: true
	},
	cardStyleNoHeader: {
		headerMode: 'screen',
        headerTintColor: '#f7ede2',
        headerStyle: { backgroundColor: '#f28482' },
		headerShown: false
	}
});

const App = () => {
	// state to keep track of whether fonts are loaded or not
	const [appIsReady, setAppIsReady] = useState(false);

	const notificationListener = useRef();
	const responseListener = useRef();

	useEffect(() => {
		async function prepareResources() {
			try {
				// load font async
				await Font.loadAsync({
					'MajorMonoDisplay-Regular': require('./assets/fonts/MajorMonoDisplay/MajorMonoDisplay-Regular.ttf')
				});
			} catch (e) {
				console.warn(e);
			} finally {
				// Tell the app that the fonts have been loaded
				setAppIsReady(true);
			}
		}
		
		prepareResources();
	}, []);

	useEffect(() => {
		notificationListener.current = Notifications.addNotificationReceivedListener(noti => {
			console.log(noti);
		});
	
		responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
			console.log(response);
		});
	
		(() => {
			Notifications.removeNotificationSubscription(notificationListener.current);
			Notifications.removeNotificationSubscription(responseListener.current);
		})();
        
    }, []);

	if (appIsReady) {
		return (
			<SessionProvider>
				<NavigationContainer>
					<Stack.Navigator initialRouteName="Login" screenOptions={styles.cardStyleHeader}>
						<Stack.Screen options={styles.cardStyleHeader} name="Login" component={LoginScreen} />
						<Stack.Screen options={styles.cardStyleHeader} name="Passcode" component={PasscodeScreen} />
						<Stack.Screen options={styles.cardStyleHeader} name="Signup" component={SignupScreen} />
						<Stack.Screen options={styles.cardStyleHeader} name="About" component={AboutScreen} />
						<Stack.Screen options={styles.cardStyleNoHeader} name="Home" component={HomeDrawer} />
					</Stack.Navigator>
				</NavigationContainer>
			</SessionProvider>
		)
	} else {
		return (
			<AppLoading />
		);
	}
};

export default App;
