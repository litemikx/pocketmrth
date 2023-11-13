import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import ConnectionScreen from './Connection/Connection';
import AddConnectionScreen from './Connection/AddConnection';
import ViewConnectionScreen from './Connection/ViewConnection';
import EditConnectionScreen from './Connection/EditConnection';
import ProfileScreen from './Profile/Profile';
import EditProfileScreen from './Profile/EditProfile';
import DeleteProfileScreen from './Profile/DeleteProfile';
import LogOutScreen from './LogOut';
import AboutScreen from './Info/About';
import GetConnections from './Connection/GetConnections';
import CallApiMethod from './CallApiMethod';
import ServerPieChart from './Chart/PieChart';
import ConnectionBarChart from './Chart/BarChart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSession } from '../SessionProvider';
import * as Network from 'expo-network';

import NotificationAlertStatusModal from './Info/NotificationAlertStatusModal';

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import { AntDesign } from '@expo/vector-icons';

const colors = require('../assets/colors.json');
const fonts = require('../assets/fonts.json');

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const ConnectionStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen options={styles.cardStyleNoHeader} name="Main Connection" component={ConnectionScreen} />
			<Stack.Screen options={styles.cardStyleHeader} name="Add Connection" component={AddConnectionScreen} />
			<Stack.Screen options={styles.cardStyleHeader} name="View Connection" component={ViewConnectionScreen} />
			<Stack.Screen options={styles.cardStyleHeader} name="Edit Connection" component={EditConnectionScreen} />
		</Stack.Navigator>
	);
};

const ProfileStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen options={styles.cardStyleNoHeader} name="Main Profile" component={ProfileScreen} />
			<Stack.Screen options={styles.cardStyleHeader} name="Edit Profile" component={EditProfileScreen} />
			<Stack.Screen options={styles.cardStyleHeader} name="Delete Profile" component={DeleteProfileScreen} />
		</Stack.Navigator>
	);
};


const HomeDrawer = () => {
	return (
		<Drawer.Navigator screenOptions={{ drawerStyle: styles.drawerStyle, drawerActiveBackgroundColor: '#f28482', drawerActiveTintColor: 'white' }}>
			<Drawer.Screen options={styles.cardStyleHeader} name="Main" component={HomeScreen} />
			<Drawer.Screen options={styles.cardStyleHeader} name="Connection" component={ConnectionStack} />
			<Drawer.Screen options={styles.cardStyleHeader} name="Profile" component={ProfileStack} />
			<Drawer.Screen options={styles.cardStyleHeader} name="Log Out" component={LogOutScreen} />
			<Drawer.Screen options={styles.cardStyleHeader} name="About" component={AboutScreen} />
		</Drawer.Navigator>
	);
};

