import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import CallApiMethod from '../CallApiMethod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetConnections from './GetConnections';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import ChannelStackedBarChart from '../Chart/StackedBarChart';
import ChannelModal from '../Info/ChannelModal';
import SystemModal from '../Info/SystemModal';

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

	async function performApiCall() {
		try {

			const channelStats = await CallApiMethod.getAllChannelStatuses(connectionDetails);
			
			// filter based on key state not "UNDEPLOYED"
			const deployedChannels = channelStats.list.dashboardStatus.filter((channel) => channel.state !== 'UNDEPLOYED');
			const undeployedChannels = channelStats.list.dashboardStatus.filter((channel) => channel.state === 'UNDEPLOYED');

			setChannelsSummary(deployedChannels);
			setUndeployedChannelList(undeployedChannels);

		} catch (error) {
			setErrorMsg(error.message);
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

				
				channelInfo['stats'].push({ [labelValue] : statValue });
				
			});
			channelInfo['stats'].push({ 'QUEUED' : channelRaw.queued });

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
            const systemInfoRaw = await CallApiMethod.getSystemInfo(connection);
            const systemInfoStats = await CallApiMethod.getSystemStats(connection);
            
            const systemInfo = {};

			if(systemInfoRaw["com.mirth.connect.model.SystemInfo"] == null) {
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
				toggleSystemModal();
			}
        }
    }

	return (
		<View style={styles.container}>
			<Text><Text style={styles.label}>Name:</Text><Text style={styles.content}> {connectionDetails.name}</Text></Text>
			<Text><Text style={styles.label}>Host:</Text><Text style={styles.content}> {connectionDetails.host}</Text></Text>
			<Button title="System" onPress={getSystemInfo(connectionDetails)} color={colors.bar.system} />
			{system ? <SystemModal style={stylesModal.modalContent} isVisible={isSystemModalVisible} onClose={toggleSystemModal} data={system} /> : null}
			{channelsSummary && channelsSummary.length > 0 ? <Text style={styles.label}>Deployed:</Text> : null}
			{/* Display other connection details here */}
			{channelsSummary && channelsSummary.length > 0 ? <FlatList
				style={styles.connectionList}
				data={channelsSummary}
				keyExtractor={(item, index) => item.channelId.toString()}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.connectionItem}
						onPress={() => { getChannelInfo(item) }}
					>	
						<View style={styles.channelContainer}>
							<Text>Name: {item.name}</Text>
							<Text>Status: {item.state}</Text>
							<ChannelStackedBarChart data={item} />
						</View>

					</TouchableOpacity>
				)}
			/> : errorMsg ? null 
			: <Text>Loading...</Text> }
			{channel ? <ChannelModal style={stylesModal.modalContent} isVisible={isModalVisible} onClose={toggleModal} data={channel} /> : null}

			{undeployedChannelList.length > 0 ? <Text style={styles.label}>Undeployed:</Text> : null}
			{undeployedChannelList && undeployedChannelList.length > 0 ? <FlatList
				data={undeployedChannelList}
				keyExtractor={(item, index) => item.channelId.toString()}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.connectionItem}
						onPress={() => { getChannelInfo(item) }}
					>
						<View style={styles.channelContainer}>
							<Text>Name: {item.name}</Text>
							<Text>Status: {item.state}</Text>
						</View>

					</TouchableOpacity>
				)}
			/> : errorMsg ? null 
			: undeployedChannelList.length == 0 ? null 
			: <Text>Loading...</Text> }
			<Text>{'\n'}</Text>
			<Button title="Delete" onPress={() => confirmDelete()} color={colors.button.background} />
			<Text>{'\n'}</Text>

			<Button title="Edit" onPress={() => handleEditConnection()} color={colors.button.background} />
 
			{deleteMsg ? <Text>{deleteMsg}</Text> : null}

		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		fontSize: fonts.body.size,
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
	connectionList: {

	},
	channelContainer: {
		borderBlockColor: 'black',
		backgroundColor: colors.items.background,
		padding: 10,
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
