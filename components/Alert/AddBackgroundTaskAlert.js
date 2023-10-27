// Create a background task based on record alert for specific user
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import CallApiMethod from "../CallApiMethod";
import GetConnections from "../Connection/GetConnections";
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { channel } from 'expo-updates';

export default async function AddBackgroundTask(notificationFlag, pollTIme) {
  const BACKGROUND_FETCH_TASK = 'push-notification-alert';
  if (!notificationFlag) {
    // unregister all tasks in the notificationsArray
    var unreg = await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    console.log('unregisterAllTasksAsync', unreg);
  } else {
    TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
      var conns = await GetConnections();

      // Fetch and load connection records from AsyncStorage
      const currentUserId = await AsyncStorage.getItem('currentUserId');

      // get alert if existing
      const alerts = await AsyncStorage.getItem('alerts');
      // filter alerts based on currentUserId on alerts.user_id
      const alertsArray = alerts ? JSON.parse(alerts) : [];
      const alert = alertsArray.find((alert) => alert.user_id === currentUserId);

      // if alert exists then search data array for connectionId
      if (alert) {
        const data = alert.data;
        const connectionsArray = conns.filter((conn) => {
          // loop in conns and check if id is equal to connection
          var found = false;
          data.map((connection) => {
            if (conn.id == connection.connection) {
              found = true;
            }
          });
          return found;
        });

        var promise_responses = await Promise.all(
          connectionsArray.map(async (conn) => {
            var res = await CallApiMethod.getServerStatus(conn);

            if (res) {
              var stats = await CallApiMethod.getAllChannelsStatistics(conn, 'false');
              if (stats) {
                //console.log('stats', stats);
                var channelStatsArray = stats.list.channelStatistics;
                //console.log('channelStatsArray', channelStatsArray);
                channelStatsArray.map((apiChannelResponse) => {
                  //console.log('apiChannelResponse', apiChannelResponse);
                  // compare apiChannelResponse to the data.connection
                  data.map((alertDataChannelResponse) => {
                    //console.log('alertDataChannelResponse', alertDataChannelResponse);
                    if (conn.id == alertDataChannelResponse.connection) {
                      // compare apiChannelResponse to the data.channels
                      alertDataChannelResponse.channels.map((channel) => {
                        //console.log('channel', channel);
                        if (apiChannelResponse.channelId == channel.id) {
                          // compare apiChannelResponse to the data.channels.statType
                          channel.statType.map(async (statType) => {
                            //console.log('statType', statType);
                            var statName = Object.keys(statType)[0].toLowerCase();
                            //console.log('statName', statName);
                            //console.log('apiChannelResponse[statName]', apiChannelResponse[statName]);
                            //console.log('Object.values(statType)[0]', Object.values(statType)[0]);
                            if (parseInt(apiChannelResponse[statName]) > parseInt(Object.values(statType)[0])) {
                              //console.log('changed in stats');
                              // hash the notification using channel id and stat name and stat value
                              var hash = apiChannelResponse.channelId + statName + apiChannelResponse[statName];
                              //console.log('hash', hash);
                              // get alert if existing
                              const notificationHash = await AsyncStorage.getItem('hashnotificationtracker');
                              //console.log('notificationHash', notificationHash);

                              // filter alerts based on currentUserId on alerts.user_id
                              const notificationHashArray = notificationHash ? JSON.parse(notificationHash) : [];
                              //console.log('notificationHashArray', notificationHashArray);

                              const notificationCheck = notificationHashArray.find((n) => n == hash);
                              //console.log('notificationCheck', notificationCheck);
                              // check if notification already alerted
                              if (notificationCheck) {
                                console.log('notification already alerted');
                              } else {
                                var newNotificationHashArray = notificationHashArray.filter(function (el) {
                                  var str = apiChannelResponse.channelId + statName;
                                  return el.indexOf(str) < 0;
                                });
                                //console.log('newNotificationHashArray', newNotificationHashArray);
                                // add to AsyncStorage hashnotificationtracker
                                newNotificationHashArray.push(hash);
                                await AsyncStorage.setItem('hashnotificationtracker', JSON.stringify(newNotificationHashArray));

                                await Notifications.scheduleNotificationAsync({
                                  content: {
                                    title: channel.name + ' stat updated!',
                                    body: statName.toUpperCase() + ': ' + apiChannelResponse[statName]
                                  },
                                  trigger: null,
                                });
                                //console.log('push noti', apiChannelResponse.channelId, statName, apiChannelResponse[statName]);
                                //console.log('notificationHashArray', notificationHashArray);
                              }

                            }
                          });
                        }
                      });
                    }
                  });
                });
              } else {
                return false;
              }
            } else {
              return false;
            }
          })
        );

        // handle resolve promise
        promise_responses.filter(function (el) {
          return el != null;
        });
      }
    });

    // 2. Register the task at some point in your app by providing the same name,
    // and some configuration options for how the background fetch should behave
    // Note: This does NOT need to be in the global scope and CAN be used in your React components!
    async function registerBackgroundFetchAsync() {
      return await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: pollTIme, // default 10 mins
        stopOnTerminate: false, // android only,
        startOnBoot: false, // android only
      });
    }

    registerBackgroundFetchAsync();
  }
}