const HomeScreen = () => {
	const { setSession, checkSession } = useSession();
	const [totalConnections, setTotalConnections] = useState(0);
	const [totalConnectionsUp, setTotalConnectionsUp] = useState(0);
	// create array of connection with stats 
	const [connectionsStats, setConnectionsStats] = useState([]);

	const [loadingItems, setLoadingItems] = useState(false);
	const [loadingServers, setLoadingServers] = useState(false);

	const navigation = useNavigation();

	const [isRegistered, setIsRegistered] = React.useState(false);
	const [backgroundStatus, setBackgroundStatus] = React.useState(null);

	// set modal for notification alert status
	const [isNotificationAlertStatusModalVisible, setNotificationAlertStatusModalVisible] = useState(false);

	const BACKGROUND_FETCH_TASK = 'push-notification-alert';


	useEffect(() => {
		// reset values
		setConnectionsStats([]);

		// reset values
		setTotalConnections(0);
		setTotalConnectionsUp(0);

		setLoadingItems(false);
		setLoadingServers(false);

		// get connections
		getConnections().then(async (conns) => {
			var res = await getConnectionStats(conns);
			if (res) {
				setConnectionsStats(res);
				setLoadingItems(true);
				setLoadingServers(true);
			} else {
				setLoadingItems(true);
				setLoadingServers(true);
			}

		});

		(async () => {
			var loggedin = await checkSession();
			if (!loggedin) {
				navigation.navigate('Login');
			} else {
				// Check if there is network connection
				const networkState = await Network.getNetworkStateAsync();
				if (networkState.isConnected === true) {
					console.log('Network state: ' + JSON.stringify(networkState));
				} else {
					alert('Network state: ' + JSON.stringify(networkState));
				}
			}
		})();
	}, []);

	useFocusEffect(
		React.useCallback(() => {
			// reset values
			setConnectionsStats([]);
			setTotalConnections(0);
			setTotalConnectionsUp(0);
			setLoadingItems(false);
			setLoadingServers(false);

			getConnections().then(async (conns) => {
				var res = await getConnectionStats(conns);
				if (res) {
					setConnectionsStats(res);
					setLoadingItems(true);
					setLoadingServers(true);
				} else {
					setLoadingItems(true);
					setLoadingServers(true);
				}

			});
		}, [])
	);

	async function getConnections() {
		try {
			var conns = await GetConnections();
			if (conns) {
				setTotalConnections(conns.length);
				return conns;
			}
		} catch (error) {
			console.log('error:', error);
		}
	}

	async function getConnectionStats(conns) {
		try {
			if (conns) {
				var promise_responses = await Promise.all(
					conns.map(async (conn) => {
						var res = await CallApiMethod.getServerStatus(conn);

						if (res) {
							setTotalConnectionsUp(totalConnectionsUp + 1);

							var stats = await CallApiMethod.getAllChannelsStatistics(conn);
							if (stats) {
								var stats = stats.list.channelStatistics;
								var json = { id: conn.id, name: conn.name, stats: stats, connection: conn };
								return json;
							} else {
								var json = { id: conn.id, name: conn.name, stats: false, connection: conn };
								return json;
							}

						} else {
							var json = { id: conn.id, name: conn.name, stats: false, connection: conn };
							return json;
						}
					})
				);

				// handle resolve promise
				var arry = promise_responses.filter(function (el) {
					return el != null;
				});
				return arry;
			}
		} catch (error) {
			console.log('error:', error);
			return false;
		}
	}

	const checkStatusAsync = async () => {
		const backgroundStatus = await BackgroundFetch.getStatusAsync();
		const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
		setBackgroundStatus(backgroundStatus);
		setIsRegistered(isRegistered);

		checkStatusAsync();
	};

	const toggleNotificationAlertStatusInfoModal = () => {
		setNotificationAlertStatusModalVisible(!isNotificationAlertStatusModalVisible);
	};

	React.useEffect(() => {
		checkStatusAsync();
	}, []);

	return (
		<ScrollView contentContainerStyle={{ alignItems: 'center', flexGrow: 1, backgroundColor: colors.body.background }}>
			<View style={styles.container}>
				
					<Text style={styles.header}>Dashboard</Text>
					<View style={styles.iconGrp}>
					{
						backgroundStatus && isRegistered ?
							<Text style={styles.iconBtn}>
								Stat Alert: Active
							</Text>
						: 
							<Text style={styles.iconBtn}>
								Stat Alert: Inactive
							</Text>
					}

						<TouchableOpacity style={styles.iconBtn} onPress={toggleNotificationAlertStatusInfoModal}>
							<AntDesign name="infocirlce" size={26} color={colors.bar.system} />
						</TouchableOpacity>
					</View>
				<Text style={styles.title}>Servers: {totalConnectionsUp} / {totalConnections}</Text>

				{totalConnections > 0 && loadingServers ? <ServerPieChart data={{ 'totalConnectionsUp': totalConnectionsUp, 'totalConnections': totalConnections }} />
					: <Text>No connections available</Text>}

				<Text style={styles.title}>Stats</Text>
				{connectionsStats && connectionsStats.length > 0 && loadingItems ?
					(
						connectionsStats.map((item) =>
							item.stats ? (
								<ConnectionBarChart key={item.id} data={item} />
							) : (
								<View style={styles.noChart} key={item.id}>
									<Text style={styles.noChartTitle}>{item.name}</Text>
									<Text style={styles.noChartMessage}>
										{'\n'}No stats available{'\n'}
									</Text>
								</View>
							)
						)
					) : loadingItems === false ? (
						<Text style={styles.connectionStatList}>Loading... </Text>
					) : <Text style={styles.connectionStatList}>No connections available</Text>}
			</View>

			<NotificationAlertStatusModal isVisible={isNotificationAlertStatusModalVisible} onClose={toggleNotificationAlertStatusInfoModal} />

		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		backgroundColor: colors.body.background,
		height: '100%',
	},
	connectionStatList: {
		width: '100%',
		alignContent: 'center',
		textAlign: 'center',
	},
	title: {
		textAlign: 'center',
		fontSize: fonts.header2.size,
		marginTop: 16,
		fontWeight: 'bold',
	},
	header: {
		textAlign: 'center',
		fontSize: fonts.header1.size,
		marginTop: 16,
		fontWeight: 'bold',
	},
	content: {
		textAlign: 'center',
		fontSize: fonts.body.size,
		backgroundColor: colors.body.background
	},
	drawerStyle: {
		backgroundColor: colors.navigation.background,
	},
	cardStyleHeader: {
		headerMode: 'screen',
		headerTintColor: '#f7ede2',
		headerStyle: { backgroundColor: '#f28482' },
		headerShown: true,
	},
	cardStyleNoHeader: {
		headerMode: 'screen',
		headerTintColor: '#f7ede2',
		headerStyle: { backgroundColor: '#f28482' },
		headerShown: false
	},
	noChart: {
		borderBottomColor: 'black',
		alignContent: 'center',
		textAlign: 'center',
	},
	noChartTitle: {
		fontSize: fonts.header3.size,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	noChartMessage: {
		fontSize: fonts.body.size,
		borderBottomColor: 'black',
		textAlign: 'center',
		color: 'grey',
	},
	iconGrp: {
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	iconBtn: {
		fontSize: fonts.body.size,
		marginLeft: 10,
		padding: 2
	},
});

export default HomeDrawer;
