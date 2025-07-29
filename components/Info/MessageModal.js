import React from 'react';
import { Modal, View, Text, Button, Pressable, StyleSheet, ScrollView } from 'react-native';

const colors = require('../../assets/colors.json');
const fonts = require('../../assets/fonts.json');
const size = require('../../assets/size.json');

const MessageModal = ({ isVisible, onClose, data }) => {

  let message = '';
  if (data && data.connectorMessages && data.connectorMessages.entry && data.connectorMessages.entry.connectorMessage && data.connectorMessages.entry.connectorMessage.response && data.connectorMessages.entry.connectorMessage.response.content) {
    const xmlContent = data.connectorMessages.entry.connectorMessage.response.content;
    try {
      // Format XML with indentation
      const formatted = xmlContent.replace(/></g, '>\n<');
      message = formatted;
    } catch (e) {
      message = xmlContent;
    }
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
            <Text style={styles.systemInfo}>Message Details</Text>
              <ScrollView horizontal>
                <Text
                  style={[styles.codeBlock, styles.modalText]}
                  selectable
                >
                  {message}
                </Text>
              </ScrollView>
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
  },
  codeBlock: {
    fontFamily: 'Courier', // or 'monospace'
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderRadius: 6,
    marginVertical: 10,
  }
});

export default MessageModal;
