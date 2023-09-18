import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';
import * as SecureStore from 'expo-secure-store';
import { decode as atob, encode as btoa } from 'base-64';

// Create a component with multiple functions
const CallApiMethod = {};

CallApiMethod.login = async (connection) => {
    try {
        const creds = await SecureStore.getItemAsync(connection.id);
        var params = '?username=' + JSON.parse(creds).username + '&password=' + JSON.parse(creds).password;
        var api = connection.host;
        var res = await fetch(api + '/api/users/_login' + params, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        });

        const json = res;
        //const jsessionid = res.headers.get('Set-Cookie');//.split(';')[0];
        return json;

    } catch (error) {
        console.error('Error logging in:', error);
        return error;
    }

}


CallApiMethod.getChannelsStatistics = async (connection, channelId) => {
    try {
        const creds = await SecureStore.getItemAsync(connection.id);
        var auth = 'Basic ' + btoa(JSON.parse(creds).username + ':' + JSON.parse(creds).password);
        var api = connection.host;
        var res = await fetch(api + '/api/channels/' + channelId + '/statistics', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json'
            }
        });

        const json = await res.json();
        return json;

    } catch (error) {
        console.error('Error fetching connections:', error);
        return false;
    }
}

CallApiMethod.getAllChannelsStatistics = async (connection) => {
    try {
        const creds = await SecureStore.getItemAsync(connection.id);
        var auth = 'Basic ' + btoa(JSON.parse(creds).username + ':' + JSON.parse(creds).password);
        var api = connection.host;
        var res = await fetch(api + '/api/channels/statistics?includeUndeployed=false&aggregateStats=true', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json'
            }
        });

        const json = await res.json();
        return json;

    } catch (error) {
        console.error('Error fetching all channel statistics:', error);
        return false;
    }
}

CallApiMethod.getChannelStatusState = async (connection, channelId) => {
    try {
        const creds = await SecureStore.getItemAsync(connection.id);
        var auth = 'Basic ' + btoa(JSON.parse(creds).username + ':' + JSON.parse(creds).password);
        var api = connection.host;
        var res = await fetch(api + '/api/channels/' + channelId + '/status', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json'
            }
        });

        const json = await res.json();
        return json;

    } catch (error) {
        console.error('Error fetching all channel statistics:', error);
        return false;
    }
}

CallApiMethod.getChannelsIdsAndNames = async (connection) => {
    try {
        const creds = await SecureStore.getItemAsync(connection.id);
        var auth = 'Basic ' + btoa(JSON.parse(creds).username + ':' + JSON.parse(creds).password);
        var api = connection.host;
        var res = await fetch(api + '/api/channels/idsAndNames', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json',
            }
        });

        const json = await res.json();
        return json;

    } catch (error) {
        console.log('Error fetching channels ids and names:', error);
        return false;
    }
}

CallApiMethod.getAllChannelStatuses = async (connection) => {
    try {
        const creds = await SecureStore.getItemAsync(connection.id);
        var auth = 'Basic ' + btoa(JSON.parse(creds).username + ':' + JSON.parse(creds).password);
        var api = connection.host;
        var res = await fetch(api + '/api/channels/statuses?includeUndeployed=true', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json',
            }
        });

        const json = await res.json();
        return json;

    } catch (error) {
        console.log('Error fetching all channel statuses:', error);
        return false;
    }
}


CallApiMethod.getServerStatus = async (connection) => {
    try {
        const creds = await SecureStore.getItemAsync(connection.id);
        var auth = 'Basic ' + btoa(JSON.parse(creds).username + ':' + JSON.parse(creds).password);
        var api = connection.host;
        var res = await fetch(api + '/api/server/status', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json'
            }
        });

        const json = await res.json();
        console.log('json:', json);
        return json;


    } catch (error) {
        console.error('Error fetching server status:', error);
        return false;
    }
}

CallApiMethod.getSystemInfo = async (connection) => {
    try {
        const creds = await SecureStore.getItemAsync(connection.id);
        var auth = 'Basic ' + btoa(JSON.parse(creds).username + ':' + JSON.parse(creds).password);
        var api = connection.host;
        var res = await fetch(api + '/api/system/info', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json'
            }
        });

        const json = await res.json();
        console.log('json:', json);
        return json;

    } catch (error) {
        console.error('Error fetching server info:', error);
        return false;
    }
}

CallApiMethod.getSystemStats = async (connection) => {
    try {
        const creds = await SecureStore.getItemAsync(connection.id);
        var auth = 'Basic ' + btoa(JSON.parse(creds).username + ':' + JSON.parse(creds).password);
        var api = connection.host;
        var res = await fetch(api + '/api/system/stats', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json'
            }
        });

        const json = await res.json();
        console.log('json:', json);
        return json;

    } catch (error) {
        console.error('Error fetching server stats:', error);
        return false;
    }
}

export default CallApiMethod;
