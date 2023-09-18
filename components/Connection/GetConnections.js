import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function GetConnections() {
    // Fetch and load connection records from AsyncStorage
    const currentUserId = await AsyncStorage.getItem('currentUserId');
    try {
        const connectionsData = await AsyncStorage.getItem('connections');

        // Array of connections filtered by user_id
        var userConnectionList = [];

        if (connectionsData) {
            const parsedConnections = JSON.parse(connectionsData);
            userConnectionList = parsedConnections.filter((connection) => connection.user_id === currentUserId);

            return userConnectionList;
        }
    } catch (error) {
        console.error('Error fetching connections:', error);
    }
}