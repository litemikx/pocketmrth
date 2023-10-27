import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function GetAlert(connectionId, channelId) {
    // Fetch and load connection records from AsyncStorage
    const currentUserId = await AsyncStorage.getItem('currentUserId');
		
    // get alert if existing
    const alerts = await AsyncStorage.getItem('alerts');
    // filter alerts based on currentUserId on alerts.user_id
    const alertsArray = alerts ? JSON.parse(alerts) : [];
    const alert = alertsArray.find((alert) => alert.user_id === currentUserId);
    
    // if alert exists then search data array for connectionId
    if (alert) {
        const data = alert.data;
        const connection = data.find((connection) => connection.connection === connectionId);
        // if connection exists then search channels array for channelId
        if (connection) {
            const channels = connection.channels;
            const channel = channels.find((channel) => channel.id === channelId);
            // if channel exists then search statType array for statType
            if (channel) {
                return channel.statType;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}
