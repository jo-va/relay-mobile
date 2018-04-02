import React from 'react';
import { AsyncStorage } from 'react-native';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
//import { createStore, applyMiddleware } from 'redux';
//import { Provider } from 'react-redux';
//import ReduxThunk from 'redux-thunk';
//import reducers from './reducers';
import Router from './Router';

const httpLink = new HttpLink({
	uri: 'https://51cff600.ngrok.io/graphql'
});

const authLink = setContext((req, { headers }) => {
	AsyncStorage.getItem('auth_token').then(token => {
		return {
			headers: {
				...headers,
				authorization: token ? `Bearer ${token}` : ''
			}
		};
	}).catch(err => {
		console.log('AuthMiddleware: ', err);
	});
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		graphQLErrors.map(({ message, locations, path}) => {
			console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
		});
	}
	if (networkError) {
		console.log(`[Network error]: ${networkError}`);
	}
});

const client = new ApolloClient({
	link: ApolloLink.from([
		errorLink,
		authLink,
		httpLink
	]),
	cache: new InMemoryCache()
});

class App extends React.Component {
	render() {
		//const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

		return (
			<ApolloProvider client={client}>
				<Router />
			</ApolloProvider>
		);
	}
}

export default App;
