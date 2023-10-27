import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

/*
alert = {
    id: uuid,
    user_id: currentUserId,
    data: [
        {
            "connection" : connectionId,
            "channels" : [
                {
                    id: channelObject.id,
                    name: channelObject.name,
                    statType: [
                        channelObject.stat
                    ]
                }
            ]
        }
    ]
}
*/

export default async function AddAlert(connectionId, channelId, channelName, stat, statCount) {
		var uuid = Crypto.randomUUID();
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
                const channels = connection.channels ? connection.channels : [];
                const channel = channels.find((channel) => channel.id === channelId);
                // if channel exists then search statType array for statType
                if (channel) {
                    const statTypes = channel.statType ? channel.statType : [];
                    const statType = statTypes.find((statType) => statType[stat] !== undefined );
                    // if statType exists then return
                    if (statType) {
                        return true;
                    }
                    // else add statType to statType array
                    else {
                        channel.statType.push({
                            [stat]: statCount
                        });
                        
                    }
                }
                // else add channel to channels array
                else {
                    channels.push({
                        id: channelId,
                        name: channelName,
                        statType: [
                            {
                                [stat]: statCount
                            }
                        ]
                    });

                }
            }
            // else add connection to data array
            else {
                data.push({
                    connection: connectionId,
                    channels: [
                        {
                            id: channelId,
                            name: channelName,
                            statType: [
                                {
                                    [stat]: statCount
                                }
                            ]
                        }
                    ]
                });
            }

            // update alert storage record
            const updatedAlert = {
                id: alert.id,
                user_id: currentUserId,
                data: data
            };

            // remove existing alert
            const filteredAlerts = alertsArray.filter((alert) => alert.user_id !== currentUserId);
            // add updated alert
            filteredAlerts.push(updatedAlert);
            // save alerts
            await AsyncStorage.setItem('alerts', JSON.stringify(filteredAlerts));
            return true;
        } else {
            // else create new alert
            const alert = {
                id: uuid,
                user_id: currentUserId,
                data: [
                    {
                        connection : connectionId,
                        channels : [
                            {
                                id: channelId,
                                name: channelName,
                                statType: [
                                    {
                                        [stat]: statCount
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };

            // save alert
            alertsArray.push(alert);
            await AsyncStorage.setItem('alerts', JSON.stringify(alertsArray));
            return true;
        }
};
