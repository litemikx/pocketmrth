import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ViewConnection from './ViewConnection';
import GetConnections from './GetConnections';
import { set } from 'react-native-reanimated';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import CallApiMethod from '../CallApiMethod';
import { FontAwesome } from '@expo/vector-icons';

const colors = require('../../assets/colors.json');

const Connection = () => {
	const [connections, setConnections] = useState([]);
	const [loadingItems, setLoadingItems] = useState(false);

	const navigation = useNavigation();
	
	// sort by name
	const [sort, setSort] = useState(true);

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
				console.log('conns:', arry);
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

	// toggle sort function for deployed channels by name ascending or descending
	const toggleSort = () => {
		if(!sort) {
			// sort by name ascending
			setConnections(connections.sort((a, b) => (a.name > b.name) ? 1 : -1));
			setSort(true);
		} else {
			// sort by name descending
			setConnections(connections.sort((a, b) => (a.name < b.name) ? 1 : -1));
			setSort(false);
		}
	}

	// search function for deployed channels and unedeployed channels
	const [searchQuery, setSearchQuery] = useState('');

	const searchConnections = (text) => {
		if(text == '') {
			setConnections([]);
			getConnections();
		} else {
			setConnections(connections.filter((channel) => channel.name.toLowerCase().includes(text.toLowerCase())));
		}
	}

	useEffect(() => {
		searchConnections(searchQuery);
	}, [searchQuery]);

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View style={styles.searchContainer}>
				<TextInput
					style={styles.searchInput}
					placeholder="Search"
					value={searchQuery}
					onChangeText={text => setSearchQuery(text)}
				/>
				<TouchableOpacity style={styles.sortButton} onPress={toggleSort}>
					{ sort ? 
						<FontAwesome name="sort-alpha-asc" size={24} color={colors.button.background} />
						: <FontAwesome name="sort-alpha-desc" size={24} color={colors.button.background} />	
					}
				</TouchableOpacity>
			</View>
			{connections && connections.length > 0 && loadingItems ?
				( <View style={ {width: '100%' }}>
					{connections.map((item, index) => (
						<TouchableOpacity
							key={index}
							style={styles.connectionItem}
							onPress={() => handleConnectionPress(item)}
						>
							<Text>{item.name}</Text>
							<Text>{item.host}</Text>
							<Text style={styles.status}>
								<AntDesign name="upcircle" size={24} color={item.status === true ? colors.status.up : 'grey'} /><AntDesign name="downcircle" size={24} color={item.status === false ? colors.status.down : 'grey'} />
							</Text>
						</TouchableOpacity>
					))}
					</View>) : loadingItems == false ? (
					<Text>Loading... </Text>
				)
					: (<Text>No connections found</Text>)}
			<TouchableOpacity onPress={handleAddConnectionPress}>
				<Ionicons name="add-circle" size={50} color={colors.button.background} />
			</TouchableOpacity>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		padding: 20,
		backgroundColor: colors.body.background,
		alignItems: 'center',
		width: '100%',
		
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	connectionItem: {
		// backgroundColor white with opacity
		backgroundColor: colors.items.background,
		padding: 10,
		marginBottom: 10,
		borderRadius: 5
	},
	status: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		width: '100%',
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

export default Connection;
