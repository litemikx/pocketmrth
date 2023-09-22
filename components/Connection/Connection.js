import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ViewConnection from './ViewConnection';
import GetConnections from './GetConnections';
import { set } from 'react-native-reanimated';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import CallApiMethod from '../CallApiMethod';

const colors = require('../../assets/colors.json');

const Connection = () => {
	const [connections, setConnections] = useState([]);
	const [loadingItems, setLoadingItems] = useState(false);

	const navigation = useNavigation();

	useEffect(() => {
		setConnections([]);
		getConnections();
	}, []);

	useFocusEffect(
		React.useCallback(() => {
			setConnections([]);
			getConnections();
		}, [])
	);

	async function getConnections() {
		try {
			var conns = await GetConnections();
			var arry = [];
			var done = await Promise.all(
				conns.map(async (conn) => {
					var res = await CallApiMethod.getServerStatus(conn);
					if (res) {
						conn['status'] = true;
						arry.push(conn);
					} else {
						conn['status'] = false;
						arry.push(conn);
					}
				})
			);

			if (done) {
				setConnections(arry);
				setLoadingItems(true);
			}
		} catch (error) {
			console.log('error:', error);
			setLoadingItems(true);
		}

	}

	const handleConnectionPress = (connectionDetails) => {
		navigation.navigate('View Connection', { connectionDetails });
	};

	const handleAddConnectionPress = () => {
		navigation.navigate('Add Connection');
	};
	
	return (
		<View style={styles.container}>
			{connections && connections.length > 0 && loadingItems ?
				<FlatList
					style={styles.connectionList}
					data={connections}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item }) => (
						<TouchableOpacity
							style={styles.connectionItem}
							onPress={() => handleConnectionPress(item)}
						>
							<Text>{item.name}</Text>
							<Text>{item.host}</Text>
							<Text style={styles.status}>
								<AntDesign name="upcircle" size={24} color={item.status === true ? colors.status.up : 'grey'} /><AntDesign name="downcircle" size={24} color={item.status === false ? colors.status.down : 'grey'} />
							</Text>
						</TouchableOpacity>
					)}
				/> : loadingItems == false ? <Text>Loading... </Text>
					: <Text>No connections found</Text>}
			<TouchableOpacity onPress={handleAddConnectionPress}>
				<Ionicons name="add-circle" size={50} color={colors.button.background} />
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		alignItems: 'center',
		backgroundColor: '#f7ede2',
		height: '100%',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	connectionItem: {
		// backgroundColor white with opacity
		backgroundColor: colors.items.background,
		padding: 20,
		marginVertical: 5,
		borderRadius: 5,
	},
	// style FlatList component
	connectionList: {
		width: '100%',
		borderBlockColor: 'black',
	},
	status: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		width: '100%',
	},
});

export default Connection;
