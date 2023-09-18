import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import CallApiMethod from '../CallApiMethod';
// import SystemModal
import SystemModal from '../Info/SystemModal';

const colors = require('../../assets/colors.json');
const fonts = require('../../assets/fonts.json');
const screenWidth = Dimensions.get('window').width;

const ConnectionBarChart = ({ data }) => {
    const connection = data;

    // set system info
    const [system, setSystemInfo] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const getSystemInfo = (connection) => {
        return async () => {
            console.log('systemInfo connection:', connection);
            const systemInfoRaw = await CallApiMethod.getSystemInfo(connection);
            const systemInfoStats = await CallApiMethod.getSystemStats(connection);
            
            const systemInfo = {};
            systemInfo['info'] = systemInfoRaw["com.mirth.connect.model.SystemInfo"];
            systemInfo['stats'] = systemInfoStats["com.mirth.connect.model.SystemStats"];
            systemInfo['id'] = connection.id;

            setSystemInfo(systemInfo);
            toggleModal();
        }
    }

    return (

        <View key={connection.id} style={styles.chartContainer}>
            <Text style={styles.chartTitle}>{connection.name}</Text>
            <Button title="System" onPress={getSystemInfo(connection.connection)} color={colors.bar.system} />
           
            <BarChart
                data={{
                    labels: ['Sent', 'Filtered', 'Error', 'Queued', 'Received'],
                    datasets: [
                        {
                            data: [
                                connection.stats.sent,
                                connection.stats.filtered,
                                connection.stats.error,
                                connection.stats.queued,
                                connection.stats.received,
                            ],
                            colors: [
                                // dark green
                                (opacity = 0.7) => colors.bar.sent,
                                // yellow
                                (opacity = 0.7) => colors.bar.filtered,
                                // red
                                (opacity = 0.7) => colors.bar.error,
                                // orange
                                (opacity = 0.7) => colors.bar.queued,
                                // light green
                                (opacity = 0.7) => colors.bar.received,
                            ], // Select color based on index
                        },
                    ],
                }}
                // width 90% of screen
                width={screenWidth}
                height={350}
                // remove Y axis labels
                fromZero={true}
                chartConfig={{
                    backgroundGradientFrom: '#f7ede2',
                    backgroundGradientTo: '#f7ede2',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                decimalPlaces={0}
                withHorizontalLabels={false}
                verticalLabelRotation={90}
                flatColor={true}
                showValuesOnTopOfBars={true}
                withCustomBarColorFromData={true}
                showBarTops={false}
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}

            />
            <Text>{'\n'}</Text>
            {system ? <SystemModal style={stylesModal.modalContent} isVisible={isModalVisible} onClose={toggleModal} data={system} /> : null}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    chartContainer: {
        marginBottom: 20,
    },
    chartTitle: {
        fontSize: fonts.header3.size,
        fontWeight: 'bold',
        marginBottom: 10,
        alignContent: 'center',
        textAlign: 'center',
    },
});

const stylesModal = StyleSheet.create({
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width: '90%',
      // scrollable
      minHeight: 300,
      // centered
      alignSelf: 'center',
      justifyContent: 'center',
      // shadow
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
    }
});

export default ConnectionBarChart;
