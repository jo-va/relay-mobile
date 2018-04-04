import React from 'react';
import {
	ScrollView,
	StyleSheet,
	View,
	Text
} from 'react-native';
import { graphql, Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Actions } from 'react-native-router-flux';
import {
	Button,
	Container,
	Spinner
} from '../components';
import { storage } from '../common';

const CURRENT_PARTICIPANT = gql`
	query Participant {
		currentParticipant {
			id
			username
			user {
				id
			}
			group {
				name
			}
		}
	}
`;

class Dashboard extends React.Component {
	logout() {
		console.log(storage.get('auth_token'));
		storage.remove('auth_token');
		Actions.reset('auth');
	}

	render() {
		return (
			<Query
				query={CURRENT_PARTICIPANT}
			>
				{({ loading, data: { currentParticipant } }) => {
					if (loading) {
						return <Spinner />;
					}
					return (
						<ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
							<Text>Welcome {currentParticipant && currentParticipant.username}</Text>
							<Container>
								<Button
									label='Logout'
									styles={{button: styles.primaryButton, label: styles.buttonWhiteText}}
									onPress={this.logout.bind(this)}
								/>
							</Container>
						</ScrollView>
					);
				}}
			</Query>
		);
	}
}

const styles = StyleSheet.create({
	scroll: {
		padding: 30,
		flexDirection: 'column'
	},
	scrollContainer: {
		flexGrow: 1,
		justifyContent: 'center'
	},	
	primaryButton: {
		backgroundColor: '#34a853'
	},
	buttonWhiteText: {
		fontSize: 20,
		color: '#fff'
	}
});

export default Dashboard;
