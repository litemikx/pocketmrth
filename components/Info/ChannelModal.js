import React, { useFocusEffect, useEffect, useState } from 'react';
import { Switch, Modal, View, Text, Button, Pressable, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import CallApiMethod from '../CallApiMethod';
import { FontAwesome, Foundation, Feather, AntDesign, Octicons, MaterialIcons, Ionicons } from '@expo/vector-icons';

// navigation
import { useNavigation } from '@react-navigation/native';

import GetAlert from '../Alert/GetAlert';
import AddAlert from '../Alert/AddAlert';
import RemoveAlert from '../Alert/RemoveAlert';

const colors = require('../../assets/colors.json');
const fonts = require('../../assets/fonts.json');

const ChannelModal = ({ isVisible, onClose, data, connection, onRefresh }) => {

    const navigation = useNavigation();

    const [commandStatus, setCommandStatus] = useState('');
    const [commandMessage, setCommandMessage] = useState('');

    // create object named alert and have keys "RECEIVED", "SENT", "FILTERED", "ERROR" and "QUEUE"
    const [alert, setAlert] = useState([]);
    const [alertStatus, setAlertStatus] = useState(false);

    const channel = data;

    // View Channel Info
    const stopChannel = async () => {

        try {
            var res = await CallApiMethod.stopChannel(connection, channel.id);

            if (res) {
                setCommandStatus(true);
                setCommandMessage('Stop command sent.');
            } else {
                setCommandStatus(false);
                setCommandMessage('Something went wrong.');
            }
        } catch (error) {
            console.log('error:', error);
            setCommandStatus(false);
            setCommandMessage('Error: ' + error);
        }
    }

    const startChannel = async () => {

        try {
            var res = await CallApiMethod.startChannel(connection, channel.id);

            if (res) {
                setCommandStatus(true);
                setCommandMessage('Start command sent.');
            } else {
                setCommandStatus(false);
                setCommandMessage('Something went wrong.');
            }
        } catch (error) {
            console.log('error:', error);
            setCommandStatus(false);
            setCommandMessage('Error: ' + error);
        }
    }

    const pauseChannel = async () => {

        try {
            var res = await CallApiMethod.pauseChannel(connection, channel.id);

            if (res) {
                setCommandStatus(true);
                setCommandMessage('Pause command sent.');
            } else {
                setCommandStatus(false);
                setCommandMessage('Something went wrong.');
            }
        } catch (error) {
            console.log('error:', error);
            setCommandStatus(false);
            setCommandMessage('Error: ' + error);
        }
    }

    const resumeChannel = async () => {

        try {
            var res = await CallApiMethod.resumeChannel(connection, channel.id);

            if (res) {
                setCommandStatus(true);
                setCommandMessage('Resume command sent.');
            } else {
                setCommandStatus(false);
                setCommandMessage('Something went wrong.');
            }
        } catch (error) {
            console.log('error:', error);
            setCommandStatus(false);
            setCommandMessage('Error: ' + error);
        }
    }

    const deployChannel = async () => {
        try {
            var res = await CallApiMethod.deployChannel(connection, channel.id);

            if (res) {
                setCommandStatus(true);
                setCommandMessage('Deploy command sent.');
            } else {
                setCommandStatus(false);
                setCommandMessage('Something went wrong.');
            }
        } catch (error) {
            console.log('error:', error);
            setCommandStatus(false);
            setCommandMessage('Error: ' + error);
        }
    }

    const undeployChannel = async () => {
        try {
            var res = await CallApiMethod.undeployChannel(connection, channel.id);

            if (res) {
                setCommandStatus(true);
                setCommandMessage('Undeploy command sent.');
            } else {
                setCommandStatus(false);
                setCommandMessage('Something went wrong.');
            }
        } catch (error) {
            console.log('error:', error);
            setCommandStatus(false);
            setCommandMessage('Error: ' + error);
        }
    }

    const enableNotification = async (stat, statCount) => {
        try {
            var res = await AddAlert(connection.id, channel.id, channel.name, stat, statCount);

            // update alert array and check if it is existing
            setAlert([
                ...alert,
                stat
            ]);
            setAlertStatus(true);
        } catch (error) {
            console.log('error:', error);
        }
    }

    const disableNotification = async (stat) => {
        try {
            await RemoveAlert(connection.id, channel.id, stat);

            // remove stat from alert array
            var newAlert = alert.filter((alert) => alert !== stat);
            setAlert([
                ...newAlert
            ]);

            setAlertStatus(true);


        } catch (error) {
            console.log('error:', error);
        }
    }          

    const onCloseButton = () => {
        // reset values
        setCommandStatus('');
        setCommandMessage('');
        setAlertStatus(false);
        setAlert([]);

        if (commandStatus || alertStatus) {
            onRefresh();
        }
        onClose();
    }

    // button to navigate to ViewChannelMessages component
    const onViewMessages = () => {
        onCloseButton();
    }

    
    useEffect(() => {
         // reset values
         setCommandStatus('');
         setCommandMessage('');
         setAlertStatus(false);
         setAlert([]);
 
        async function getAlert() {
            // get alert if existing
            const alerts = await GetAlert(connection.id, channel.id);
            
            // update alert object and use stat as the key to update value
            var newAlert = [];

            alerts.map((alert) => {
                newAlert.push(Object.keys(alert)[0]);
            });

            setAlert([
                ...newAlert
            ]);    
        };
        getAlert();

    }, [isVisible]);

	React.useCallback(() => {
        setCommandStatus('');
        setCommandMessage('');
        setAlertStatus(false);
        setAlert([]);

        async function getAlert() {
            // get alert if existing
            const alerts = await GetAlert(connection.id, channel.id);

            var newAlert = [];

            alerts.map((alert) => {
                newAlert.push(Object.keys(alert)[0]);
            });

            console.log('newAlert', newAlert);
            setAlert([
                ...newAlert
            ]);

    
        };
        getAlert();
    }
    , [isVisible]);

    return (
        <Modal
            visible={isVisible}
            animationType='none'
            onRequestClose={onCloseButton}
            transparent={true}
        >
            <ScrollView contentContainerStyle={styles.modalContent}>
                <Text style={styles.channelInfo}>Channel Info</Text>
                <Text style={styles.item}><Text style={styles.label}>Name: </Text><Text>{channel.name}</Text></Text>
                <Text style={styles.item}><Text style={styles.label}>ID: </Text><Text>{channel.id}</Text></Text>
                <Text style={styles.item}><Text style={styles.label}>State: </Text><Text>{channel.state}</Text></Text>

                

                {/* Channel Stats: Format into a table */}
                {channel.stats.map((stat, index) => {
                        return (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.tableStatsLabel}>{Object.keys(stat)[0]}:</Text>
                                <Text style={styles.tableStatsValue}>{Object.values(stat)[0]}</Text>
                                <TouchableOpacity style={styles.tableStatsNotification} >
                                    { (alert.indexOf(Object.keys(stat)[0]) > -1) ? (
                                        <Ionicons name="notifications-circle" size={24} color="black" onPress={() => disableNotification(Object.keys(stat)[0])} />

                                    ) : (
                                        <Ionicons name="notifications-off-circle" size={24} color="gray" onPress={() => enableNotification(Object.keys(stat)[0], Object.values(stat)[0])} />
                                    )
                                    }
                                </TouchableOpacity>
                                <Text>{ alert[Object.keys(stat)[0]] }</Text>
                            </View>
                        );
                    })}


                {/* Channel Commands */}
                <View style={styles.iconGrp}>
                    <TouchableOpacity disabled={channel.state == 'UNDEPLOYED' ? true : false} style={channel.state == 'UNDEPLOYED' ? styles.iconBtnDisabled : styles.iconBtn} onPress={() => stopChannel()}>
                        <FontAwesome name="stop-circle-o" size={34} color="#f28482" />
                    </TouchableOpacity>
                    {channel.state == 'PAUSED' ?
                        <TouchableOpacity disabled={channel.state == 'UNDEPLOYED' ? true : false} style={channel.state == 'UNDEPLOYED' ? styles.iconBtnDisabled : styles.iconBtn} onPress={() => resumeChannel()}>
                            <Foundation name="play-circle" size={36} color="#84a59d" />
                        </TouchableOpacity>
                        : <TouchableOpacity disabled={channel.state == 'UNDEPLOYED' ? true : false} style={channel.state == 'UNDEPLOYED' ? styles.iconBtnDisabled : styles.iconBtn} onPress={() => startChannel()}>
                            <Foundation name="play-circle" size={36} color="#84a59d" />
                        </TouchableOpacity>
                    }
                    <TouchableOpacity disabled={channel.state == 'UNDEPLOYED' ? true : false} style={channel.state == 'UNDEPLOYED' ? styles.iconBtnDisabled : styles.iconBtn} onPress={() => pauseChannel()}>
                        <Feather name="pause-circle" size={32} color="#f5cac3" />
                    </TouchableOpacity>

                    <TouchableOpacity disabled={channel.state == 'UNDEPLOYED' ? false : true} style={channel.state == 'UNDEPLOYED' ? styles.iconBtn : styles.iconBtnDisabled} onPress={() => deployChannel()}>
                        <Octicons name="feed-rocket" size={32} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity disabled={channel.state != 'UNDEPLOYED' ? false : true} style={channel.state != 'UNDEPLOYED' ? styles.iconBtn : styles.iconBtnDisabled} onPress={() => undeployChannel()}>
                        <Octicons name="stop" size={32} color="black" />
                    </TouchableOpacity>
                </View>

                {/* Button to navigate to ViewChannelMessages component */}
                <Button title="View Error Messages" onPress={() => navigation.navigate('View Error Messages', { state : { connection, data } })} color={colors.button.background} />

                {commandStatus ? <View style={styles.commandMessage}><Text><FontAwesome name="envelope-o" size={24} color="black" /> {commandMessage}</Text></View>
                    : commandStatus === false ? <View style={styles.commandMessageError}><Text><MaterialIcons name="error-outline" size={24} color="black" /> {commandMessage}</Text></View>
                        : null}

                <Button title="Close" onPress={() => onCloseButton()} color={colors.button.background} />
            </ScrollView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: colors.modal.background,
        padding: 20,
        borderRadius: 10,
        // scrollable
        // centered
        alignSelf: 'center',
        width: '90%',
        minHeight: '50%',

    },
    modalText: {
        fontSize: 16,
        color: colors.modal.text,
    },
    item: {
        marginBottom: 10,
    },
    label: {
        fontWeight: 'bold',
        marginRight: 10
    },
    channelInfo: {
        fontSize: fonts.header2.size,
        textAlign: 'center',
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    tableStatsLabel: {
        fontWeight: 'bold',
        textAlign: 'left',
        width: '30%',
        flexDirection: 'row',
    },
    tableStatsValue: {
        fontSize: fonts.body.size,
        textAlign: 'center',
        width: '55%',
        flexDirection: 'row',
    },
    tableStatsNotification: {
        fontSize: fonts.body.size,
        textAlign: 'right',
        width: '15%',
        flexDirection: 'row',
    },
    deployGrp: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    iconGrp: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10
    },
    iconBtn: {
        marginLeft: 10,
        padding: 3
    },
    // grey out iconBtn
    iconBtnDisabled: {
        opacity: 0.2,
        marginLeft: 10,
        padding: 3
    },
    commandMessage: {
        margin: 10,
        padding: 5,
        borderRadius: 5,
        backgroundColor: '#f6bd60',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    commandMessageError: {
        margin: 10,
        padding: 5,
        borderRadius: 5,
        backgroundColor: '#f28482',
        alignContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    }
});

export default ChannelModal;
