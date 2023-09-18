import React from 'react';
import { Modal, View, Text, Button, Pressable, StyleSheet, ScrollView } from 'react-native';
// import colors from '../assets/colors';
const colors = require('../../assets/colors.json');
const size = require('../../assets/size.json');

const TOSModal = ({ isVisible, onClose }) => {
    var tosText = `
    
    Terms of Service
    
    Welcome to PocketMRTH!
    
    By using our mobile application, you agree to the following terms and conditions. Please read them carefully.
    
    1. Acceptance of Terms
    
    By accessing or using PocketMRTH, you acknowledge that you have read, understood, and agree to be bound by these terms of service.
    
    2. Disclaimer of Liabilities
    
    PocketMRTH and its developers shall not be held liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of your use of the application.
    
    3. User Conduct
    
    You agree not to use PocketMRTH for any unlawful or unauthorized purposes. You are solely responsible for any content you submit, and you agree to indemnify PocketMRTH and its developers from any claims resulting from your actions.
    
    4. Changes to the App
    
    PocketMRTH reserves the right to modify or discontinue the application at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the app.
    
    5. Intellectual Property
    
    All content within PocketMRTH, including text, graphics, logos, icons, images, audio clips, and software, is the property of PocketMRTH and is protected by international copyright laws.
    
    6. Privacy
    
    Please review our Privacy Policy to understand how we collect, use, and safeguard your information.
    
    7. Governing Law
    
    These terms shall be governed by and construed in accordance with the laws of the Philippines. Any disputes arising from these terms or your use of PocketMRTH shall be subject to the exclusive jurisdiction of the courts in the Philippines.
    
    8. Contact Us
    
    If you have any questions about these terms, please contact us.
    
   `;

  return (
    <Modal
      visible={isVisible}
      animationType='none'
      onRequestClose={onClose}
      transparent={false}
    >
      <View style={styles.modalContent}>
        <ScrollView>
          <Text style={styles.modalText}>
              {tosText}
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
    // centered
    alignSelf: 'center',
    justifyContent: 'center',
   
  },
  modalText: {
    fontSize: 16,
    color: colors.modal.text,
  },
  button: {
    height: size.button.height
  }
});

export default TOSModal;
