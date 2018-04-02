import React, { Component } from 'react';
import { Alert } from 'react-native';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';

class BgTracking extends Component {
	componentDidMount() {
		BackgroundGeolocation.configure({
			desiredAccuracy: 10,
			stationaryRadius: 50,
			distanceFilter: 50,
			notificationTitle: 'Background tracking',
			notificationText: 'enabled',
			debug: true,
			startOnBoot: false,
			stopOnTerminate: false,
			locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
			interval: 10000,
			fastestInterval: 5000,
			activitiesInterval: 10000,
			stopOnStillActivity: false,
			url: 'http://192.168.81.15:3000/location',
			httpHeaders: {
				'X-FOO': 'bar'
			},
			// customize post properties
			postTemplate: {
				lat: '@latitude',
				lon: '@longitude',
				foo: 'bar' // you can also add your own properties
			}
		});

		BackgroundGeolocation.on('location', (location) => {
			// handle your locations here
			// to perform long running operation on iOS
			// you need to create background task
			BackgroundGeolocation.startTask(taskKey => {
				// execute long running task
				// eg. ajax post location
				// IMPORTANT: task has to be ended by endTask
				BackgroundGeolocation.endTask(taskKey);
			});
		});

		BackgroundGeolocation.on('stationary', (stationaryLocation) => {
			// handle stationary locations here
			Actions.sendLocation(stationaryLocation);
		});

		BackgroundGeolocation.on('error', (error) => {
			console.log('[ERROR] BackgroundGeolocation error:', error);
		});

		BackgroundGeolocation.on('start', () => {
			console.log('[INFO] BackgroundGeolocation service has been started');
		});

		BackgroundGeolocation.on('stop', () => {
			console.log('[INFO] BackgroundGeolocation service has been stopped');
		});

		BackgroundGeolocation.on('authorization', (status) => {
			console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
			if (status !== BackgroundGeolocation.AUTHORIZED) {
				Alert.alert('Location services are disabled', 'Would you like to open location settings?', [
					{ text: 'Yes', onPress: () => BackgroundGeolocation.showLocationSettings() },
					{ text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
				]);
			}
		});

		BackgroundGeolocation.on('background', () => {
			console.log('[INFO] App is in background');
		});

		BackgroundGeolocation.on('foreground', () => {
			console.log('[INFO] App is in foreground');
		});

		BackgroundGeolocation.checkStatus(status => {
			console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
			console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
			console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

			// you don't need to check status before start (this is just the example)
			if (!status.isRunning) {
				BackgroundGeolocation.start(); //triggers start on start event
			}
		});

		// you can also just start without checking for status
		// BackgroundGeolocation.start();
	}

	componentWillUnmount() {
		// unregister all event listeners
		BackgroundGeolocation.events.forEach(event => BackgroundGeolocation.removeAllListeners(event));
	}
}

export default BgTracking;
