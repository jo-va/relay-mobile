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
import { isBlank, storage } from '../common';

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

const LOGIN = gql`
	mutation LoginMutation($emailOrUsername: String!, $password: String!) {
		jwt: login(emailOrUsername: $emailOrUsername, password: $password) 
	}
`;

const CONSTRAINTS = {
	identifier: {
		presence: {
			allowEmpty: false,
			message: '^Please provide a username or email'
		}
	},
	password: {
		presence: {
			allowEmpty: false,
			message: '^Please enter a password'
		}
	}
};

const INITIAL_STATE = {
	identifier: '',
	identifierError: '',
	password: '',
	passwordError: '',
	errors: []
};

class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
	}

	handleInputChange(field, value) {
		this.setState({
			...this.state,
			[field]: value.trim()
		});
	}

	doLogin(loginMutation) {
		if (this.canLogin()) {
			const { identifier, password } = this.state;
			loginMutation({ variables: { emailOrUsername: identifier, password } });
		}
	}

	loginSuccess(data) {
		storage.set('auth_token', data.jwt);
		Actions.reset('participate');
	}

	loginFailure(error) {
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

	canLogin() {
		return !validatejs.validate({
			identifier: this.state.identifier,
			password: this.state.password
		}, CONSTRAINTS);
	}

	validateIdentifier() {
		const error = validatejs.single(this.state.identifier, CONSTRAINTS.identifier);
		this.setState({ ...this.state, identifierError: error ? error[0] : null });
	}

	validatePassword() {
		const error = validatejs.single(this.state.password, CONSTRAINTS.password);
		this.setState({ ...this.state, passwordError: error ? error[0] : null });
	}
	
	render() {
		console.log(this.state);
		return (
			<Mutation
				mutation={LOGIN}
				onCompleted={this.loginSuccess.bind(this)}
				onError={this.loginFailure.bind(this)}
			>
				{(login, { loading }) => {
					if (loading) {
						return <Spinner />;
					}
					return (
						<ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
							<Container>
								<Text style={styles.title}>Please Sign In</Text>
							</Container>
							<Container>
								<TextField
									placeholder='Username or Email'
									autoCapitalize='none'
									autoCorrect={false}
									onChangeText={value => this.handleInputChange('identifier', value)}
									onBlur={this.validateIdentifier.bind(this)}
									error={this.state.identifierError}
								/>
							</Container>
							<Container>
								<TextField
									placeholder='Password'
									autoCapitalize='none'
									autoCorrect={false}
									secureTextEntry={true}
									onChangeText={value => this.handleInputChange('password', value)}
									onBlur={this.validatePassword.bind(this)}
									error={this.state.passwordError}
								/>
							</Container>
							<Container>
								<Button
									label='Sign In'
									styles={{button: styles.primaryButton, label: styles.buttonWhiteText}}
									onPress={() => this.doLogin(login)}
									disabled={!this.canLogin()}
								/>
							</Container>
							<Container>
								<Button
									label='New here ? Register'
									styles={{button: styles.primaryButton, label: styles.buttonWhiteText}}
									onPress={() => Actions.register()}
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

export default Login;
