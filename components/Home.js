import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect, DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ConnectionScreen from './Connection/Connection';
import AddConnectionScreen from './Connection/AddConnection';
import ViewConnectionScreen from './Connection/ViewConnection';
import EditConnectionScreen from './Connection/EditConnection';
import GetConnections from './Connection/GetConnections';
import ViewEvents from './Connection/ViewEvents';
import ProfileScreen from './Profile/Profile';
import EditProfileScreen from './Profile/EditProfile';
import DeleteProfileScreen from './Profile/DeleteProfile';
import LogOutScreen from './LogOut';
import AboutScreen from './Info/About';
import HelpScreen from './Info/Help';

import ViewChannelMessagesScreen from './Channel/ViewChannelMessages';

import CallApiMethod from './CallApiMethod';
import ServerPieChart from './Chart/PieChart';
import ConnectionBarChart from './Chart/BarChart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSession } from '../SessionProvider';
import * as Network from 'expo-network';

import NotificationAlertStatusModal from './Info/NotificationAlertStatusModal';
import RefreshAlert from './Alert/RefreshAlert';

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';

const colors = require('../assets/colors.json');
const fonts = require('../assets/fonts.json');

const BottomTabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const MoreDrawer = createDrawerNavigator();


const ConnectionStack = () => {
	return (
		<Stack.Navigator screenOptions={styles.cardStyleNoHeader}>
			<Stack.Screen name="Main Connection" component={ConnectionScreen} />
			<Stack.Screen name="Add Connection" component={AddConnectionScreen} />
			<Stack.Screen name="View Connection" component={ViewConnectionScreen} />
			<Stack.Screen name="Edit Connection" component={EditConnectionScreen} />
			<Stack.Screen name="View Events" component={ViewEvents} />
			<Stack.Screen name="View Error Messages" component={ViewChannelMessagesScreen} />
		</Stack.Navigator>
	);
};

const ProfileStack = () => {
	return (
		<Stack.Navigator screenOptions={styles.cardStyleNoHeader}>
			<Stack.Screen name="Main Profile" component={ProfileScreen} />
			<Stack.Screen name="Edit Profile" component={EditProfileScreen} />
			<Stack.Screen name="Delete Profile" component={DeleteProfileScreen} />
		</Stack.Navigator>
	);
};

const EmptyScreen = () => <View style={{ flex: 1, backgroundColor: colors.body.background }} />;

const MoreDrawerContent = (props) => {
	// Navigate to hidden tabs inside HomeTabs so the bottom bar remains visible.
	// Using nested navigation: drawer → 'Home Tabs' → specific tab screen.
	const goTo = (screen) => {
		props.navigation.closeDrawer();
		props.navigation.navigate('Home Tabs', { screen });
	};
	return (
		<DrawerContentScrollView {...props} contentContainerStyle={styles.moreDrawerContent}>
			<DrawerItem
				label="Help"
				labelStyle={styles.moreDrawerLabel}
				onPress={() => goTo('Help')}
			/>
			<DrawerItem
				label="About"
				labelStyle={styles.moreDrawerLabel}
				onPress={() => goTo('About')}
			/>
			<DrawerItem
				label="Log Out"
				labelStyle={styles.moreDrawerLabel}
				onPress={() => goTo('Log Out')}
			/>
		</DrawerContentScrollView>
	);
};

const HomeTabs = () => {
	const insets = useSafeAreaInsets();
	const tabBarBottomPadding = Math.max(insets.bottom, 8);
	const tabBarHeight = 56 + tabBarBottomPadding;

	return (
		<BottomTabs.Navigator
			screenOptions={{
				tabBarActiveTintColor: '#f28482',
				tabBarInactiveTintColor: '#999',
				tabBarStyle: {
					backgroundColor: '#f7ede2',
					borderTopColor: '#e0d0c0',
					borderTopWidth: 1,
					paddingTop: 8,
					paddingBottom: tabBarBottomPadding,
					paddingHorizontal: 10,
					height: tabBarHeight,
				},
				tabBarItemStyle: {
					paddingVertical: 4,
					marginHorizontal: 4,
					borderRadius: 10,
				},
				tabBarIconStyle: {
					marginBottom: 2,
				},
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: '600',
					marginBottom: 2,
				},
				headerShown: false,
			}}
		>
			<BottomTabs.Screen
				name="Dashboard"
				component={HomeScreen}
				options={{
					tabBarLabel: 'Dashboard',
					tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart" size={size} color={color} />,
					headerShown: false,
				}}
			/>
			<BottomTabs.Screen
				name="Connections"
				component={ConnectionStack}
				options={{
					tabBarLabel: 'Connections',
					tabBarIcon: ({ color, size }) => <MaterialIcons name="storage" size={size} color={color} />,
					headerShown: false,
				}}
			/>
			<BottomTabs.Screen
				name="Profile"
				component={ProfileStack}
				options={{
					tabBarLabel: 'Profile',
					tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
					headerShown: false,
				}}
			/>
			<BottomTabs.Screen
				name="More"
				component={EmptyScreen}
				options={{
					tabBarLabel: 'More',
					tabBarIcon: ({ color, size }) => <Ionicons name="menu" size={size} color={color} />,
					headerShown: false,
				}}
				listeners={({ navigation }) => ({
					tabPress: (e) => {
						e.preventDefault();
						navigation.getParent()?.dispatch(DrawerActions.openDrawer());
					},
				})}
			/>
			{/* Hidden tabs for More options — keep bottom bar visible on these screens */}
			<BottomTabs.Screen
				name="Help"
				component={HelpScreen}
				options={{ tabBarButton: () => null, tabBarItemStyle: { display: 'none' }, headerShown: false }}
			/>
			<BottomTabs.Screen
				name="About"
				component={AboutScreen}
				options={{ tabBarButton: () => null, tabBarItemStyle: { display: 'none' }, headerShown: false }}
			/>
			<BottomTabs.Screen
				name="Log Out"
				component={LogOutScreen}
				options={{ tabBarButton: () => null, tabBarItemStyle: { display: 'none' }, headerShown: false }}
			/>
		</BottomTabs.Navigator>
	);
};

