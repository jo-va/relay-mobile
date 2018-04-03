import React from 'react';
import {
	AsyncStorage,
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
import { isBlank } from '../common';

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

const REGISTER = gql`
	mutation RegisterMutation($username: String!, $email: String!, $password: String!) {
		jwt: register(username: $username, email: $email, password: $password) 
	}
`;

const CONSTRAINTS = {
	email: {
		presence: {
			allowEmpty: false,
			message: '^Please provide an email address'
		},
		email: {
			message: '^Please enter a valid email adress'
		}
	},
	username: {
		presence: {
			allowEmpty: false,
			message: '^Please provide a username'
		}
	},
	password: {
		presence: {
			allowEmpty: false,
			message: '^Please enter a password'
		},
		length: {
			minimum: 4,
			message: '^Your password must be at least 4 characters'
		}
	},
	confirmationPassword: {
		presence: {
			allowEmpty: false,
			message: '^Please confirm your password'
		},
		equality: {
			attribute: 'password',
			message: '^Passwords must match'
		}
	}
};

const INITIAL_STATE = {
	username: '',
	usernameError: '',
	email: '',
	emailError: '',
	password: '',
	passwordError: '',
	confirmationPassword: '',
	confirmationPasswordError: '',
	errors: []
};

class Register extends React.Component {

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

	doRegister(registerMutation) {
		if (this.canRegister()) {
			const { username, email, password } = this.state;
			registerMutation({ variables: { username, email, password } });
		}
	}

	registerSuccess(data) {
		AsyncStorage.setItem('auth_token', data.jwt);
		Actions.reset('participate');
	}

	registerFailure(error) {
		const newState = { ...INITIAL_STATE };

		if (error && error.graphQLErrors) {
			newState.errors.push(error.graphQLErrors.map(({ message }) => message));
		}
		if (error && error.networkError) {
			newState.errors.push(error.networkError.map(({ message }) => message));
		}

		this.setState(newState);
	}

	canRegister() {
		return !validatejs.validate({
			email: this.state.email,
			username: this.state.username,
			password: this.state.password,
			passwordConfirmation: this.state.passwordConfirmation
		}, CONSTRAINTS);
	}

	validateEmail() {
		const errors = validatejs.single(this.state.email, CONSTRAINTS.email);
		this.setState({ ...this.state, emailError: errors ? errors[0] : null });
	}

	validateUsername() {
		const errors = validatejs.single(this.state.username, CONSTRAINTS.username);
		this.setState({ ...this.state, usernameError: errors ? errors[0] : null });
	}

	validatePassword() {
		const errors = validatejs.single(this.state.password, CONSTRAINTS.password);
		this.setState({ ...this.state, passwordError: errors ? errors[0] : null });
	}

	validateConfirmationPassword() {
		const errors = validatejs.single(this.state.confirmationPassword, CONSTRAINTS.confirmationPassword);
		this.setState({ ...this.state, confirmationPasswordError: errors ? errors[0] : null });
	}

	render() {
		console.log(this.state);
		return (
			<Mutation
				mutation={REGISTER}
				onCompleted={this.registerSuccess.bind(this)}
				onError={this.registerFailure.bind(this)}
			>
				{(register, { loading }) => {
					if (loading) {
						return <Spinner />;
					}
					return (
						<ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
							<Container>
								<Text style={styles.title}>Please Register</Text>
							</Container>
							<Container>
								<TextField
									placeholder='Email'
									autoCapitalize='none'
									autoCorrect={false}
									onChangeText={value => this.handleInputChange('email', value)}
									onBlur={this.validateEmail.bind(this)}
									error={this.state.emailError}
								/>
							</Container>
							<Container>
								<TextField
									placeholder='Username'
									autoCapitalize='none'
									autoCorrect={false}
									onChangeText={value => this.handleInputChange('username', value)}
									onBlur={this.validateUsername.bind(this)}
									error={this.state.usernameError}
								/>
							</Container>
							<Container>
								<TextField
									placeholder='Password'
									autoCapitalize='none'
									autoCorrect={false}
									onChangeText={value => this.handleInputChange('password', value)}
									onBlur={this.validatePassword.bind(this)}
									error={this.state.passwordError}
								/>
							</Container>
							<Container>
								<TextField
									placeholder='Confirm Password'
									autoCapitalize='none'
									autoCorrect={false}
									onChangeText={value => this.handleInputChange('passwordConfirmation', value)}
									onBlur={this.validateConfirmationPassword.bind(this)}
									error={this.state.confirmationPasswordError}
								/>
							</Container>
							<Container>
								<Button
									label='Register'
									styles={{button: styles.primaryButton, label: styles.buttonWhiteText}}
									onPress={() => this.doRegister(register)}
									disabled={!this.canRegister()}
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

export default Register;
