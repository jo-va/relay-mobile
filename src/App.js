import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { storage } from './common';
//import { createStore, applyMiddleware } from 'redux';
//import { Provider } from 'react-redux';
//import ReduxThunk from 'redux-thunk';
//import reducers from './reducers';
import Router from './Router';

// Redux:
// https://medium.com/netscape/how-to-integrate-graphql-with-redux-in-react-native-c1912bf33120
// http://jasonwatmore.com/post/2017/09/16/react-redux-user-registration-and-login-tutorial-example

// Auth:
// https://medium.com/handlebar-labs/graphql-authentication-with-react-native-apollo-part-2-2-13ac8c362113
// https://code.tutsplus.com/tutorials/common-react-native-app-layouts-login-page--cms-27639

const httpLink = new HttpLink({
	uri: 'https://04a58257.ngrok.io/graphql'
});

const authLink = setContext((req, { headers }) => {
	const token = storage.get('auth_token');
	const authorization =  token ? `Bearer ${token}` : null;

	return {
		headers: {
			...headers,
			authorization
		}
	};
})

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
