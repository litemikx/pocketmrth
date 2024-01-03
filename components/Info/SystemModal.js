

// TOSModal.js

import React from 'react';
import { Modal, View, Text, Button, Pressable, StyleSheet, ScrollView } from 'react-native';

const colors = require('../../assets/colors.json');
const fonts = require('../../assets/fonts.json');
const size = require('../../assets/size.json');

const SystemModal = ({ isVisible, onClose, data }) => {
    
  const system = data;

  function convertBytesToMB(bytes) {
    return (bytes / (1024 * 1024)).toFixed(2);
  }

  function convertBytesToGB(bytes) {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2);
  }

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
            <Text style={styles.systemInfo}>System Info</Text>
            <Text style={styles.modalText}>Java: {system.info.jvmVersion}</Text>
            <Text style={styles.modalText}>OS: {system.info.osName}</Text>
            <Text style={styles.modalText}>Database: {system.info.dbName} {system.info.dbVersion}</Text>
            <Text style={styles.modalText}>Allocated Memory: {convertBytesToMB(system.stats.allocatedMemoryBytes)} MB</Text>
            <Text style={styles.modalText}>Free Memory: {convertBytesToMB(system.stats.freeMemoryBytes)} MB</Text>
            <Text style={styles.modalText}>Max Memory: {convertBytesToMB(system.stats.maxMemoryBytes)} MB</Text>
            
            <Text style={styles.modalText}>CPU Usage: {system.stats.cpuUsagePct.toFixed(2)} %</Text>
            
            <Text style={styles.modalText}>Disk Usage: {convertBytesToGB((system.stats.diskTotalBytes - system.stats.diskFreeBytes))} GB / {convertBytesToGB(system.stats.diskTotalBytes)} GB</Text>
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

export default SystemModal;