const HomeBottomTabs = () => {
	return (
		<MoreDrawer.Navigator
			initialRouteName="Home Tabs"
			drawerContent={(props) => <MoreDrawerContent {...props} />}
			screenOptions={{
				drawerPosition: 'right',
				drawerType: 'front',
				overlayColor: 'rgba(0, 0, 0, 0.25)',
				drawerStyle: styles.moreDrawer,
				drawerActiveTintColor: '#f28482',
				drawerInactiveTintColor: '#333',
				drawerLabelStyle: styles.moreDrawerLabel,
				headerShown: false,
			}}
		>
			<MoreDrawer.Screen
				name="Home Tabs"
				component={HomeTabs}
				options={{
					drawerItemStyle: { display: 'none' },
					headerShown: false,
				}}
			/>
		</MoreDrawer.Navigator>
	);
};

const HomeScreen = () => {
	const { checkSession } = useSession();
	const insets = useSafeAreaInsets();
	const [totalConnections, setTotalConnections] = useState(0);
	const [totalConnectionsUp, setTotalConnectionsUp] = useState(0);
	// create array of connection with stats 
	const [connectionsStats, setConnectionsStats] = useState([]);

	const [loadingItems, setLoadingItems] = useState(false);
	const [loadingServers, setLoadingServers] = useState(false);

	const navigation = useNavigation();
	const navigationRef = useRef(navigation);
	const checkSessionRef = useRef(checkSession);

	const [isRegistered, setIsRegistered] = React.useState(false);
	const [backgroundStatus, setBackgroundStatus] = React.useState(null);

	// set modal for notification alert status
	const [isNotificationAlertStatusModalVisible, setNotificationAlertStatusModalVisible] = useState(false);
	const isRefreshingRef = useRef(false);

	const BACKGROUND_FETCH_TASK = 'push-notification-alert';

	useEffect(() => {
		navigationRef.current = navigation;
	}, [navigation]);

	useEffect(() => {
		checkSessionRef.current = checkSession;
	}, [checkSession]);


	const refreshDashboard = React.useCallback(async () => {
		if (isRefreshingRef.current) {
			return;
		}

		isRefreshingRef.current = true;
		try {
			const loggedin = await checkSessionRef.current();
			if (!loggedin) {
				navigationRef.current.navigate('Login');
				return;
			}

			const networkState = await Network.getNetworkStateAsync();
			if (networkState.isConnected !== true) {
				alert('Network state: ' + JSON.stringify(networkState));
			}

			setConnectionsStats([]);
			setTotalConnections(0);
			setTotalConnectionsUp(0);
			setLoadingItems(false);
			setLoadingServers(false);

			const conns = await getConnections();
			const res = await getConnectionStats(conns);
			if (res) {
				setConnectionsStats(res);
			}

			setLoadingItems(true);
			setLoadingServers(true);
			RefreshAlert(true);
			await checkStatusAsync();
		} finally {
			isRefreshingRef.current = false;
		}
	}, []);

	useFocusEffect(
		React.useCallback(() => {
			refreshDashboard();
		}, [refreshDashboard])
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
				let upCount = 0;
				var promise_responses = await Promise.all(
					conns.map(async (conn) => {
						var res = await CallApiMethod.getServerStatus(conn);

						if (res) {
							upCount += 1;

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
				setTotalConnectionsUp(upCount);
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
	};

	const toggleNotificationAlertStatusInfoModal = () => {
		setNotificationAlertStatusModalVisible(!isNotificationAlertStatusModalVisible);
	};

	return (
		<ScrollView contentContainerStyle={{ alignItems: 'center', flexGrow: 1, backgroundColor: colors.body.background, paddingTop: Math.max(insets.top + 8, 20) }}>
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
							<AntDesign name="info-circle" size={26} color={colors.bar.system} />
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
	moreDrawer: {
		backgroundColor: colors.body.background,
		width: 260,
	},
	moreDrawerLabel: {
		fontSize: fonts.label.size,
		fontWeight: '600',
	},
});

export default HomeBottomTabs;
