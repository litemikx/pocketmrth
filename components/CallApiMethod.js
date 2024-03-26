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
        var customHeaderJson = connection.header ? JSON.parse(connection.header) : null;

        var header = customHeaderJson ? {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                ...customHeaderJson
            } : {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            };
        
        var res = await fetch(api + '/api/users/_login' + params, {
            method: 'POST',
            headers: header,
        });

        const json = res;
        //const jsessionid = res.headers.get('Set-Cookie');//.split(';')[0];
        return json;

    } catch (error) {
        console.log('Error logging in:', error);
        return error;
    }

}


CallApiMethod.getChannelsStatistics = async (connection, channelId) => {
    try {
        const creds = await SecureStore.getItemAsync(connection.id);
        var auth = 'Basic ' + btoa(JSON.parse(creds).username + ':' + JSON.parse(creds).password);
        var api = connection.host;

        var customHeaderJson = connection.header ? JSON.parse(connection.header) : null;

        var header = customHeaderJson ? {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json',
                ...customHeaderJson
            } : {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json'
            };

        var res = await fetch(api + '/api/channels/' + channelId + '/statistics', {
            method: 'GET',
            headers: header
        });

        const json = await res.json();
        return json;

    } catch (error) {
        console.log('Error fetching connections:', error);
        return false;
    }
}

CallApiMethod.getAllChannelsStatistics = async (connection, aggre) => {
    try {
        const creds = await SecureStore.getItemAsync(connection.id);
        var auth = 'Basic ' + btoa(JSON.parse(creds).username + ':' + JSON.parse(creds).password);
        var api = connection.host;

        var customHeaderJson = connection.header ? JSON.parse(connection.header) : null;

        var header = customHeaderJson ? {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json',
                ...customHeaderJson
            } : {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json'
            };

        var res = await fetch(api + '/api/channels/statistics?includeUndeployed=false&aggregateStats=' + (aggre ? aggre : 'true'), {
            method: 'GET',
            headers: header
        });

        const json = await res.json();
        return json;

    } catch (error) {
        console.log('Error fetching all channel statistics:', error);
        return false;
    }
}

CallApiMethod.getChannelStatusState = async (connection, channelId) => {
    try {
        const creds = await SecureStore.getItemAsync(connection.id);
        var auth = 'Basic ' + btoa(JSON.parse(creds).username + ':' + JSON.parse(creds).password);
        var api = connection.host;

        var customHeaderJson = connection.header ? JSON.parse(connection.header) : null;

        var header = customHeaderJson ? {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json',
                ...customHeaderJson
            } : {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json'
            };

        var res = await fetch(api + '/api/channels/' + channelId + '/status', {
            method: 'GET',
            headers: header
        });

        const json = await res.json();
        return json;

    } catch (error) {
        console.log('Error fetching all channel statistics:', error);
        return false;
    }
}

