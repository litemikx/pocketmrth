import React, { useFocusEffect, useEffect, useState } from 'react';
import { Switch, Modal, View, Text, Button, Pressable, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import CallApiMethod from '../CallApiMethod';
import { FontAwesome, Foundation, Feather, AntDesign, Octicons, MaterialIcons } from '@expo/vector-icons';

const colors = require('../../assets/colors.json');
const fonts = require('../../assets/fonts.json');

const ChannelModal = ({ isVisible, onClose, data, connection, onRefresh }) => {

    const [commandStatus, setCommandStatus] = useState('');
    const [commandMessage, setCommandMessage] = useState('');

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

    const onCloseButton = () => {
        onClose();
        // reset values
        setCommandStatus('');
        setCommandMessage('');

        if (commandStatus) {
            onRefresh();
        }
    }

    return (
        <Modal
            visible={isVisible}
            animationType='none'
            onRequestClose={onClose}
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
        width: '70%',
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
