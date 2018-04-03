import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';

const styles = StyleSheet.create({
	textInput: {
		height: 45,
		fontSize: 20,
		textAlign: 'center'
	},
	error: {
		fontSize: 15,
		color: 'red',
		textAlign: 'center'
	}
});

const TextField = (props) => {
	const { error, ...other } = props;

	return (
		<View>
			<TextInput
				style={styles.textInput}
				{...other}
			/>
			{error ? <Text style={styles.error}>{error}</Text> : null}
		</View>
	);
};

export { TextField };
