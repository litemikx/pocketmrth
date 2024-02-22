import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddBackgroundTask from './AddBackgroundTaskAlert';

export default async function RefreshAlert(notificationFlag) {
    try {

        const currentUserId = await AsyncStorage.getItem('currentUserId');
        const users = await AsyncStorage.getItem('users');
        const usersArray = JSON.parse(users);

        const user = usersArray.find((user) => user.id === currentUserId);
        
        var mins = user.pollTime * 60;

        var success = await AddBackgroundTask(notificationFlag, mins);
        return success;
    } catch (error) {
        console.log(error);
    }
};

