import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import CallApiMethod from '../CallApiMethod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetConnections from './GetConnections';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import ChannelStackedBarChart from '../Chart/StackedBarChart';
import ChannelModal from '../Info/ChannelModal';
import SystemModal from '../Info/SystemModal';
import { TextInput } from 'react-native-gesture-handler';

import { Ionicons, AntDesign, FontAwesome, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { clickProps } from 'react-native-web/dist/cjs/modules/forwardedProps';

const colors = require('../../assets/colors.json');
const fonts = require('../../assets/fonts.json');

const ViewConnection = ({ route }) => {

	const navigation = useNavigation();

	const { connectionDetails } = route.params;
	const [channelsSummary, setChannelsSummary] = useState([]);
	const [undeployedChannelList, setUndeployedChannelList] = useState([]);
	const [errorMsg, setErrorMsg] = useState('');
	const [deleteMsg, setDeleteMsg] = useState('');
	const [channel, setChannelInfo] = useState(null);

	const [isModalVisible, setModalVisible] = useState(false);

	// set system info
	const [system, setSystemInfo] = useState(null);
	const [isSystemModalVisible, setSystemModalVisible] = useState(false);

	// sort by name
	const [sort, setSort] = useState(true);

	// loadingStatus
	const [loadingStatus, setLoadingStatus] = useState(false);

	useEffect(() => {
		// reset values
		setErrorMsg('');
		setDeleteMsg('');
		setChannelInfo(null);
		setSystemInfo(null);
		setChannelsSummary([]);
		setUndeployedChannelList([]);

		performApiCall();

	}, []);

	useFocusEffect(
		React.useCallback(() => {
			// reset values
			setErrorMsg('');
			setDeleteMsg('');
			setChannelInfo(null);
			setSystemInfo(null);
			setChannelsSummary([]);
			setUndeployedChannelList([]);

			performApiCall();
		}, [])
	);

	// Refresh the page when the user pulls down finger
	const onRefresh = React.useCallback(() => {
		setErrorMsg('');
		setDeleteMsg('');
		setChannelInfo(null);
		setSystemInfo(null);
		setChannelsSummary([]);
		setUndeployedChannelList([]);

		performApiCall();

	}, []);



	async function performApiCall() {
		try {

			setLoadingStatus(true);

			const channelStats = await CallApiMethod.getAllChannelStatuses(connectionDetails);

			// filter based on key state not "UNDEPLOYED"
			const deployedChannels = channelStats.list.dashboardStatus.filter((channel) => channel.state !== 'UNDEPLOYED');
			const undeployedChannels = channelStats.list.dashboardStatus.filter((channel) => channel.state === 'UNDEPLOYED');

			setChannelsSummary(deployedChannels);
			setUndeployedChannelList(undeployedChannels);

			setLoadingStatus(false);

		} catch (error) {
			setErrorMsg(error.message);
			setLoadingStatus(false);
		};
	}

	async function deleteConnection() {
		try {

			var conns = await GetConnections();
			var newConns = conns.filter((conn) => conn.id !== connectionDetails.id);
			await AsyncStorage.setItem('connections', JSON.stringify(newConns));
			// Delete credentials in the SecureStore
			await SecureStore.deleteItemAsync(connectionDetails.id);
			setDeleteMsg('Connection deleted');
			navigation.navigate('Main Connection');
		} catch (error) {
			console.error('Error deleting connection:', error);
		}
	}

	const confirmDelete = () => {
		Alert.alert(
			"Confirm Delete",
			"Are you sure you want to delete this Connection?",
			[
				{
					text: "No",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel"
				},
				{ text: "Yes", onPress: () => deleteConnection() }
			]
		);
	};


	// Edit Connection
	const handleEditConnection = () => {
		navigation.navigate('Edit Connection', { connectionDetails });
	};

	// View Events
	const handleViewEvents = (connectionDetails) => {
		navigation.navigate('View Events', { connectionDetails });
	};

	// View Channel Info
	const getChannelInfo = (channelRaw) => {

		const channelInfo = {};

		channelInfo['name'] = channelRaw.name;
		channelInfo['id'] = channelRaw.channelId;
		channelInfo['state'] = channelRaw.state;
		channelInfo['stats'] = [];

		channelRaw.statistics.entry.map((stat) => {
			var labelKey = Object.keys(stat)[0];
			var labelValue = stat[labelKey];

			var statKey = Object.keys(stat)[1];
			var statValue = stat[statKey];


			channelInfo['stats'].push({ [labelValue]: statValue });

		});
		channelInfo['stats'].push({ 'QUEUED': channelRaw.queued });

		setChannelInfo(channelInfo);
		toggleModal();
	}

	const toggleModal = () => {
		setModalVisible(!isModalVisible);
	};

	const toggleSystemModal = () => {
		setSystemModalVisible(!isSystemModalVisible);
	};

	const getSystemInfo = (connection) => {
		return async () => {
			toggleSystemModal();
			const systemInfoRaw = await CallApiMethod.getSystemInfo(connection);
			const systemInfoStats = await CallApiMethod.getSystemStats(connection);

			const systemInfo = {};

			if (systemInfoRaw["com.mirth.connect.model.SystemInfo"] == null) {
				setSystemInfo(null);
				Alert.alert(
					"Error",
					"Unable to get system info",
					[
						{
							text: "Ok",
							onPress: () => console.log("Cancel Pressed"),
							style: "cancel"
						}
					]
				);
			} else {
				systemInfo['info'] = systemInfoRaw["com.mirth.connect.model.SystemInfo"];
				systemInfo['stats'] = systemInfoStats["com.mirth.connect.model.SystemStats"];
				systemInfo['id'] = connection.id;

				setSystemInfo(systemInfo);
				
			}
		}
	}

	// toggle sort function for deployed channels by name ascending or descending
	const toggleSort = () => {
		if (!sort) {
			// sort by name ascending
			setChannelsSummary(channelsSummary.sort((a, b) => (a.name > b.name) ? 1 : -1));
			setSort(true);
		} else {
			// sort by name descending
			setChannelsSummary(channelsSummary.sort((a, b) => (a.name < b.name) ? 1 : -1));
			setSort(false);
		}
	}

	// search function for deployed channels and unedeployed channels
	const [searchQuery, setSearchQuery] = useState('');

	const searchChannels = (text) => {
		if (text == '') {
			performApiCall();
		} else {
			setChannelsSummary(channelsSummary.filter((channel) => channel.name.toLowerCase().includes(text.toLowerCase())));
			setUndeployedChannelList(undeployedChannelList.filter((channel) => channel.name.toLowerCase().includes(text.toLowerCase())));
		}
	}

	useEffect(() => {
		searchChannels(searchQuery);
	}, [searchQuery]);


	return (
		<ScrollView contentContainerStyle={styles.container}>

			<View style={{ flexDirection: 'row' }}>
				<Text style={styles.label}>Name:</Text>
				<Text style={styles.content}> {connectionDetails.name}</Text>
				<View style={styles.iconGrp}>
					<TouchableOpacity style={styles.iconBtn} onPress={getSystemInfo(connectionDetails)}>
						<AntDesign name="infocirlce" size={26} color={colors.bar.system} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.iconBtn} onPress={() => handleViewEvents(connectionDetails)}>
						<SimpleLineIcons name="event" size={26} color={colors.button.background} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.iconBtn} onPress={() => confirmDelete()}>
						<AntDesign name="delete" size={26} color={colors.button.background} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.iconBtn} onPress={() => handleEditConnection()}>
						<FontAwesome name="edit" size={26} color={colors.button.background} />
					</TouchableOpacity>
				</View>

			</View>
			<Text><Text style={styles.label}>Host:</Text><Text style={styles.content}> {connectionDetails.host}</Text></Text>


			<View style={styles.searchContainer}>
				<TextInput
					style={styles.searchInput}
					placeholder="Search"
					value={searchQuery}
					onChangeText={text => setSearchQuery(text)}
				/>
				<TouchableOpacity style={styles.sortButton} onPress={toggleSort}>
					{sort ?
						<FontAwesome name="sort-alpha-asc" size={24} color={colors.button.background} />
						: <FontAwesome name="sort-alpha-desc" size={24} color={colors.button.background} />
					}
				</TouchableOpacity>
			</View>
			<SystemModal style={stylesModal.modalContent} isVisible={isSystemModalVisible} onClose={toggleSystemModal} data={system} />
			
			{!loadingStatus && channelsSummary && channelsSummary.length > 0 ? <Text style={styles.label}>Deployed:</Text> : null}
			{/* Display other connection details here */}
			{loadingStatus ? <Text>Loading...</Text> 
			: !loadingStatus && channelsSummary && channelsSummary.length > 0 ? (
				<View style={styles.connectionList}>
					{channelsSummary.map((item) => (
						<TouchableOpacity
							key={item.channelId}
							style={styles.connectionItem}
							onPress={() => {
								getChannelInfo(item);
							}}
						>
							<View style={styles.channelContainer}>
								<Text>Name: {item.name}</Text>
								<Text>Status: {item.state}</Text>
								<ChannelStackedBarChart data={item} />
							</View>
						</TouchableOpacity>
					))}
				</View>
			) : !loadingStatus && channelsSummary.length == 0 ? <Text>No deployed channel found.</Text>
			: !loadingStatus && errorMsg ? <Text>Something went wrong.</Text>
			: null}

			{!loadingStatus && undeployedChannelList.length > 0 ? <Text style={styles.label}>Undeployed:</Text> : null}
			{loadingStatus ? <Text>Loading...</Text> 
			: !loadingStatus && undeployedChannelList && undeployedChannelList.length > 0 ? (
				<View>
					{undeployedChannelList.map((item) => (
						<TouchableOpacity
							key={item.channelId}
							style={styles.connectionItem}
							onPress={() => {
								getChannelInfo(item);
							}}
						>
							<View style={styles.channelContainer}>
								<Text>Name: {item.name}</Text>
								<Text>Status: {item.state}</Text>
							</View>
						</TouchableOpacity>
					))}
				</View>
			) : !loadingStatus && undeployedChannelList.length == 0 ? <Text>No undeployed channel found.</Text> 
			: !loadingStatus && errorMsg ? <Text>Something went wrong.</Text>
			: null}
			<Text>{'\n'}</Text>

			{deleteMsg ? <Text>{deleteMsg}</Text> : null}

			{channel ? <ChannelModal style={stylesModal.modalContent} isVisible={isModalVisible} onClose={toggleModal} data={channel} connection={connectionDetails} onRefresh={onRefresh} /> : null}

		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		padding: 20,
		fontSize: fonts.body.size,
		backgroundColor: colors.body.background
	},
	title: {
		fontSize: fonts.header2.size,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	label: {
		fontSize: fonts.label.size,
		fontWeight: fonts.label.weight,
	},
	content: {
		fontSize: fonts.body.size,
	},
	iconGrp: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	iconBtn: {
		marginLeft: 10,
		padding: 2
	},
	channelContainer: {
		borderBlockColor: 'black',
		backgroundColor: colors.items.background,
		padding: 10,
		marginBottom: 10,
	},
	searchContainer: {
		flexDirection: 'row',
		marginTop: 10,
		marginBottom: 10,
	},
	searchInput: {
		flex: 1,
		width: '80%',
		marginBottom: 10,
		padding: 5,
		borderWidth: 1,
		borderColor: colors.input.border,
		color: colors.input.text,
		borderRadius: 5,
	},
	sortButton: {
		marginLeft: 10,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderRadius: 5,
		padding: 5,
		marginBottom: 10,
	},

});

const stylesModal = StyleSheet.create({
	modalContent: {
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 10,
		width: '90%',
		// scrollable
		minHeight: 300,
		// centered
		alignSelf: 'center',
		justifyContent: 'center',
		// shadow
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
	}
});

export default ViewConnection;
