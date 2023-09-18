import React from 'react';
import { Modal, View, Text, Button, Pressable, StyleSheet, ScrollView } from 'react-native';
// import colors from '../assets/colors';
const colors = require('../../assets/colors.json');

const PrivacyPolicyModal = ({ isVisible, onClose }) => {
  var tosText = `
    
PocketMRTH - Privacy Policy

Last updated: September 18, 2023

Please take a moment to familiarize yourself with our Privacy Policy and let us know if you have any questions. This privacy policy governs your use of the software application PocketMRTH (“Application”) for mobile devices that was created by Charmie Quino ("https://litemikx.github.io/heymikko/").


Introduction

This Privacy Policy ("Privacy Policy") describes the privacy practices that we, PocketMRTH ("we", "us", or "our"), employ with regard to collecting, using and disclosing information, both personal and non-personal information, which we receive when you use our services. By using the Services you consent to the practices described in this Privacy Policy. IF YOU DO NOT AGREE WITH THE PRACTICES EXPLAINED IN THIS PRIVACY POLICY, DO NOT ACCESS, BROWSE OR USE THE POCKETMRTH SERVICES.

We are committed to safeguarding any information collected through the Services. This Privacy Policy is intended to inform you of our policies and procedures regarding the collection, use and disclosure of information on our Services. We also want to inform you about your choices regarding information you share with us. If you have any questions or concerns, please let us know (see "Contact us" section below).


What information do we collect?

We do not collect any personal information or data from you when you use our App. The
data you enter or generate while using the App is stored locally on your device and is not
shared with any external services or entities.


Do you collect precise real time location information of the device?

This Application does not collect precise information about the location of your mobile device.


Do third parties see and/or have access to information obtained by the Application?

No. We do not share your information with third parties.


What are my opt-out rights?

You can stop all collection of information by the Application easily by uninstalling the Application. You may use the standard uninstall processes as may be available as part of your mobile device or via the mobile application marketplace or network.


Security

We take reasonable measures to protect the data stored within the Application on your device.
However, please be aware that the security of data on your device is your responsibility.
We cannot guarantee the security of your device or data stored on it.


Children 

The Application is not intended for use by children under the age of 13. We do not knowingly
collect personal information from children under 13 years of age.


Changes

We may update this Privacy Policy to reflect changes in our information practices, such
as new features or updates to the Application. We encourage you to review this Privacy Policy
periodically for any updates. The "Last Updated" date at the top of this page indicates
when this Privacy Policy was last revised.

Contact us

If you have any questions regarding privacy while using the Application, or have questions
about our practices, please contact us via email at charmiequino@gmail.com.

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
    maxHeight: '90%',
    // centered
    alignSelf: 'center',
    justifyContent: 'center',

  },
  modalText: {
    fontSize: 16,
    color: colors.modal.text,
  },
});

export default PrivacyPolicyModal;
