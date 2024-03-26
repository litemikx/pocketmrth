/** View Events page **/
/* Display list of events from the api resonse CallApiMethod.getServerEvents */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import CallApiMethod from '../CallApiMethod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetConnections from './GetConnections';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import ChannelStackedBarChart from '../Chart/StackedBarChart';
import EventModal from '../Info/EventModal';
import SystemModal from '../Info/SystemModal';
import { TextInput } from 'react-native-gesture-handler';

import { AntDesign, Entypo, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { shadow } from 'react-native-paper';

const colors = require('../../assets/colors.json');
const fonts = require('../../assets/fonts.json');
const size = require('../../assets/size.json');

const ViewEvents = ({ route }) => {

	//const navigation = useNavigation();

	const { connectionDetails } = route.params;
	const [events, setEvents] = useState([]);
	const [loadingStatus, setLoadingStatus] = useState(false);
	const [search, setSearch] = useState('');
	const [sort, setSort] = useState(true);
	const [users, setUsers] = useState([]);

	const [isModalVisible, setModalVisible] = useState(false);
	const [event, setEvent] = useState({});

	const [loadingMoreStatus, setLoadingMoreStatus] = useState(false);

	const [searchingNow, setSearchingNow] = useState(false);
	const [searchResults, setSearchResults] = useState(false);

	useEffect(() => {
		setEvents([]);
		getEvents();
		setUsers([]);
		getUsers();
	}
	, []);

	useFocusEffect(
		React.useCallback(() => {
			setEvents([]);
			getEvents();
			setUsers([]);
			getUsers();
		}, [])
	);

	// get users
	async function getUsers() {
		try {
			var users = await CallApiMethod.getServerUsers(connectionDetails);
			var arry = (users.list && users.list.user) && users.length > 1 ? users.list.user : (users.list && users.list.user) && users.length == 1 ? [users.list.user] : [];
			setUsers([...arry]);
		} catch (error) {
			console.log('error:', error);
		}
	}

	async function getEvents(query) {
		try {
			setLoadingStatus(true);
			var evnts = await CallApiMethod.getServerEvents(connectionDetails, query);
			var arry = (evnts.list && evnts.list.event) && evnts.list.event.length > 1 ? evnts.list.event : (evnts.list && evnts.list.event) && evnts.list.event.length == 1 ? [evnts.list.event] : [];
			setEvents([...arry]);
			setLoadingStatus(false);
		} catch (error) {
			console.log('error:', error);
			setLoadingStatus(false);
		}
	}

	// Display event summary
	const getEventSummary = (event) => {
		toggleModal();
		setEvent(event);
	}

	const toggleModal = () => {
		setModalVisible(!isModalVisible);
	};

	// Convert event date to readable date time
	const convertDate = (date) => {
		return new Date(date).toString();
	}

	// get username based on user id
	const getUsername = (userId) => {
		var user = users.find(user => user.id === userId);
		return user ? user.username : '';
	}

	/** Search event by event.name by passing query "name=?" in the api */
	async function searchEvents() {
		try {
			setSearchingNow(true);
			var query = "name=" + search + "&limit=20";
			getEvents(query);
			setSearchingNow(false);
		} catch (error) {
			console.log('error:', error);
		}
	}

	// Call getEvents function with offset 20 as a param when scroll to the end of the list
	async function loadMoreEvents() {
		try {
			var query = "offset=" + (events.length) + "&limit=20";
			if (search) {
				query = query + "&name=" + search;
			}
			setLoadingMoreStatus(true);
			var evnts = await CallApiMethod.getServerEvents(connectionDetails, query);
			var arry = (evnts.list && evnts.list.event) && evnts.list.event.length > 1 ? evnts.list.event : (evnts.list && evnts.list.event) && evnts.list.event.length == 1 ? [evnts.list.event] : [];
			setEvents([...events, ...arry]);
			setLoadingMoreStatus(false);
		
		} catch (error) {
			console.log('error:', error);
			setLoadingMoreStatus(false);
		}
	}

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.title}>{connectionDetails.name}</Text>
			<View style={styles.searchContainer}>
				<TextInput
					style={styles.searchInput}
					placeholder='Search by Event Name'
					onChangeText={text => setSearch(text)}
					value={search}
					onSubmitEditing={() => searchEvents()}
				/>
				<MaterialCommunityIcons style={styles.searchButton} onPress={() => searchEvents()} name="text-box-search" size={36} color={colors.button.background} />
			</View>
			{loadingStatus || searchingNow ? <ActivityIndicator animating size="large" /> : null}

			{!loadingStatus && !searchResults && !searchingNow && search && events.length == 0 ? <Text>No Result Found</Text> : null}
			
			<FlatList
				data={events}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.channelContainer}
						onPress={() => getEventSummary(item)}
					>
						<View style={styles.txtGrp}>
							<Text>ID: {item.id}</Text>
							<Text>User: {getUsername(item.userId)} </Text>
							<Text>Name: {item.name}</Text>
							<Text>{convertDate(item.dateTime)}</Text>
						</View>
						<View style={styles.statusGrp}>
							{ item.level === 'INFORMATION' ? <AntDesign name="infocirlce" size={24} color={colors.event_status.information} /> : null }
							{ item.level === 'WARNING' ? <Entypo name="warning" size={24} color={colors.event_status.warning} /> : null }
							{ item.level === 'ERROR' ? <MaterialIcons name="error" size={28} color={colors.event_status.error} /> : null }
						</View>
					</TouchableOpacity>
				)}
			/>
			
			{events.length > 0 && !loadingMoreStatus ? <Button title="Load More" onPress={() => loadMoreEvents()} color={colors.button.background} /> : null}
			
			{loadingMoreStatus ? <ActivityIndicator animating size="large" /> : null}
			
			{event ? <EventModal style={stylesModal.modalContent} isVisible={isModalVisible} onClose={toggleModal} data={event} username={getUsername(event.userId)} date={convertDate(event.dateTime)} /> : null}

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
		fontSize: fonts.header3.size,
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
	txtGrp: {
		flex: 1, 
		flexDirection: 'column',
	},
	statusGrp: {
		flex: 1, 
		flexDirection: 'row', 
		justifyContent: 'flex-end'
	},
	searchButton : {
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 2,
		padding: 2,
	}
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

export default ViewEvents;
