import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	ScrollView
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { graphql, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import validatejs from 'validate.js';
import {
	Button,
	Container,
	TextField,
	Spinner
} from '../components';

const PARTICIPATE = gql`
	mutation ParticipateMutation($secretToken: String!) {
		participate(secretToken: $secretToken) {
			username
			group {
				name
			}
		} 
	}
`;

const CONSTRAINTS = {
	secret: {
		presence: {
			allowEmpty: false,
			message: '^Please provide an secret token'
		}
	}
};

const INITIAL_STATE = {
	secret: '',
	secretError: '',
	errors: []
};

class Participate extends React.Component {

	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
	}

	doParticipate(participateMutation) {
		if (this.canParticipate()) {
			participateMutation({ variables: { secretToken: this.state.secret } });
		}
	}

	participateSuccess(data) {
		console.log(data);
		Actions.reset('main');
	}

	participateFailure(error) {
		const newState = { ...INITIAL_STATE };
		const errors = [];

		if (error && error.graphQLErrors) {
			errors.push(error.graphQLErrors.map(({ message }) => message));
		}
		if (error && error.networkError) {
			errors.push(error.networkError.message);
		}

		this.setState({ ...newState, errors });
	}

	canParticipate() {
		return !validatejs.single(this.state.secret, CONSTRAINTS.secret);
	}

	validateSecret() {
		const errors = validatejs.single(this.state.secret, CONSTRAINTS.secret);
		this.setState({ ...this.state, secretError: errors ? errors[0] : null });
	}

	render() {
		console.log(this.state);
		return (
			<Mutation
				mutation={PARTICIPATE}
				onCompleted={this.participateSuccess.bind(this)}
				onError={this.participateFailure.bind(this)}
			>
				{(participate, { loading }) => {
					if (loading) {
						return <Spinner />;
					}
					return (
						<ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
							<Container>
								<Text style={styles.title}>Secret token</Text>
							</Container>
							<Container>
								<TextField
									placeholder='Secret'
									autoCapitalize='none'
									autoCorrect={false}
									onChangeText={secret => this.setState({ ...this.state, secret })}
									onBlur={this.validateSecret.bind(this)}
									error={this.state.secretError}
								/>
							</Container>
							<Container>
								<Button
									label='Participate'
									styles={{button: styles.primaryButton, label: styles.buttonWhiteText}}
									onPress={() => this.doParticipate(participate)}
									disabled={!this.canParticipate()}
								/>
							</Container>
							{this.state.errors.map((error, i) => <Text style={styles.error} key={i}>{error}</Text>)}	
						</ScrollView>
					);
				}}
			</Mutation>
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
	},
	title: {
		fontSize: 30,
		fontWeight: 'bold',
		fontFamily: 'Verdana',
		alignSelf: 'center'
	},
	error: {
		fontSize: 20,
		color: 'red',
		padding: 20,
		textAlign: 'center'
	}
});

export default Participate;
