import React from 'react';
import { StyleSheet, Text, TouchableHighlight } from 'react-native';

const styles = StyleSheet.create({
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20
	},
	disabled: {
		opacity: 0.4
	}
});

const Button = (props) => {
	function getContent() {
		if (props.children) {
			return props.children;
		}
		return <Text style={props.styles.label}>{props.label}</Text>;
	}

	return (
		<TouchableHighlight
			underlayColor='#ccc'
			onPress={!props.disabled ? props.onPress : null}
			style={[
				props.noDefaultStyles ? '' : styles.button,
				props.styles ? props.styles.button : '',
				props.disabled ? styles.disabled : ''
			]}
		>
			{getContent()}
		</TouchableHighlight>
	);
};

export { Button };
