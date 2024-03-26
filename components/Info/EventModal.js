

// TOSModal.js

import React from 'react';
import { Modal, View, Text, Button, Pressable, StyleSheet, ScrollView } from 'react-native';

const colors = require('../../assets/colors.json');
const fonts = require('../../assets/fonts.json');
const size = require('../../assets/size.json');

const EventModal = ({ isVisible, onClose, data, username, date }) => {
    
  const event = data;

  return (
    <Modal
      visible={isVisible}
      animationType='none'
      onRequestClose={onClose}
      transparent={true}
    >
      <View style={styles.modalContent}>
        { data ? 
          <ScrollView>
            <Text style={styles.systemInfo}>Event Summary</Text>
            <Text style={styles.modalText}>ID: {data.id}</Text>
            <Text style={styles.modalText}>User: {username}</Text>
            <Text style={styles.modalText}>Name: {data.name}</Text>
            <Text style={styles.modalText}>Level: {data.level}</Text>
            <Text style={styles.modalText}>Outcome: {data.outcome}</Text>
            <Text style={styles.modalText}>IP Address: {data.ipAddress}</Text>
            <Text style={styles.modalText}>Server ID: {data.serverId}</Text>
            <Text style={styles.modalText}>Date Time: {date}</Text>
          </ScrollView>
          : <ScrollView>
              <Text style={styles.modalText}>Loading...</Text>
            </ScrollView>
        }
        <Button title="Close" onPress={onClose} color={colors.button.background} />
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
    height: '70%',
    // centered
    alignSelf: 'center',
    justifyContent: 'center',
    width: '95%'
  },
  modalText: {
    fontSize: 16,
    color: colors.modal.text,
  },
  systemInfo: {
    fontSize: fonts.header2.size,
    textAlign: 'center',
  },
  button: {
    height: size.button.height
  }
});

export default EventModal;
