import React from 'react';
import {
	AsyncStorage,
	StyleSheet,
	Text,
	View,
	TextInput,
	ScrollView
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { graphql, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
	Button,
	Container,
	Label,
	Spinner
} from '../components';

const LOGIN = gql`
	mutation LoginMutation($emailOrUsername: String!, $password: String!) {
		jwt: login(emailOrUsername: $emailOrUsername, password: $password) 
	}
`;

const styles = StyleSheet.create({
	scroll: {
		padding: 30,
		flexDirection: 'column'
	},
	scrollContainer: {
		flexGrow: 1,
		justifyContent: 'center'
	},
	textInput: {
		height: 60,
		fontSize: 20,
		textAlign: 'center'
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

class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			identifier: '',
			password: '',
		};
	}

	render() {
		return (
			<Mutation mutation={LOGIN}>
				{(login, { loading, error, data, called }) => {
					console.log({ loading, error, data, called });
					if (loading) {
						return <Spinner />;
					} else if (data) {
						AsyncStorage.setItem('auth_token', data.jwt).then(() => {
							Actions.reset('participate');
						}).catch(err => {
							console.log(err);
						});
					}

					return (
						<ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
							<Container>
								<Text style={styles.title}>Please Sign In</Text>
							</Container>
							<Container>
								<TextInput
									style={styles.textInput}
									placeholder='Username or Email'
									autoCapitalize='none'
									autoCorrect={false}
									onChangeText={text => this.setState({ ...this.state, identifier: text })}
								/>
							</Container>
							<Container>
								<TextInput
									style={styles.textInput}
									placeholder='Password'
									autoCapitalize='none'
									autoCorrect={false}
									secureTextEntry={true}
									onChangeText={text => this.setState({ ...this.state, password: text })}
								/>
							</Container>
							<Container>
								<Button
									label='Sign In'
									styles={{button: styles.primaryButton, label: styles.buttonWhiteText}}
									onPress={() => {
										const { identifier, password } = this.state;
										login({ variables: { emailOrUsername: identifier, password: password } })
									}}
									disabled={this.state.identifier.trim().length === 0 || this.state.password.trim().length === 0}
								/>
							</Container>
							<Container>
								<Button
									label='New here ? Register'
									styles={{button: styles.primaryButton, label: styles.buttonWhiteText}}
									onPress={() => Actions.register()}
								/>
							</Container>
							{
								error && error.graphQLErrors &&
								error.graphQLErrors.map(({ message }, i) => <Text style={styles.error} key={i}>{message}</Text>)
							}
						</ScrollView>
					);
				}}
			</Mutation>
		);
	}
}

export default Login;
