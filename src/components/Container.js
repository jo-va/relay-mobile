import React from 'react';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
	container: {
		marginBottom: 20
	}
});

const Container = (props) => {
	return (
		<View style={styles.container}>
			{props.children}
		</View>
	);
};

export { Container };