CallApiMethod.getChannelsIdsAndNames = async (connection) => {
    try {
        const creds = await SecureStore.getItemAsync(connection.id);
        var auth = 'Basic ' + btoa(JSON.parse(creds).username + ':' + JSON.parse(creds).password);
        var api = connection.host;

        var customHeaderJson = connection.header ? JSON.parse(connection.header) : null;

        var header = customHeaderJson ? {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json',
                ...customHeaderJson
            } : {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json'
            };

        var res = await fetch(api + '/api/channels/idsAndNames', {
            method: 'GET',
            headers: header
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

        var customHeaderJson = connection.header ? JSON.parse(connection.header) : null;

        var header = customHeaderJson ? {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json',
                ...customHeaderJson
            } : {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json'
            };

        var res = await fetch(api + '/api/channels/statuses?includeUndeployed=true', {
            method: 'GET',
            headers: header
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

        var customHeaderJson = connection.header ? JSON.parse(connection.header) : null;

        var header = customHeaderJson ? {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json',
                ...customHeaderJson
            } : {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json'
            };

        var res = await fetch(api + '/api/server/status', {
            method: 'GET',
            headers: header
        });

        const json = await res.json();
        return json;


    } catch (error) {
        console.log('Error fetching server status:', error);
        return false;
    }
}

CallApiMethod.getSystemInfo = async (connection) => {
    try {
        const creds = await SecureStore.getItemAsync(connection.id);
        var auth = 'Basic ' + btoa(JSON.parse(creds).username + ':' + JSON.parse(creds).password);
        var api = connection.host;

        var customHeaderJson = connection.header ? JSON.parse(connection.header) : null;

        var header = customHeaderJson ? {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json',
                ...customHeaderJson
            } : {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json'
            };

        var res = await fetch(api + '/api/system/info', {
            method: 'GET',
            headers: header
        });

        const json = await res.json();
        return json;

    } catch (error) {
        console.log('Error fetching server info:', error);
        return false;
    }
}

CallApiMethod.getSystemStats = async (connection) => {
    try {
        const creds = await SecureStore.getItemAsync(connection.id);
        var auth = 'Basic ' + btoa(JSON.parse(creds).username + ':' + JSON.parse(creds).password);
        var api = connection.host;

        var customHeaderJson = connection.header ? JSON.parse(connection.header) : null;

        var header = customHeaderJson ? {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json',
                ...customHeaderJson
            } : {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json'
            };

        var res = await fetch(api + '/api/system/stats', {
            method: 'GET',
            headers: header
        });

        const json = await res.json();
        return json;

    } catch (error) {
        console.log('Error fetching server stats:', error);
        return false;
    }
}

// Channel Commands
CallApiMethod.haltChannel = async (connection, channelId) => {
    try {
        const creds = await SecureStore.getItemAsync(connection.id);
        var auth = 'Basic ' + btoa(JSON.parse(creds).username + ':' + JSON.parse(creds).password);
        var api = connection.host;

        var customHeaderJson = connection.header ? JSON.parse(connection.header) : null;

        var header = customHeaderJson ? {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json',
                ...customHeaderJson
            } : {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json'
            };

        var res = await fetch(api + '/api/channels/' + channelId + '/_halt', {
            method: 'POST',
            headers: header
        });

        const json = await res.json();
        return json;

    } catch (error) {
        console.log('Error channel halt:', error);
        return false;
    }
}

CallApiMethod.stopChannel = async (connection, channelId) => {
    try {
        const creds = await SecureStore.getItemAsync(connection.id);
        var auth = 'Basic ' + btoa(JSON.parse(creds).username + ':' + JSON.parse(creds).password);
        var api = connection.host;

        var customHeaderJson = connection.header ? JSON.parse(connection.header) : null;

        var header = customHeaderJson ? {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json',
                ...customHeaderJson
            } : {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json'
            };

        var res = await fetch(api + '/api/channels/' + channelId + '/_stop?returnErrors=true', {
            method: 'POST',
            headers: header
        });

        if(res.ok) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.log('Error channel stop:', error);
        return false;
    }
}

CallApiMethod.startChannel = async (connection, channelId) => {
    try {
        const creds = await SecureStore.getItemAsync(connection.id);
        var auth = 'Basic ' + btoa(JSON.parse(creds).username + ':' + JSON.parse(creds).password);
        var api = connection.host;

        var customHeaderJson = connection.header ? JSON.parse(connection.header) : null;

        var header = customHeaderJson ? {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json',
                ...customHeaderJson
            } : {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json'
            };

        var res = await fetch(api + '/api/channels/' + channelId + '/_start?returnErrors=true', {
            method: 'POST',
            headers: header
        });

        if(res.ok) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.log('Error channel start:', error);
        return false;
    }
}

CallApiMethod.pauseChannel = async (connection, channelId) => {
    try {
        const creds = await SecureStore.getItemAsync(connection.id);
        var auth = 'Basic ' + btoa(JSON.parse(creds).username + ':' + JSON.parse(creds).password);
        var api = connection.host;

        var customHeaderJson = connection.header ? JSON.parse(connection.header) : null;

        var header = customHeaderJson ? {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json',
                ...customHeaderJson
            } : {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json'
            };

        var res = await fetch(api + '/api/channels/' + channelId + '/_pause?returnErrors=true', {
            method: 'POST',
            headers: header
        });

        if(res.ok) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.log('Error channel pause:', error);
        return false;
    }
}


CallApiMethod.resumeChannel = async (connection, channelId) => {
    try {
        const creds = await SecureStore.getItemAsync(connection.id);
        var auth = 'Basic ' + btoa(JSON.parse(creds).username + ':' + JSON.parse(creds).password);
        var api = connection.host;

        var customHeaderJson = connection.header ? JSON.parse(connection.header) : null;

        var header = customHeaderJson ? {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json',
                ...customHeaderJson
            } : {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json'
            };

        var res = await fetch(api + '/api/channels/' + channelId + '/_resume?returnErrors=true', {
            method: 'POST',
            headers: header
        });

        if(res.ok) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.log('Error channel resume:', error);
        return false;
    }
}

CallApiMethod.deployChannel = async (connection, channelId) => {
    try {
        const creds = await SecureStore.getItemAsync(connection.id);
        var auth = 'Basic ' + btoa(JSON.parse(creds).username + ':' + JSON.parse(creds).password);
        var api = connection.host;

        var customHeaderJson = connection.header ? JSON.parse(connection.header) : null;

        var header = customHeaderJson ? {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json',
                ...customHeaderJson
            } : {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json'
            };

        var res = await fetch(api + '/api/channels/' + channelId + '/_deploy?returnErrors=true', {
            method: 'POST',
            headers: header
        });

        if(res.ok) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.log('Error channel deploy:', error);
        return false;
    }
}

CallApiMethod.undeployChannel = async (connection, channelId) => {
    try {
        const creds = await SecureStore.getItemAsync(connection.id);
        var auth = 'Basic ' + btoa(JSON.parse(creds).username + ':' + JSON.parse(creds).password);
        var api = connection.host;

        var customHeaderJson = connection.header ? JSON.parse(connection.header) : null;

        var header = customHeaderJson ? {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json',
                ...customHeaderJson
            } : {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json'
            };

        var res = await fetch(api + '/api/channels/' + channelId + '/_undeploy?returnErrors=true', {
            method: 'POST',
            headers: header
        });

        if(res.ok) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.log('Error channel undeploy:', error);
        return false;
    }
}

CallApiMethod.getServerEvents = async (connection, param) => {
    try {
        const creds = await SecureStore.getItemAsync(connection.id);
        var auth = 'Basic ' + btoa(JSON.parse(creds).username + ':' + JSON.parse(creds).password);
        var api = connection.host;

        var customHeaderJson = connection.header ? JSON.parse(connection.header) : null;

        var header = customHeaderJson ? {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json',
                ...customHeaderJson
            } : {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json'
            };

        var res = await fetch(api + '/api/events' + (param ? '?'+param : '?limit=20'), {
            method: 'GET',
            headers: header
        });

        const json = await res.json();
        
        return json;

    } catch (error) {
        console.log('Error fetching server event logs:', error);
        return false;
    }
}

CallApiMethod.getServerUsers = async (connection, param) => {
    try {
        const creds = await SecureStore.getItemAsync(connection.id);
        var auth = 'Basic ' + btoa(JSON.parse(creds).username + ':' + JSON.parse(creds).password);
        var api = connection.host;

        var customHeaderJson = connection.header ? JSON.parse(connection.header) : null;

        var header = customHeaderJson ? {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json',
                ...customHeaderJson
            } : {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/json'
            };

        var res = await fetch(api + '/api/users', {
            method: 'GET',
            headers: header
        });

        const json = await res.json();
        
        return json;

    } catch (error) {
        console.log('Error fetching server users:', error);
        return false;
    }
}

export default CallApiMethod;
