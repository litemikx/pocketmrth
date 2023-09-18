import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const colors = require('../../assets/colors.json');
const screenWidth = Dimensions.get('window').width;

const ServerPieChart = ({ data }) => {
  const totalConnectionsUp = data.totalConnectionsUp;
  const totalConnections = data.totalConnections

  const chartData = [
    {
      name: '(' + data.totalConnectionsUp + ') ' + 'Up',
      count: data.totalConnectionsUp,
      color: colors.pie.up,
      legendFontColor: colors.pie.up,
      legendFontSize: 15,
    },
    {
      name: '(' + (data.totalConnections - data.totalConnectionsUp) + ') ' + 'Down',
      count: data.totalConnections - data.totalConnectionsUp,
      color: colors.pie.down,
      legendFontColor: colors.pie.down,
      legendFontSize: 15,
    },
  ];

  return (
    <>
      <Text style={styles.title}>Connection Status</Text>
      <PieChart
        data={chartData}
        width={screenWidth - 20}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        }}
        accessor="count"
        backgroundColor="transparent"
        paddingLeft="15"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default ServerPieChart;
