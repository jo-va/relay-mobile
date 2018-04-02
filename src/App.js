import React from 'react';
import { AsyncStorage } from 'react-native';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, from } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
//import { createStore, applyMiddleware } from 'redux';
//import { Provider } from 'react-redux';
//import ReduxThunk from 'redux-thunk';
//import reducers from './reducers';
import Router from './Router';

const httpLink = new HttpLink({
	uri: 'https://1899aeb8.ngrok.io/graphql'
});

const authMiddleware = setContext((req, { headers }) => {
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

const client = new ApolloClient({
	link: from([authMiddleware, httpLink]),
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
