/** View Channel Messages page **/
/* Display list of messages from the api resonse CallApiMethod.getChannelErrorMessages */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import CallApiMethod from '../CallApiMethod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import MessageModal from '../Info/MessageModal';
import { TextInput } from 'react-native-gesture-handler';

import { AntDesign, Entypo, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { shadow } from 'react-native-paper';

const colors = require('../../assets/colors.json');
const fonts = require('../../assets/fonts.json');
const size = require('../../assets/size.json');

const ViewMessages = ({ route }) => {

	//const navigation = useNavigation();

	// get the connection object from the "state" (params) passed from the previous screen
	const connectionDetails = route.params.state.connection;
	const channel = route.params.state.data;
	const channelId = channel.id;
	const channelName = channel.name;

	const [messages, setMessages] = useState([]);
	const [loadingStatus, setLoadingStatus] = useState(false);
	const [search, setSearch] = useState('');
	const [sort, setSort] = useState(true);

	const [isModalVisible, setModalVisible] = useState(false);
	const [message, setMessage] = useState({});

	const [loadingMoreStatus, setLoadingMoreStatus] = useState(false);

	const [searchingNow, setSearchingNow] = useState(false);
	const [searchResults, setSearchResults] = useState(false);

	useEffect(() => {
		setMessages([]);
		var query = "status=ERROR&error=true&includeContent=true&limit=20";
		getMessages(query);
	}
	, []);

	useFocusEffect(
		React.useCallback(() => {
			setMessages([]);
			var query = "status=ERROR&error=true&includeContent=true&limit=20";
			getMessages(query);
		}, [])
	);

	async function getMessages(query) {
		try {
			
			setLoadingStatus(true);
			var msgs = await CallApiMethod.getChannelMessages(connectionDetails, channelId, query);
			var arry = (msgs.list && msgs.list.message) && msgs.list.message.length > 1 ? msgs.list.message : (msgs.list && msgs.list.message) && msgs.list.message.length == 1 ? [msgs.list.message] : [];
			setMessages([...arry]);
			setLoadingStatus(false);
		} catch (error) {
			console.log('error:', error);
			setLoadingStatus(false);
		}
	}


	// Display message summary
	const getMessageSummary = (message) => {
		toggleModal();
		setMessage(message);
	}

	const toggleModal = () => {
		setModalVisible(!isModalVisible);
	};

	// Converge receivedDate to readable date time
	const convertreceivedDate = (receivedDate) => {
    if (!receivedDate || !receivedDate.time) return '';
		const date = new Date(receivedDate.time);
		
		return date.toString(); 
	};

	/** Search message by message.name by passing query "name=?" in the api */
	async function searchMessages() {
		try {
			setSearchingNow(true);
			var query = "&responseContentSearch=" + search + "&status=ERROR&error=true&includeContent=true&limit=20";
			getMessages(query);
			setSearchingNow(false);
		} catch (error) {
			console.log('error:', error);
		}
	}

	// Call getMessages function with offset 20 as a param when scroll to the end of the list
	async function loadMoreMessages() {
		try {
			var query = "offset=" + (messages.length) + "&status=ERROR&error=true&includeContent=true&limit=20";
            
			if (search) {
				query = query + "&responseContentSearch=" + search;
			}
			setLoadingMoreStatus(true);
			var msgs = await CallApiMethod.getChannelMessages(connectionDetails, query);
			var arry = (msgs.list && msgs.list.message) && msgs.list.message.length > 1 ? msgs.list.message : (msgs.list && msgs.list.message) && msgs.list.message.length == 1 ? [msgs.list.message] : [];
			setMessages([...messages, ...arry]);
			setLoadingMoreStatus(false);
		
		} catch (error) {
			console.log('error:', error);
			setLoadingMoreStatus(false);
		}
	}

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.title}>{connectionDetails.name}</Text>
			<Text style={styles.content}>{channelName}</Text>
			<View style={styles.searchContainer}>
				<TextInput
					style={styles.searchInput}
					placeholder='Search by Error Response Content'
					onChangeText={text => setSearch(text)}
					value={search}
					onSubmitEditing={() => searchMessages()}
				/>
				<MaterialCommunityIcons style={styles.searchButton} onPress={() => searchMessages()} name="text-box-search" size={36} color={colors.button.background} />
			</View>
			{loadingStatus || searchingNow ? <ActivityIndicator animating size="large" /> : null}

			{!loadingStatus && !searchingNow && messages.length == 0 ? <Text>No Result Found</Text> : null}
			
			<FlatList
				data={messages}
				keyExtractor={(item) => item.messageId.toString()}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.channelContainer}
						onPress={() => getMessageSummary(item)}
					>
						<View style={styles.txtGrp}>
							<Text>ID: {item.messageId}</Text>
							<Text>{convertreceivedDate(item.receivedDate)}</Text>
						</View>
					</TouchableOpacity>
				)}
			/>
			
			{messages.length > 0 && !loadingMoreStatus ? <Button title="Load More" onPress={() => loadMoreMessages()} color={colors.button.background} /> : null}
			
			{loadingMoreStatus ? <ActivityIndicator animating size="large" /> : null}
			
			{message ? <MessageModal style={stylesModal.modalContent} isVisible={isModalVisible} onClose={toggleModal} data={message} /> : null}

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

export default ViewMessages;
