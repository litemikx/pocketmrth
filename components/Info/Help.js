// Help page component that contain some tutorial and links to the blog guide

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';

// import icons
import { FontAwesome, AntDesign, SimpleLineIcons, Octicons, Feather, Foundation, Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';

const colors = require('../../assets/colors.json');
const fonts = require('../../assets/fonts.json');

const Help = () => {

    const navigation = useNavigation();

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <View style={styles.topContainer}>
                <Text style={styles.title}>Need help?</Text>
            </View>

            <View style={styles.middleContainer}>
                {/** Tutorial link to how to use the app */}
                <View style={styles.tutorial}>
                    <Text style={styles.listTitle}>Tutorial:</Text>
                    <Text style={styles.description}>Check out our tutorial on how to use the app.</Text>
                    <Text style={styles.link} onPress={() => Linking.openURL('https://thisdevblogs.wordpress.com/2023/09/18/pocketmrth-a-mobile-app-to-monitor-your-mirth-connect/')}>Tutorial</Text>
                </View>
                {/** Link to the github page */}
                <View style={styles.github}>
                    <Text style={styles.listTitle}>Github:</Text>
                    <Text style={styles.description}>Check out our github page for more information.</Text>
                    <Text style={styles.link} onPress={() => Linking.openURL('https://github.com/litemikx/pocketmrth')}>Github</Text>
                </View>
                {/** Contact email */}
                <View style={styles.contact}>
                    <Text style={styles.listTitle}>Contact:</Text>
                    <Text style={styles.description}>For any questions or feedback, please contact us at:</Text>
                    <Text style={styles.link} onPress={() => Linking.openURL('mailto:charmiequino@gmail.com')}>charmiequino@gmail.com</Text>
                </View> 

                {/* List of icons in the app and their usages or meaning */}
                <View style={styles.iconList}>
                    <Text style={styles.listTitle}>Icon Meanings:</Text>
                    <View style={styles.iconItem}>
                        <Text style={styles.iconMeaning}><AntDesign name="infocirlce" size={26} color={colors.bar.system} /> - Info</Text>
                        {/** Add Description for icon "Info" */}
                        <Text style={styles.iconDescription}>This icon is used to display information about the system.</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <Text style={styles.iconMeaning}><AntDesign name="upcircle" size={26} color={colors.status.up} /> - Active/Up</Text>
                        {/** Add Description for "Active" status */}
                        <Text style={styles.iconDescription}>This icon is used to display that the system is active or up.</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <Text style={styles.iconMeaning}><AntDesign name="downcircle" size={26} color={colors.status.down} /> - Inactive/Down</Text>
                        {/** Add Description for "Inactive" status */}
                        <Text style={styles.iconDescription}>This icon is used to display that the system is inactive or down.</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <Text style={styles.iconMeaning}><SimpleLineIcons name="event" size={26} color={colors.button.background} /> - Event</Text>
                        {/** Add Description for "Event" icon */}
                        <Text style={styles.iconDescription}>This icon is used to display an event that happened in the system.</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <Text style={styles.iconMeaning}><AntDesign name="delete" size={26} color={colors.button.background} /> - Delete</Text>
                        {/** Add Description for "Delete" icon */}
                        <Text style={styles.iconDescription}>This icon is used to delete an item or event.</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <Text style={styles.iconMeaning}><FontAwesome name="edit" size={26} color={colors.button.background} /> - Edit</Text>
                        {/** Add Description for "Edit" icon */}
                        <Text style={styles.iconDescription}>This icon is used to edit an item or event.</Text>
                    </View>
                    {/** The following icons which are stop, play, pause, deploy and undeploy are for channel commands sent to the Mirth server */}
                    <View style={styles.iconItem}>
                        <Text style={styles.iconMeaning}><FontAwesome name="stop-circle-o" size={26} color="#f28482" /> - Stop</Text>
                        {/** Add Description for "Stop" icon */}
                        <Text style={styles.iconDescription}>This icon is used to stop a channel.</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <Text style={styles.iconMeaning}><Foundation name="play-circle" size={26} color="#84a59d" /> - Play</Text>
                        {/** Add Description for "Play" icon */}
                        <Text style={styles.iconDescription}>This icon is used to start a channel.</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <Text style={styles.iconMeaning}><Feather name="pause-circle" size={26} color="#f5cac3" /> - Pause</Text>
                        {/** Add Description for "Pause" icon */}
                        <Text style={styles.iconDescription}>This icon is used to pause a channel.</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <Text style={styles.iconMeaning}><Octicons name="feed-rocket" size={26} color="black" /> - Deploy</Text>
                        {/** Add Description for "Deploy" icon */}
                        <Text style={styles.iconDescription}>This icon is used to deploy a channel.</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <Text style={styles.iconMeaning}><Octicons name="stop" size={26} color="black" /> - Undeploy</Text>
                        {/** Add Description for "Undeploy" icon */}
                        <Text style={styles.iconDescription}>This icon is used to undeploy a channel.</Text>
                    </View>
                    {/** The next 2 icons are for the "notification" alert showing if its enabled or disabled. */}
                    <View style={styles.iconItem}>
                        <Text style={styles.iconMeaning}><Ionicons name="notifications-circle" size={26} color="black" /> - Notification On</Text>
                        {/** Add Description for "Notification On" icon */}
                        <Text style={styles.iconDescription}>This icon is used to display that the notification is enabled.</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <Text style={styles.iconMeaning}><Ionicons name="notifications-off-circle" size={26} color="black" /> - Notification Off</Text>
                        {/** Add Description for "Notification Off" icon */}
                        <Text style={styles.iconDescription}>This icon is used to display that the notification is disabled.</Text>
                    </View>
                    {/** The next 3 icons are for the event status which are information, warning and error */}
                    <View style={styles.iconItem}>
                        <Text style={styles.iconMeaning}> <AntDesign name="infocirlce" size={26} color={colors.event_status.information} /> - Event Information</Text>
                        {/** Add Description for "Event Information" icon */}
                        <Text style={styles.iconDescription}>This icon is used to display information about the event.</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <Text style={styles.iconMeaning}> <Entypo name="warning" size={26} color={colors.event_status.warning} /> - Event Warning</Text>
                        {/** Add Description for "Event Warning" icon */}
                        <Text style={styles.iconDescription}>This icon is used to display a warning about the event.</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <Text style={styles.iconMeaning}> <MaterialIcons name="error" size={26} color={colors.event_status.error} /> - Event Error</Text>
                        {/** Add Description for "Event Error" icon */}
                        <Text style={styles.iconDescription}>This icon is used to display an error about the event.</Text>
                    </View>
                </View>
                   
            </View>
        </ScrollView>

    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 10,
        fontSize: fonts.body.size,
        backgroundColor: colors.body.background
    },
    topContainer: {
        alignItems: 'center',
        justifyContent: 'top',
        padding: 20,
    },
    middleContainer: {
        alignItems: 'left',
        justifyContent: 'top',
        paddingLeft: 10,
        paddingRight: 10
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    text: {
        fontSize: 16,
        marginBottom: 20,
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 10,
    },
    description: {
        fontSize: fonts.body.size,
        marginBottom: 10,
    },
    iconList: {
        marginBottom: 20,
    },
    iconItem: {
        marginBottom: 10,
    },
    iconMeaning: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    iconDescription: {
        fontSize: 16,
        marginBottom: 10,
    },
    link: {
        fontSize: fonts.body.size,
        color: colors.link.text,
        marginBottom: 10,
    },
});

export default Help;