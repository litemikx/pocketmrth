import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const colors = require('../../assets/colors.json');

const colorsObject = {
    'SENT': colors.bar.sent,
    'FILTERED': colors.bar.filtered,
    'ERROR': colors.bar.error,
    'QUEUED': colors.bar.queued,
    'RECEIVED': colors.bar.received
};

const ChannelStackedBarChart = ({ data }) => {
    const item = data;

    // get sum of values in data.statistics.entry array
    var sum = data.statistics.entry.map((stat, index) => {
        const labelKey = Object.keys(stat)[0];
        const labelValue = stat[labelKey];

        const statKey = Object.keys(stat)[1];
        const statValue = stat[statKey];

        return statValue;
    }).reduce((a, b) => a + b, 0);

    sum = item.queued + sum;

    return (
        <View style={styles.container}>
            <View style={styles.barContainer}>
                {data.statistics.entry.map((stat, index) => {
                    const labelKey = Object.keys(stat)[0];
                    const labelValue = stat[labelKey];

                    const statKey = Object.keys(stat)[1];
                    const statValue = stat[statKey];

                    return (<View
                        key={index}
                        style={[styles.bar, { width: `${(statValue / sum) * 100}%`, backgroundColor: colorsObject[labelValue] }]}>
                        <Text>{statValue}</Text>
                    </View>
                    )
                })}
                <View
                    key={5}
                    style={[styles.bar, { width: `${(data.queued / sum) * 100}%`, backgroundColor: colorsObject['QUEUED'] }]}>
                    <Text>{data.queued}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },
    barContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    bar: {
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChannelStackedBarChart;
