import React from 'react';
import { Modal, View, Text, Button, Pressable, StyleSheet, ScrollView } from 'react-native';
// import colors from '../assets/colors';
const colors = require('../../assets/colors.json');
const size = require('../../assets/size.json');

const NotificationAlertStatusModal = ({ isVisible, onClose }) => {

  return (
    <Modal
      visible={isVisible}
      animationType='none'
      onRequestClose={onClose}
      transparent={true}
    >
      <View style={styles.modalContent}>
        <ScrollView>
            <Text style={styles.title}>Push Notification Alert</Text>
          <Text style={styles.modalText}>
          This is the status of the feature "Push Notification Alert". This feature can be turned on/off when you edit your profile. You can get push notification on each channel when there is a change in the stats numbers. The notification can be turned on/off when you view the channel details. 
When this feature is turned on, you will receive a push notification when there is a change in the status of your channels.
          </Text>
            <Text style={styles.modalText}>
            Status:
            </Text>
            <Text style={styles.modalText}>
                - Active : 1 or more channel stats have their notification alert set.
            </Text>
            <Text style={styles.modalText}>
                - Inactive : No channel stats have their notification alert set and/or the "Push Notification Alert" is disabled.
            </Text>
        </ScrollView>
        <Button title="Close" style={styles.button} onPress={onClose} color={colors.button.background} />
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
    maxHeight: '90%',
    alignSelf: 'center',
    width: '90%',
    marginBottom: 20
  },
  modalText: {
    fontSize: 16,
    color: colors.modal.text,
    paddingBottom: 10
  },
  button: {
    height: size.button.height,
    margin: 20
  },
    title: {
        fontSize: 24,
        marginBottom: 10,
    },
});

export default NotificationAlertStatusModal;
