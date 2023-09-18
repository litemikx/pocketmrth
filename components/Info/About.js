// About page component

import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// import TOSModal
import TOSModal from './TOSModal';
// import PrivacyModal
import PrivacyModal from './PrivacyPolicyModal';

const colors = require('../../assets/colors.json');
const fonts = require('../../assets/fonts.json');

const About = () => {

    // Modal for TOS
    const [isTOSModalVisible, setTOSModalVisible] = useState(false);
    // Modal for Privacy Policy
    const [isPrivacyModalVisible, setPrivacyModalVisible] = useState(false);

    const toggleTOSModal = () => {
        setTOSModalVisible(!isTOSModalVisible);
    };

    const togglePrivacyModal = () => {
        setPrivacyModalVisible(!isPrivacyModalVisible);
    };

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Image
                    style={styles.logo}
                    source={require('../../assets/logo.png')}
                />
                <Text style={styles.title}>PocketMRTH</Text>
            </View>
            <View style={styles.bottomContainer}>
                <Text style={styles.description}>PocketMRTH is a mobile app for Mirth Connect administrators to monitor their Mirth Connect servers on the go. It allows you to check system info, usage and channel statistics.
                    It is built with React Native and Expo.</Text>
                <Text style={styles.description}>This version of PocketMRTH is free to use. Please make sure to read the TOS.
                    {'\n'}
                    {'\n'}
                    PocketMRTH is not affiliated with NextGen Healthcare or Mirth Corporation.</Text>
            </View>
            {/* Link to open a modal for TOS */}
            <TouchableOpacity onPress={toggleTOSModal}>
                <Text style={styles.link}>Terms of Service</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={togglePrivacyModal}>
                <Text style={styles.link}>Privacy Policy</Text>
            </TouchableOpacity>

            <TOSModal isVisible={isTOSModalVisible} onClose={toggleTOSModal} />

            <PrivacyModal isVisible={isPrivacyModalVisible} onClose={togglePrivacyModal}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.body.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
    title: {
        fontFamily: "MajorMonoDisplay-Regular",
        fontSize: 24,
        marginBottom: 10,
    },
    description: {
        fontSize: fonts.body.size,
        marginBottom: 10,
    },
    link: {
        fontSize: fonts.body.size,
        color: colors.link.text,
        marginBottom: 10,
    },
});

export default About;