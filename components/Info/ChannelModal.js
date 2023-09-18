

// TOSModal.js

import React from 'react';
import { Modal, View, Text, Button, Pressable, StyleSheet, ScrollView, FlatList } from 'react-native';

const colors = require('../../assets/colors.json');
const fonts = require('../../assets/fonts.json');

const ChannelModal = ({ isVisible, onClose, data }) => {

    const channel = data;

    return (
        <Modal
            visible={isVisible}
            animationType='none'
            onRequestClose={onClose}
            transparent={true}
        >
            <View style={styles.modalContent}>
                <ScrollView>
                    <Text style={styles.channelInfo}>Channel Info</Text>
                    <Text>{channel.name}</Text>
                    <Text>{channel.id}</Text>
                    <Text>{channel.state}</Text>

                    {channel.stats.map((stat, index) => {
                        return (
                            <View key={index}>
                                <Text>{Object.keys(stat)[0]}: {Object.values(stat)[0]}</Text>
                            </View>
                        );
                    })}
                </ScrollView>
                <Button title="Close" onPress={onClose} color={colors.button.background}/>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
      backgroundColor: colors.modal.background,
      padding: 20,
      borderRadius: 10,
      // scrollable
      maxHeight: '40%',
      // centered
      alignSelf: 'center',
      justifyContent: 'center',
     
    },
    modalText: {
      fontSize: 16,
      color: colors.modal.text,
    },
    channelInfo: {
      fontSize: fonts.header2.size,
      textAlign: 'center',
    }
  });

export default ChannelModal;
